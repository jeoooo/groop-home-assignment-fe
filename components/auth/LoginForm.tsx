'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, TextField, Card, Container } from '@/components/ui';

interface LoginFormProps {
  onToggleMode: () => void;
}

export default function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
    } catch {
      // Error is handled by the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container centerContent size="sm" className="py-8">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-responsive-3xl font-bold text-gray-900 dark:text-gray-100">
            Groop
          </h1>
          <p className="text-responsive-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Card */}
        <Card shadow="lg" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div 
                className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm"
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
            
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(value) => setEmail(value)}
              placeholder="Enter your email"
              isRequired
              autoComplete="email"
              isDisabled={isLoading}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(value) => setPassword(value)}
              placeholder="Enter your password"
              isRequired
              autoComplete="current-password"
              isDisabled={isLoading}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isDisabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-2 h-4 w-4" 
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
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-responsive-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Button
              variant="ghost"
              size="sm"
              onPress={onToggleMode}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium p-0 h-auto min-h-0 min-w-0"
            >
              Sign up
            </Button>
          </p>
        </div>
      </div>
    </Container>
  );
}