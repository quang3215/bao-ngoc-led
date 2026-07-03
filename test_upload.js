require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadString } = require('firebase/storage');
const fetch = require('node-fetch');
global.fetch = fetch; // Polyfill for firebase in Node.js if needed (firebase 9 uses fetch)

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testUpload() {
  try {
    const storageRef = ref(storage, 'test_upload.txt');
    console.log("Uploading...");
    await uploadString(storageRef, 'Hello world');
    console.log("Upload successful!");
  } catch (e) {
    console.error("Upload failed:", e);
  }
}
testUpload();
