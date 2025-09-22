// Firebase configuration - based on Firebase integration blueprint
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Validate required environment variables
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => `VITE_FIREBASE_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  console.warn(`Firebase: Missing required environment variables: ${missingVars.join(', ')}`);
  console.warn('Firebase authentication will not work until these are configured.');
}

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey,
  authDomain: `${requiredEnvVars.projectId}.firebaseapp.com`,
  projectId: requiredEnvVars.projectId,
  storageBucket: `${requiredEnvVars.projectId}.appspot.com`,
  appId: requiredEnvVars.appId,
};

// Only initialize Firebase if we have the required configuration
let app: any = null;
let auth: any = null;
let db: any = null;

if (missingVars.length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Connect to emulators in development if explicitly enabled
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
    try {
      if (!auth.emulatorConfig) {
        connectAuthEmulator(auth, "http://localhost:9099");
      }
      if (!db._delegate._emulator) {
        connectFirestoreEmulator(db, "localhost", 8080);
      }
    } catch (error) {
      console.warn('Firebase emulators not available:', error);
    }
  }
}

export { auth, db };
export default app;

// Export a flag to check if Firebase is properly configured
export const isFirebaseConfigured = missingVars.length === 0;