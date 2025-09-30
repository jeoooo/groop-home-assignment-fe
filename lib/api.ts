export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    SIGNIN: '/api/auth/signin',
    SIGNOUT: '/api/auth/signout',
    ME: '/api/auth/me',
    USERS: '/api/auth/users',
    UPDATE_ROLE: '/api/auth/users/role',
  },
} as const;