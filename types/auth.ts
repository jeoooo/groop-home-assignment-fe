import { User } from 'firebase/auth';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  imageURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}