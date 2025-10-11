import { env } from './config/environment.js';
import { firestore } from './config/firebase.js';
import { buildServer } from './http/server.js';
import { createMqttClient } from './mqtt/mqttClient.js';
import { DeviceService } from './services/deviceService.js';
import { logger } from './utils/logger.js';
import { registerCommandWorker } from './workers/commandWorker.js';
import { registerStatusWorker } from './workers/statusWorker.js';

const bootstrap = async () => {
  const mqttClient = createMqttClient();
  const deviceService = new DeviceService(firestore);

  registerStatusWorker(mqttClient, deviceService);
  registerCommandWorker(firestore, mqttClient);

  const server = buildServer();
  await server.listen({ host: '0.0.0.0', port: env.PORT });

  logger.info({ port: env.PORT }, 'Backend server started');
};

bootstrap().catch((error) => {
  logger.error({ error }, 'Failed to bootstrap backend');
  process.exit(1);
});
