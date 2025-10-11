import mqtt from 'mqtt';

import { env } from '../config/environment.js';
import { logger } from '../utils/logger.js';

export const createMqttClient = () => {
  const client = mqtt.connect(env.MQTT_URL, {
    username: env.MQTT_USERNAME || undefined,
    password: env.MQTT_PASSWORD || undefined,
    clientId: env.MQTT_CLIENT_ID,
    clean: true,
    reconnectPeriod: 5000
  });

  client.on('connect', () => {
    logger.info('Connected to MQTT broker');
  });

  client.on('reconnect', () => {
    logger.warn('Reconnecting to MQTT broker');
  });

  client.on('error', (error) => {
    logger.error({ error }, 'MQTT error');
  });

  client.on('offline', () => {
    logger.warn('MQTT client went offline');
  });

  return client;
};
