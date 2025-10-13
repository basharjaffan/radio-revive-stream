import { config } from 'dotenv';
import admin from 'firebase-admin';

config();

let app: admin.app.App | undefined;
let db: admin.firestore.Firestore | undefined;

export async function initializeFirebase() {
  if (!app) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      throw new Error('Missing Firebase credentials in .env file');
    }
    
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey
      })
    });
    
    db = admin.firestore();
  }
  
  return app;
}

export function getFirestore(): admin.firestore.Firestore {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeFirebase() first.');
  }
  return db;
}
