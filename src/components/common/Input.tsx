/**
 * Reusable Input component with validation and error handling
 * Supports various input types and consistent styling
 */

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseInputClasses = 'block px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200';
  
  const stateClasses = error
    ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';
  
  const widthClass = fullWidth ? 'w-full' : '';
  const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';
  
  const inputClasses = `${baseInputClasses} ${stateClasses} ${widthClass} ${iconPadding} ${className}`.trim();

  return (
    <div className={`space-y-2 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;