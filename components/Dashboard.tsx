'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/lib/api';
import { UserProfile as UserProfileType, UserRole } from '@/types/auth';
import PostsDashboard from './PostsDashboard';
import UserProfile from './UserProfile';
import { Button, Card, Container } from '@/components/ui';

interface DashboardProps {
  initialTab?: 'posts' | 'profile' | 'admin';
}

export default function Dashboard({ initialTab = 'posts' }: DashboardProps) {
  const { user, userProfile, signOut, updateUserRole } = useAuth();
  const [users, setUsers] = useState<UserProfileType[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'profile' | 'admin'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users (admin only)
  const fetchUsers = async () => {
    if (userProfile?.role !== 'admin') return;
    
    setLoading(true);
    try {
      setError(null);
      const response = await apiClient.get<UserProfileType[]>(API_ENDPOINTS.AUTH.USERS);
      if (response.success && response.data) {
        // Convert date strings to Date objects
        const usersWithDates = response.data.map(user => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        }));
        setUsers(usersWithDates);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const handleRoleUpdate = async (uid: string, newRole: UserRole) => {
    try {
      setError(null);
      await updateUserRole(uid, newRole);
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update role');
      console.error('Error updating user role:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign out');
    }
  };

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      fetchUsers();
    }
  }, [userProfile?.role]); // eslint-disable-line react-hooks/exhaustive-deps

  const tabs = [
    { id: 'posts', label: 'Posts', icon: '📝' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    ...(userProfile?.role === 'admin' ? [{ id: 'admin', label: 'Admin', icon: '⚙️' }] : []),
  ] as const;

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-first Header */}
      <header className="bg-black shadow-sm border-b border-gray-300">
        <Container>
          <div className="py-4 space-y-4">
            {/* Top row: Welcome message and user info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-responsive-2xl font-bold text-white font-primary truncate">
                  Dashboard
                </h1>
                <p className="text-responsive-sm text-gray-300 truncate">
                  Welcome back, {userProfile?.displayName || user?.email}
                </p>
              </div>
              
              {/* User badge and actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userProfile?.role === 'admin' 
                    ? 'bg-white text-black border border-gray-300' 
                    : 'bg-gray-800 text-white border border-gray-600'
                }`}>
                  {userProfile?.role}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onPress={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Mobile-optimized Navigation Tabs */}
            <nav className="flex space-x-1 bg-gray-200 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'posts' | 'profile' | 'admin')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-700 hover:text-black'
                  }`}
                >
                  <span className="text-sm sm:hidden">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <Container>
          {/* Error Display */}
          {error && (
            <div 
              className="mb-6 p-4 bg-gray-100 border border-gray-400 text-black rounded-lg text-sm"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start gap-2">
                <svg 
                  className="h-4 w-4 flex-shrink-0 mt-0.5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* Tab Content */}
          {activeTab === 'posts' && <PostsDashboard />}
          
          {activeTab === 'profile' && <UserProfile />}
          
          {activeTab === 'admin' && userProfile?.role === 'admin' && (
            <Card padding="lg">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-responsive-xl font-semibold text-white font-primary">
                    User Management
                  </h2>
                  <Button
                    variant="primary"
                    size="sm"
                    onPress={fetchUsers}
                    isDisabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg 
                          className="animate-spin -ml-1 mr-1 h-3 w-3" 
                          fill="none" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Loading...
                      </>
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                </div>
                
                {loading && !users.length ? (
                  <div className="text-center py-8 text-gray-600">
                    Loading users...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Mobile-first user cards */}
                    <div className="sm:hidden space-y-3">
                      {users.map((user) => (
                        <Card key={user.uid} padding="sm" shadow="sm">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              {user.imageURL && (
                                <img
                                  src={user.imageURL}
                                  alt="Profile"
                                  className="w-8 h-8 rounded-full flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-black truncate">
                                  {user.displayName || 'No name'}
                                </p>
                                <p className="text-xs text-gray-600 truncate">
                                  {user.email}
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                                user.role === 'admin' 
                                  ? 'bg-black text-white' 
                                  : 'bg-gray-200 text-black border border-gray-400'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                              <span className="text-xs text-gray-500">
                                Joined {user.createdAt.toLocaleDateString()}
                              </span>
                              {user.uid !== userProfile.uid ? (
                                <select
                                  value={user.role}
                                  onChange={(e) => handleRoleUpdate(user.uid, e.target.value as UserRole)}
                                  className="text-xs border border-gray-400 rounded-md px-2 py-1 bg-white text-black"
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                              ) : (
                                <span className="text-xs text-gray-400">You</span>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                              Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                          {users.map((user) => (
                            <tr key={user.uid}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {user.imageURL && (
                                    <img
                                      src={user.imageURL}
                                      alt="Profile"
                                      className="w-8 h-8 rounded-full mr-3"
                                    />
                                  )}
                                  <div className="text-sm font-medium text-black">
                                    {user.displayName || 'No name'}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-black">{user.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.role === 'admin' 
                                    ? 'bg-black text-white' 
                                    : 'bg-gray-200 text-black border border-gray-400'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {user.createdAt.toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {user.uid !== userProfile.uid ? (
                                  <select
                                    value={user.role}
                                    onChange={(e) => handleRoleUpdate(user.uid, e.target.value as UserRole)}
                                    className="text-sm border border-gray-400 rounded-md px-2 py-1 bg-white text-black"
                                  >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                ) : (
                                  <span className="text-gray-400">You</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </Container>
      </main>
    </div>
  );
}