'use client';

import React from 'react';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { AriaButtonProps } from '@react-types/button';

interface ButtonProps extends AriaButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false, 
    className = '', 
    children, 
    ...props 
  }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const { buttonProps } = useButton(props, buttonRef);
    const { focusProps, isFocusVisible } = useFocusRing();

    // Merge refs
    React.useImperativeHandle(ref, () => buttonRef.current!);

    const baseClasses = [
      'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200',
      'focus:outline-none disabled:pointer-events-none disabled:opacity-50',
      'min-h-[44px] min-w-[44px] active:scale-[0.98]', // Touch-friendly size with subtle press animation
      isFocusVisible && 'ring-2 ring-offset-2 ring-blue-500'
    ].filter(Boolean).join(' ');

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800',
      ghost: 'hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700',
      destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md'
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-xs min-w-[2rem]',
      md: 'h-10 px-4 text-sm min-w-[2.5rem]',
      lg: 'h-12 px-6 text-base min-w-[3rem]'
    };

    const finalClassName = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        {...mergeProps(buttonProps, focusProps)}
        ref={buttonRef}
        className={finalClassName}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;