import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    // In a real app, you'd load service account details from an env variable.
    // For now, since this is a storefront demo, we'll initialize it using default credentials 
    // or a specific service account if provided later.
    initializeApp();
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
