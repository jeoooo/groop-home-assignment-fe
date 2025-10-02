// Environment variable validation and types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface EmulatorConfig {
  authPort: number;
  firestorePort: number;
  storagePort: number;
}

/**
 * Validates and returns Firebase configuration from environment variables
 * Uses demo values for development if not properly configured
 */
export function getFirebaseConfig(): FirebaseConfig {
  // For development, use demo values if environment variables are missing or demo
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key';
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'groop-home-assignment.firebaseapp.com';
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'groop-home-assignment';
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'groop-home-assignment.appspot.com';
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789';
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'demo-app-id';

  // Only validate in production
  if (process.env.NODE_ENV === 'production') {
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => 
      !process.env[varName] || process.env[varName]?.startsWith('demo-')
    );
    
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables for production: ${missingVars.join(', ')}\n` +
        'Please check your .env.local file and ensure all Firebase configuration variables are set.'
      );
    }
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

/**
 * Returns emulator configuration for development
 */
export function getEmulatorConfig(): EmulatorConfig {
  return {
    authPort: parseInt(process.env.NEXT_PUBLIC_AUTH_EMULATOR_PORT || '9099'),
    firestorePort: parseInt(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || '8080'),
    storagePort: parseInt(process.env.NEXT_PUBLIC_STORAGE_EMULATOR_PORT || '9199'),
  };
}

/**
 * Check if we're running in development mode with emulators
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}