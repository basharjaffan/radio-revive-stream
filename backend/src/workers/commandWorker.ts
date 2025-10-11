import type { Firestore } from 'firebase-admin/firestore';
import type { MqttClient } from 'mqtt';

import { env } from '../config/environment.js';
import { logger } from '../utils/logger.js';

interface CommandDocument {
  deviceId: string;
  organizationId: string;
  name: string;
  params?: Record<string, unknown>;
  status?: 'pending' | 'sent' | 'failed';
}

const getCommandTopic = (deviceId: string) =>
  env.MQTT_COMMAND_TOPIC.replace('{deviceId}', deviceId);

export const registerCommandWorker = (firestore: Firestore, client: MqttClient) => {
  const commandsCollection = firestore
    .collectionGroup('commands')
    .where('status', '==', 'pending');

  commandsCollection.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type !== 'added') {
        return;
      }

      const data = change.doc.data() as CommandDocument;
      const topic = getCommandTopic(data.deviceId);

      try {
        client.publish(topic, JSON.stringify({
          commandId: change.doc.id,
          name: data.name,
          params: data.params ?? {},
          organizationId: data.organizationId,
          deviceId: data.deviceId
        }));

        await change.doc.ref.update({ status: 'sent', sentAt: new Date().toISOString() });
        logger.info({ commandId: change.doc.id, topic }, 'Command dispatched via MQTT');
      } catch (error) {
        logger.error({ error, commandId: change.doc.id }, 'Failed to dispatch command');
        await change.doc.ref.update({ status: 'failed', error: (error as Error).message });
      }
    });
  },
  (error) => {
    logger.error({ error }, 'Command worker listener error');
  });
};
