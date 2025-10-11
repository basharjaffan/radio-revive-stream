import { config } from 'dotenv';
import mqtt from 'mqtt';

import { logger } from './logger.js';

config();

const DEVICE_ID = process.env.DEVICE_ID ?? 'unknown-device';
const ORGANIZATION_ID = process.env.ORGANIZATION_ID ?? 'unknown-org';
const MQTT_URL = process.env.MQTT_URL ?? 'mqtt://localhost:1883';
const STATUS_TOPIC = (process.env.STATUS_TOPIC ?? `devices/${DEVICE_ID}/status`).replace(
  '${DEVICE_ID}',
  DEVICE_ID
);
const COMMAND_TOPIC = (process.env.COMMAND_TOPIC ?? `devices/${DEVICE_ID}/commands`).replace(
  '${DEVICE_ID}',
  DEVICE_ID
);
const HEARTBEAT_INTERVAL = Number(process.env.HEARTBEAT_INTERVAL ?? 15000);
const UPDATE_CHECK_URL = process.env.UPDATE_CHECK_URL;

const client = mqtt.connect(MQTT_URL, {
  username: process.env.MQTT_USERNAME || undefined,
  password: process.env.MQTT_PASSWORD || undefined,
  clientId: `${DEVICE_ID}-agent`,
  reconnectPeriod: 5000
});

client.on('connect', () => {
  logger.info({ MQTT_URL }, 'Connected to MQTT broker');
  client.subscribe(COMMAND_TOPIC, (err) => {
    if (err) {
      logger.error({ err }, 'Failed to subscribe to command topic');
    } else {
      logger.info({ COMMAND_TOPIC }, 'Listening for commands');
    }
  });
});

client.on('message', async (_topic, payload) => {
  try {
    const command = JSON.parse(payload.toString()) as {
      commandId: string;
      name: string;
      params?: Record<string, unknown>;
    };
    logger.info({ command }, 'Received command');
    // TODO: integrate with device specific handlers
  } catch (error) {
    logger.error({ error }, 'Failed to handle command payload');
  }
});

const publishHeartbeat = () => {
  const statusPayload = {
    deviceId: DEVICE_ID,
    organizationId: ORGANIZATION_ID,
    online: true,
    firmwareVersion: '1.0.0',
    reportedAt: new Date().toISOString()
  };

  client.publish(STATUS_TOPIC, JSON.stringify(statusPayload));
  logger.debug({ statusPayload }, 'Sent heartbeat');
};

setInterval(publishHeartbeat, HEARTBEAT_INTERVAL);

if (UPDATE_CHECK_URL) {
  const checkForUpdates = async () => {
    try {
      const res = await fetch(UPDATE_CHECK_URL);
      if (!res.ok) {
        throw new Error(`Update check failed with status ${res.status}`);
      }
      const release = await res.json();
      logger.debug({ release }, 'Fetched update metadata');
      // TODO: download and apply update
    } catch (error) {
      logger.error({ error }, 'Update check failed');
    }
  };

  setInterval(checkForUpdates, 60_000);
  void checkForUpdates();
}
