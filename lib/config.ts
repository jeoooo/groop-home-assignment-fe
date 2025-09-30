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
}

/**
 * Validates and returns Firebase configuration from environment variables
 * Throws an error if required variables are missing
 */
export function getFirebaseConfig(): FirebaseConfig {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all Firebase configuration variables are set.'
    );
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  };
}

/**
 * Returns emulator configuration for development
 */
export function getEmulatorConfig(): EmulatorConfig {
  return {
    authPort: parseInt(process.env.NEXT_PUBLIC_AUTH_EMULATOR_PORT || '9099'),
    firestorePort: parseInt(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || '8080'),
  };
}

/**
 * Check if we're running in development mode with emulators
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}