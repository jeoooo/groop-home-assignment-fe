'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              This page is only accessible by users with admin role.
            </p>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Admin Features
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>View and manage all users</li>
                <li>Update user roles</li>
                <li>Access system analytics</li>
                <li>Manage application settings</li>
                <li>Monitor user activity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}