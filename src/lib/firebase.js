import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // To test locally, create a .env.local file in the root of the React project and populate these values.
  // For Vercel deployment, add these environment variables in the Vercel dashboard.
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "demo",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "demo",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
