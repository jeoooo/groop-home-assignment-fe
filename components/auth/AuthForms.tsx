'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthForms() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  if (isLoginMode) {
    return <LoginForm onToggleMode={toggleMode} />;
  }

  return <SignupForm onToggleMode={toggleMode} />;
}