export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/v1/auth/signup',
    SIGNIN: '/api/v1/auth/signin',
    SIGNOUT: '/api/v1/auth/signout',
    ME: '/api/v1/auth/me',
    PROFILE: '/api/v1/auth/profile',
    USERS: '/api/v1/auth/users',
    UPDATE_ROLE: '/api/v1/auth/users/role',
  },
  POSTS: {
    LIST: '/api/v1/posts',
    CREATE: '/api/v1/posts',
    GET: (id: string) => `/api/v1/posts/${id}`,
    UPDATE: (id: string) => `/api/v1/posts/${id}`,
    DELETE: (id: string) => `/api/v1/posts/${id}`,
    PIN: (id: string) => `/api/v1/posts/${id}/pin`,
    MY_POSTS: '/api/v1/posts/my-posts',
    UPLOAD: '/api/v1/posts/upload',
  },
} as const;