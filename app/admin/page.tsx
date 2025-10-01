'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from '@/components/Dashboard';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Dashboard initialTab="admin" />
    </ProtectedRoute>
  );
}