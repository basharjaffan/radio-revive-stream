import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CommandParameters, Device, DeviceCommandName } from '@/types/device';

const DEVICES_COLLECTION = 'devices';
const ORGANIZATION_ID = 'LdpwUPcwIFUZjIwYph8Z';
const ORGANIZATIONS_COLLECTION = 'organizations';

export const deviceService = {
  // Get all devices
  getDevices: async (): Promise<Device[]> => {
    const devicesRef = collection(db, ORGANIZATIONS_COLLECTION, ORGANIZATION_ID, DEVICES_COLLECTION);
    const snapshot = await getDocs(devicesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastSeen: doc.data().lastSeen?.toDate?.() || new Date(),
    })) as Device[];
  },

  // Get device by ID
  getDevice: async (id: string): Promise<Device | null> => {
    const deviceRef = doc(db, ORGANIZATIONS_COLLECTION, ORGANIZATION_ID, DEVICES_COLLECTION, id);
    const snapshot = await getDoc(deviceRef);
    if (!snapshot.exists()) return null;
    return {
      id: snapshot.id,
      ...snapshot.data(),
      lastSeen: snapshot.data().lastSeen?.toDate?.() || new Date(),
    } as Device;
  },

  // Create device
  createDevice: async (device: Omit<Device, 'id'>): Promise<string> => {
    const devicesRef = collection(db, ORGANIZATIONS_COLLECTION, ORGANIZATION_ID, DEVICES_COLLECTION);
    const docRef = await addDoc(devicesRef, {
      ...device,
      lastSeen: Timestamp.fromDate(device.lastSeen),
    });
    return docRef.id;
  },

  // Update device
  updateDevice: async (id: string, data: Partial<Device>): Promise<void> => {
    const deviceRef = doc(db, ORGANIZATIONS_COLLECTION, ORGANIZATION_ID, DEVICES_COLLECTION, id);
    const updateData: Record<string, unknown> = { ...data };
    if (data.lastSeen) {
      updateData.lastSeen = Timestamp.fromDate(data.lastSeen);
    }
    await updateDoc(deviceRef, updateData);
  },

  // Delete device
  deleteDevice: async (id: string): Promise<void> => {
    const deviceRef = doc(db, ORGANIZATIONS_COLLECTION, ORGANIZATION_ID, DEVICES_COLLECTION, id);
    await deleteDoc(deviceRef);
  },

  // Subscribe to device changes
  subscribeToDevices: (callback: (devices: Device[]) => void) => {
    const devicesRef = collection(db, ORGANIZATIONS_COLLECTION, ORGANIZATION_ID, DEVICES_COLLECTION);
    return onSnapshot(devicesRef, (snapshot) => {
      const devices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastSeen: doc.data().lastSeen?.toDate?.() || new Date(),
      })) as Device[];
      callback(devices);
    });
  },

  // Send command to device
  sendCommand: async (
    deviceId: string,
    command: DeviceCommandName,
    params?: CommandParameters,
  ): Promise<void> => {
    const commandsRef = collection(db, ORGANIZATIONS_COLLECTION, ORGANIZATION_ID, 'commands');
    await addDoc(commandsRef, {
      deviceId,
      command,
      params: params || {},
      timestamp: Timestamp.now(),
      status: 'pending',
    });
  },
};
