import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MQTT_URL: z.string().url(),
  MQTT_USERNAME: z.string().optional().or(z.literal('')),
  MQTT_PASSWORD: z.string().optional().or(z.literal('')),
  MQTT_CLIENT_ID: z.string().min(1).default('radio-revive-backend'),
  MQTT_STATUS_TOPIC: z.string().min(1).default('devices/+/status'),
  MQTT_COMMAND_TOPIC: z.string().min(1).default('devices/{deviceId}/commands'),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  FIRESTORE_DEVICE_COLLECTION: z.string().min(1).default('devices'),
  FIRESTORE_ORGANIZATION_COLLECTION: z.string().min(1).default('organizations')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
