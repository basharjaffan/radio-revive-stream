import { createHash } from 'crypto';
import * as os from 'os';
import admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';
import { logger } from '../logger.js';

const ORGANIZATION_ID = 'LdpwUPcwIFUZjIwYph8Z';

export function getDeviceId(): string {
  const networkInterfaces = os.networkInterfaces();
  const mac = (Object.values(networkInterfaces)
    .flat()
    .find(i => i && !i.internal && i.mac !== '00:00:00:00:00:00') as os.NetworkInterfaceInfo | undefined)?.mac || 'unknown';
  
  return createHash('sha256').update(mac).digest('hex').substring(0, 16);
}

function getLocalIP(): string {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'unknown';
}

export async function getGroupStreamUrl(firestore: Firestore, deviceId: string): Promise<string | null> {
  try {
    const deviceDoc = await firestore
      .collection('organizations')
      .doc(ORGANIZATION_ID)
      .collection('devices')
      .doc(deviceId)
      .get();
    
    if (!deviceDoc.exists) {
      logger.warn({ deviceId }, 'Device not found in Firebase');
      return null;
    }
    
    const deviceData = deviceDoc.data();
    const groupId = deviceData?.group;
    
    if (!groupId) {
      logger.warn({ deviceId }, 'Device is not assigned to any group');
      return null;
    }
    
    const groupDoc = await firestore
      .collection('organizations')
      .doc(ORGANIZATION_ID)
      .collection('groups')
      .doc(groupId)
      .get();
    
    if (!groupDoc.exists) {
      logger.warn({ groupId }, 'Group not found');
      return null;
    }
    
    const groupData = groupDoc.data();
    const streamUrl = groupData?.streamUrl;
    
    if (!streamUrl) {
      logger.warn({ groupId }, 'Group has no stream URL configured');
      return null;
    }
    
    logger.info({ groupId, streamUrl }, 'Got stream URL from group');
    return streamUrl;
  } catch (error) {
    logger.error({ error, deviceId }, 'Failed to get group stream URL');
    return null;
  }
}

export async function updateDeviceHeartbeat(firestore: Firestore, deviceId: string) {
  try {
    const deviceRef = firestore
      .collection('organizations')
      .doc(ORGANIZATION_ID)
      .collection('devices')
      .doc(deviceId);
    
    const ipAddress = getLocalIP();
    
    await deviceRef.set({
      lastSeen: admin.firestore.FieldValue.serverTimestamp(),
      ipAddress: ipAddress,
      status: 'online'
    }, { merge: true });
    
    logger.debug({ deviceId, ipAddress }, 'Heartbeat sent');
  } catch (error) {
    logger.error({ error: String(error), deviceId }, 'Failed to send heartbeat');
    throw error;
  }
}
