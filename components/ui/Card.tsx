'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', padding = 'md', shadow = 'md' }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8'
    };

    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    };

    return (
      <div
        ref={ref}
        className={[
          'rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700',
          paddingClasses[padding],
          shadowClasses[shadow],
          className
        ].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;