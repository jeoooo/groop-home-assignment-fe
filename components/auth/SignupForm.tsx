'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { Button, TextField, Card, Container } from '@/components/ui';

interface SignupFormProps {
  onToggleMode: () => void;
}

export default function SignupForm({ onToggleMode }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, error } = useAuth();

  const passwordMismatch = password !== confirmPassword && confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password, displayName, role);
    } catch {
      // Error is handled by the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email && password && confirmPassword && displayName && !passwordMismatch;

  return (
    <Container centerContent size="sm" className="py-8">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-responsive-3xl font-bold text-gray-900 dark:text-gray-100">
            Create account
          </h1>
          <p className="text-responsive-sm text-gray-600 dark:text-gray-400">
            Join us to get started with your journey
          </p>
        </div>

        {/* Form Card */}
        <Card shadow="lg" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Messages */}
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
              label="Full Name"
              type="text"
              value={displayName}
              onChange={(value) => setDisplayName(value)}
              placeholder="Enter your full name"
              isRequired
              autoComplete="name"
              isDisabled={isLoading}
            />

            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(value) => setEmail(value)}
              placeholder="Enter your email"
              isRequired
              autoComplete="email"
              isDisabled={isLoading}
            />

            {/* Role Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Account Type
                <span className="text-red-500 ml-1" aria-label="required">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Note: The first user will automatically become an admin regardless of selection
              </p>
            </div>

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(value) => setPassword(value)}
              placeholder="Enter your password"
              isRequired
              autoComplete="new-password"
              isDisabled={isLoading}
              helpText="Choose a strong password with at least 6 characters"
            />

            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(value) => setConfirmPassword(value)}
              placeholder="Confirm your password"
              isRequired
              autoComplete="new-password"
              isDisabled={isLoading}
              errorMessage={passwordMismatch ? "Passwords do not match" : undefined}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isDisabled={isLoading || !isFormValid}
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
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-responsive-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Button
              variant="ghost"
              size="sm"
              onPress={onToggleMode}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium p-0 h-auto min-h-0 min-w-0"
            >
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </Container>
  );
}