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
import { User } from '@/types/user';

const USERS_COLLECTION = 'users';

export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      lastLogin: doc.data().lastLogin?.toDate?.() || new Date(),
    })) as User[];
  },

  // Get user by ID
  getUser: async (id: string): Promise<User | null> => {
    const userRef = doc(db, USERS_COLLECTION, id);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) return null;
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate?.() || new Date(),
      lastLogin: snapshot.data().lastLogin?.toDate?.() || new Date(),
    } as User;
  },

  // Create user
  createUser: async (user: Omit<User, 'id'>): Promise<string> => {
    const usersRef = collection(db, USERS_COLLECTION);
    const docRef = await addDoc(usersRef, {
      ...user,
      createdAt: Timestamp.fromDate(user.createdAt),
      lastLogin: Timestamp.fromDate(user.lastLogin),
    });
    return docRef.id;
  },

  // Update user
  updateUser: async (id: string, data: Partial<User>): Promise<void> => {
    const userRef = doc(db, USERS_COLLECTION, id);
    const updateData: any = { ...data };
    if (data.createdAt) {
      updateData.createdAt = Timestamp.fromDate(data.createdAt);
    }
    if (data.lastLogin) {
      updateData.lastLogin = Timestamp.fromDate(data.lastLogin);
    }
    await updateDoc(userRef, updateData);
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    const userRef = doc(db, USERS_COLLECTION, id);
    await deleteDoc(userRef);
  },
};
