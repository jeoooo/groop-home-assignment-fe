'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthForms from '@/components/auth/AuthForms';
import Dashboard from '@/components/Dashboard';
import { Container } from '@/components/ui';

export default function Home() {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <Container centerContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-responsive-sm text-gray-600 dark:text-gray-400">
            Loading...
          </p>
        </div>
      </Container>
    );
  }

  if (!userProfile) {
    return <AuthForms />;
  }

  return <Dashboard />;
}
