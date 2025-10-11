import type { Firestore } from 'firebase-admin/firestore';

import type { DeviceCommandPayload, DeviceStatusPayload } from '../types/mqtt.js';

import { env } from '../config/environment.js';
import { logger } from '../utils/logger.js';

export class DeviceService {
  constructor(private readonly firestore: Firestore) {}

  async updateStatus(payload: DeviceStatusPayload) {
    const deviceDoc = this.firestore
      .collection(env.FIRESTORE_ORGANIZATION_COLLECTION)
      .doc(payload.organizationId)
      .collection(env.FIRESTORE_DEVICE_COLLECTION)
      .doc(payload.deviceId);

    await deviceDoc.set(
      {
        status: {
          online: payload.online,
          battery: payload.battery ?? null,
          firmwareVersion: payload.firmwareVersion ?? null,
          reportedAt: payload.reportedAt,
          metadata: payload.metadata ?? {}
        },
        updatedAt: payload.reportedAt
      },
      { merge: true }
    );

    logger.info({ deviceId: payload.deviceId }, 'Device status updated');
  }

  async enqueueCommand(payload: DeviceCommandPayload) {
    const commandDoc = this.firestore
      .collection(env.FIRESTORE_ORGANIZATION_COLLECTION)
      .doc(payload.organizationId)
      .collection('commands')
      .doc(payload.commandId);

    await commandDoc.set(payload, { merge: true });
    logger.info({ commandId: payload.commandId }, 'Command persisted');
  }
}
