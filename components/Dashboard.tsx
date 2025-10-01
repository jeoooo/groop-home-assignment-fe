'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/lib/api';
import { UserProfile as UserProfileType, UserRole } from '@/types/auth';
import PostsDashboard from './PostsDashboard';
import UserProfile from './UserProfile';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {userProfile?.displayName || user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                userProfile?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {userProfile?.role}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
            {userProfile?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'admin'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Admin Panel
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Error Display */}
        {error && (
          <div className="mx-4 mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="px-4 py-6 sm:px-0">
          {/* Tab Content */}
          {activeTab === 'posts' && <PostsDashboard />}
          
          {activeTab === 'profile' && <UserProfile />}
          
          {activeTab === 'admin' && userProfile?.role === 'admin' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    User Management
                  </h3>
                  <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded text-sm"
                  >
                    {loading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
                
                {loading ? (
                  <div className="text-center py-4">Loading users...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
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
                                <div className="text-sm font-medium text-gray-900">
                                  {user.displayName || 'No name'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.createdAt.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {user.uid !== userProfile.uid && (
                                <select
                                  value={user.role}
                                  onChange={(e) => handleRoleUpdate(user.uid, e.target.value as UserRole)}
                                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                              )}
                              {user.uid === userProfile.uid && (
                                <span className="text-gray-400">You</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}