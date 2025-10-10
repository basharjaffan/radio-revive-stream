import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DeviceGroup } from '@/types/group';

const GROUPS_COLLECTION = 'groups';

export const groupService = {
  // Get all groups
  getGroups: async (): Promise<DeviceGroup[]> => {
    const groupsRef = collection(db, GROUPS_COLLECTION);
    const snapshot = await getDocs(groupsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    })) as DeviceGroup[];
  },

  // Get group by ID
  getGroup: async (id: string): Promise<DeviceGroup | null> => {
    const groupRef = doc(db, GROUPS_COLLECTION, id);
    const snapshot = await getDoc(groupRef);
    if (!snapshot.exists()) return null;
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate?.() || new Date(),
    } as DeviceGroup;
  },

  // Create group
  createGroup: async (group: Omit<DeviceGroup, 'id'>): Promise<string> => {
    const groupsRef = collection(db, GROUPS_COLLECTION);
    const payload: any = {
      name: group.name,
      deviceIds: group.deviceIds || [],
      createdAt: Timestamp.fromDate(group.createdAt),
    };
    if (group.streamUrl && group.streamUrl.trim() !== '') {
      payload.streamUrl = group.streamUrl;
    }
    const docRef = await addDoc(groupsRef, payload);
    return docRef.id;
  },

  // Update group
  updateGroup: async (id: string, data: Partial<DeviceGroup>): Promise<void> => {
    const groupRef = doc(db, GROUPS_COLLECTION, id);
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.deviceIds !== undefined) updateData.deviceIds = data.deviceIds;
    if (data.streamUrl !== undefined) updateData.streamUrl = data.streamUrl;
    if (data.createdAt) {
      updateData.createdAt = Timestamp.fromDate(data.createdAt);
    }
    await updateDoc(groupRef, updateData);
  },

  // Delete group
  deleteGroup: async (id: string): Promise<void> => {
    const groupRef = doc(db, GROUPS_COLLECTION, id);
    await deleteDoc(groupRef);
  },

  // Send command to group
  sendGroupCommand: async (groupId: string, command: string, params?: any): Promise<void> => {
    const commandsRef = collection(db, 'commands');
    await addDoc(commandsRef, {
      groupId,
      command,
      params: params || {},
      timestamp: Timestamp.now(),
      status: 'pending',
    });
  },
};
