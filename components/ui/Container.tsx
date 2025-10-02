'use client';

import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centerContent?: boolean;
  withPadding?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    children, 
    className = '', 
    size = 'lg', 
    centerContent = false,
    withPadding = true 
  }, ref) => {
    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'max-w-full'
    };

    return (
      <div
        ref={ref}
        className={[
          'mx-auto w-full safe-area-inset',
          sizeClasses[size],
          withPadding && 'px-4 sm:px-6 lg:px-8',
          centerContent && 'flex flex-col items-center justify-center min-h-screen',
          className
        ].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export default Container;