import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFirebaseConfig, getEmulatorConfig, isDevelopment } from './config';

// Get Firebase configuration from environment variables
const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Connect to emulators in development
if (isDevelopment()) {
  try {
    const { authPort, firestorePort } = getEmulatorConfig();
    
    connectAuthEmulator(auth, `http://localhost:${authPort}`);
    connectFirestoreEmulator(db, 'localhost', firestorePort);
  } catch {
    // Emulators already connected
    console.log('Emulators already connected');
  }
}

export default app;