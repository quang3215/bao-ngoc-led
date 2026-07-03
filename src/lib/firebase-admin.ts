import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // In a real app, you'd load service account details from an env variable.
    // For now, since this is a storefront demo, we'll initialize it using default credentials 
    // or a specific service account if provided later.
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
