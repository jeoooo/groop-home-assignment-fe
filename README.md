# Groop Home Assignment - Authentication System

A complete authentication system built with Next.js, Firebase Auth, and Firestore, featuring admin and user roles.

## Features

- ✅ Firebase Authentication with email/password
- ✅ Role-based access control (Admin & User)
- ✅ Firestore database for user profiles
- ✅ Firebase emulators for local development
- ✅ Protected routes based on authentication and roles
- ✅ Admin dashboard for user management
- ✅ User dashboard with account information
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript support

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)

### 1. Environment Setup

First, copy the environment example file and configure your Firebase settings:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase project configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Emulator Ports (for development)
NEXT_PUBLIC_AUTH_EMULATOR_PORT=9099
NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT=8080

# Environment
NODE_ENV=development
```

For development with emulators, you can use demo values as shown in `.env.local`.

### 2. Setup Firebase Emulators

```bash
cd ../groop-home-assignment-be
firebase login
firebase emulators:start
```

This will start:
- Firebase Auth Emulator on port 9099
- Firestore Emulator on port 8080
- Firebase UI on port 4000

### 3. Setup Frontend

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## User Types

### Admin User
- Can view and manage all users
- Can update user roles
- Can access admin-only pages
- Has full dashboard functionality
- **First registered user automatically becomes admin**

### Regular User
- Can view their own profile
- Can access user dashboard
- Cannot manage other users
- Cannot access admin-only features

## Usage

1. Start the Firebase emulators in the backend directory
2. Start the Next.js development server
3. Navigate to `http://localhost:3000`
4. Sign up for a new account (first user becomes admin)
5. Explore the dashboard and user management features

## Test Admin Features

Once logged in as admin, you can:
- View all users in the system
- Change user roles
- Access the admin-only page at `/admin`
- Manage user accounts

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```
