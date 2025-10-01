'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserProfile, UserRole, AuthState } from '@/types/auth';
import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/lib/api';

interface AuthResponse {
  user: UserProfile;
  token: string;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (uid: string, role: UserRole) => Promise<void>;
  updateProfile: (data: { displayName?: string; imageURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from backend
  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    try {
      const response = await apiClient.get<UserProfile>(API_ENDPOINTS.AUTH.ME);
      if (response.success && response.data) {
        return {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };



  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // First authenticate with Firebase to get ID token
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();

      // Send ID token to backend for session creation
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNIN, {
        idToken
      });

      if (response.success && response.data) {
        // Store the JWT token
        apiClient.setToken(response.data.token);
        
        // Set user profile with properly converted dates
        setUserProfile({
          ...response.data.user,
          createdAt: new Date(response.data.user.createdAt),
          updatedAt: new Date(response.data.user.updatedAt),
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, displayName: string, role?: UserRole) => {
    try {
      setError(null);
      setLoading(true);
      
      // Create user account with backend
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, {
        email,
        password,
        displayName,
        role
      });

      if (response.success && response.data) {
        // Store the JWT token
        apiClient.setToken(response.data.token);
        
        // Set user profile with properly converted dates
        setUserProfile({
          ...response.data.user,
          createdAt: new Date(response.data.user.createdAt),
          updatedAt: new Date(response.data.user.updatedAt),
        });

        // Also sign in to Firebase for client-side compatibility
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setError(null);
      
      // Sign out from backend
      await apiClient.post(API_ENDPOINTS.AUTH.SIGNOUT);
      
      // Clear token
      apiClient.setToken(null);
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      throw error;
    }
  };

  // Update user role (admin only)
  const updateUserRole = async (uid: string, role: UserRole) => {
    try {
      setError(null);
      if (userProfile?.role !== 'admin') {
        throw new Error('Only admins can update user roles');
      }
      
      await apiClient.put(API_ENDPOINTS.AUTH.UPDATE_ROLE, {
        uid,
        role
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (data: { displayName?: string; imageURL?: string }) => {
    try {
      setError(null);
      
      const response = await apiClient.put<UserProfile>(API_ENDPOINTS.AUTH.PROFILE, data);
      
      if (response.success && response.data) {
        const updatedProfile = {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        };
        setUserProfile(updatedProfile);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setUser(user);
      
      if (user) {
        // If we have a Firebase user but no backend session, try to fetch profile
        const profile = await fetchUserProfile();
        setUserProfile(profile);
      } else {
        // If no Firebase user, clear everything
        setUserProfile(null);
        apiClient.setToken(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateUserRole,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}