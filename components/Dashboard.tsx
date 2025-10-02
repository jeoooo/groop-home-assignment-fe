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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile-first Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <Container>
          <div className="py-4 space-y-4">
            {/* Top row: Welcome message and user info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-responsive-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  Dashboard
                </h1>
                <p className="text-responsive-sm text-gray-600 dark:text-gray-400 truncate">
                  Welcome back, {userProfile?.displayName || user?.email}
                </p>
              </div>
              
              {/* User badge and actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userProfile?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
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
            <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'posts' | 'profile' | 'admin')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
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
              className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm"
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
                  <h2 className="text-responsive-xl font-semibold text-gray-900 dark:text-gray-100">
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
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {user.displayName || 'No name'}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                  {user.email}
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Joined {user.createdAt.toLocaleDateString()}
                              </span>
                              {user.uid !== userProfile.uid ? (
                                <select
                                  value={user.role}
                                  onChange={(e) => handleRoleUpdate(user.uid, e.target.value as UserRole)}
                                  className="text-xs border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
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
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {user.displayName || 'No name'}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-gray-100">{user.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {user.createdAt.toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {user.uid !== userProfile.uid ? (
                                  <select
                                    value={user.role}
                                    onChange={(e) => handleRoleUpdate(user.uid, e.target.value as UserRole)}
                                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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