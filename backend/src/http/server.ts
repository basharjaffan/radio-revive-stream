import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

import { env } from '../config/environment.js';
import { logger } from '../utils/logger.js';

export const buildServer = () => {
  const server = Fastify({ logger });

  server.register(helmet);
  server.register(cors, { origin: true, credentials: true });
  server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  server.get('/health', async () => ({ status: 'ok' }));

  server.get('/config/mqtt', async () => ({
    url: env.MQTT_URL,
    statusTopic: env.MQTT_STATUS_TOPIC,
    commandTopicPattern: env.MQTT_COMMAND_TOPIC
  }));

  return server;
};
