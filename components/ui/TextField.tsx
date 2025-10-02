'use client';

import React from 'react';
import { useTextField } from '@react-aria/textfield';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { AriaTextFieldProps } from '@react-types/textfield';

interface TextFieldProps extends AriaTextFieldProps {
  className?: string;
  inputClassName?: string;
  errorMessage?: string;
  helpText?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ 
    className = '', 
    inputClassName = '',
    errorMessage,
    helpText,
    ...props 
  }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { 
      labelProps, 
      inputProps, 
      descriptionProps, 
      errorMessageProps 
    } = useTextField(props, inputRef);
    const { focusProps, isFocusVisible } = useFocusRing();

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    const hasError = !!errorMessage;

    return (
      <div className={`space-y-1 ${className}`}>
        {props.label && (
          <label 
            {...labelProps}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {props.label}
            {props.isRequired && (
              <span className="text-red-500 ml-1" aria-label="required">*</span>
            )}
          </label>
        )}
        
        <div className="relative">
          <input
            {...mergeProps(inputProps, focusProps)}
            ref={inputRef}
            className={[
              'flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors',
              'placeholder:text-gray-500 dark:placeholder:text-gray-400',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'focus:outline-none',
              hasError 
                ? 'border-red-500 bg-red-50 dark:bg-red-950/20 dark:border-red-500' 
                : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
              !hasError && isFocusVisible && 'ring-2 ring-offset-2 ring-blue-500',
              hasError && isFocusVisible && 'ring-2 ring-offset-2 ring-red-500',
              'dark:text-gray-100',
              inputClassName
            ].filter(Boolean).join(' ')}
          />
        </div>

        {helpText && !hasError && (
          <p 
            {...descriptionProps}
            className="text-xs text-gray-600 dark:text-gray-400"
          >
            {helpText}
          </p>
        )}

        {hasError && (
          <p 
            {...errorMessageProps}
            className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
          >
            <svg 
              className="h-3 w-3 flex-shrink-0" 
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
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;