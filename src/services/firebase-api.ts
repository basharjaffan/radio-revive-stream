import { 
  collection, 
  doc, 
  getDoc, 
  addDoc,
  onSnapshot,
  Timestamp,
  query,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Device } from '@/types';

export const devicesApi = {
  // Hämta enhet för användare
  getDevice: async (deviceId: string): Promise<Device | null> => {
    try {
      const deviceRef = doc(db, 'devices', deviceId);
      const snapshot = await getDoc(deviceRef);
      
      if (!snapshot.exists()) return null;
      
      return {
        id: snapshot.id,
        ...snapshot.data(),
        lastSeen: snapshot.data().lastSeen?.toDate?.() || new Date(),
      } as Device;
    } catch (error) {
      console.error('Error fetching device:', error);
      return null;
    }
  },

  // Lyssna på enhetens status i realtid
  subscribeToDevice: (deviceId: string, callback: (device: Device | null) => void) => {
    const deviceRef = doc(db, 'devices', deviceId);
    
    return onSnapshot(deviceRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      
      const device: Device = {
        id: snapshot.id,
        ...snapshot.data(),
        lastSeen: snapshot.data().lastSeen?.toDate?.() || new Date(),
      } as Device;
      
      callback(device);
    });
  },
};

export const commandsApi = {
  // Skicka kommando till enhet
  send: async (
    deviceId: string, 
    command: 'play' | 'pause' | 'stop' | 'restart' | 'volume',
    streamUrl?: string,
    volume?: number
  ): Promise<void> => {
    try {
      const commandsRef = collection(db, 'commands');
      
      await addDoc(commandsRef, {
        deviceId,
        command,
        params: {
          url: streamUrl || null,
          volume: volume || null,
        },
        timestamp: Timestamp.now(),
        status: 'pending',
      });
      
      console.log(`✅ Command sent: ${command} to device ${deviceId}`);
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  },
};
