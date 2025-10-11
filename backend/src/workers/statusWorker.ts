import type { MqttClient } from 'mqtt';

import { env } from '../config/environment.js';
import { DeviceService } from '../services/deviceService.js';
import type { DeviceStatusPayload } from '../types/mqtt.js';
import { logger } from '../utils/logger.js';
import { topicMatches } from '../utils/topicMatcher.js';

const parsePayload = (payload: Buffer): DeviceStatusPayload | null => {
  try {
    const parsed = JSON.parse(payload.toString()) as DeviceStatusPayload;
    if (!parsed.deviceId || !parsed.organizationId || !parsed.reportedAt) {
      throw new Error('Missing required fields');
    }
    return parsed;
  } catch (error) {
    logger.error({ error }, 'Failed to parse device status payload');
    return null;
  }
};

export const registerStatusWorker = (client: MqttClient, deviceService: DeviceService) => {
  client.subscribe(env.MQTT_STATUS_TOPIC, (err) => {
    if (err) {
      logger.error({ err }, 'Failed to subscribe to status topic');
    } else {
      logger.info({ topic: env.MQTT_STATUS_TOPIC }, 'Subscribed to device status topic');
    }
  });

  client.on('message', async (topic, payload) => {
    if (!topicMatches(env.MQTT_STATUS_TOPIC, topic)) {
      return;
    }

    const parsed = parsePayload(payload);
    if (!parsed) {
      return;
    }

    await deviceService.updateStatus(parsed);
  });
};
