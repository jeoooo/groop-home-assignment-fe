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
  // For development with emulator, use minimal config to avoid exposing demo keys in URLs
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // For emulator, use minimal config that doesn't expose demo keys in requests
    return {
      apiKey: 'demo-api-key', // This will be used internally, not in URL requests
      authDomain: 'localhost',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'groop-home-assignment',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'groop-home-assignment.appspot.com',
      messagingSenderId: '123456789',
      appId: 'demo-app-id'
    };
  }

  // For production, use actual environment variables
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

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
      `Missing required environment variables for production: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all Firebase configuration variables are set.'
    );
  }

  return {
    apiKey: apiKey!,
    authDomain: authDomain!,
    projectId: projectId!,
    storageBucket: storageBucket!,
    messagingSenderId: messagingSenderId!,
    appId: appId!
  };
}

/**
 * Returns emulator configuration for development
 */
export function getEmulatorConfig(): EmulatorConfig {
  return {
    authPort: parseInt(process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT || '9099', 10),
    firestorePort: parseInt(process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT || '8080', 10),
    storagePort: parseInt(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_PORT || '9199', 10),
  };
}

/**
 * Checks if the app is running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Checks if the app is running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}