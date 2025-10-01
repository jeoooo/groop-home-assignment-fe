export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    SIGNIN: '/api/auth/signin',
    SIGNOUT: '/api/auth/signout',
    ME: '/api/auth/me',
    PROFILE: '/api/auth/profile',
    USERS: '/api/auth/users',
    UPDATE_ROLE: '/api/auth/users/role',
  },
  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts',
    GET: (id: string) => `/api/posts/${id}`,
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
    PIN: (id: string) => `/api/posts/${id}/pin`,
    MY_POSTS: '/api/posts/my-posts',
    UPLOAD: '/api/posts/upload',
  },
} as const;