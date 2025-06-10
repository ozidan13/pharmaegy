'use client';

import React from 'react';
import Link from 'next/link';

// Input Field Component
interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  position?: 'single' | 'top' | 'middle' | 'bottom';
  accentColor?: 'blue' | 'purple' | 'teal';
}

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
  position = 'single',
  accentColor = 'blue'
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'rounded-t-2xl rounded-b-none border-b-0';
      case 'middle':
        return 'rounded-none border-b-0';
      case 'bottom':
        return 'rounded-b-2xl rounded-t-none';
      default:
        return 'rounded-2xl';
    }
  };

  const getAccentClasses = () => {
    switch (accentColor) {
      case 'purple':
        return 'focus:ring-purple-500/50';
      case 'teal':
        return 'focus:ring-teal-500/50';
      default:
        return 'focus:ring-blue-500/50';
    }
  };

  const getLabelGradientClasses = () => {
    switch (accentColor) {
      case 'purple':
        return 'from-purple-600 to-indigo-600 peer-focus:from-purple-600 peer-focus:to-indigo-600';
      case 'teal':
        return 'from-teal-600 to-cyan-600 peer-focus:from-teal-600 peer-focus:to-cyan-600';
      default:
        return 'from-blue-600 to-purple-600 peer-focus:from-blue-600 peer-focus:to-purple-600';
    }
  };

  return (
    <div className="relative group">
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        className={`peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 shadow-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 placeholder-transparent ${getPositionClasses()} ${getAccentClasses()}`}
        placeholder={placeholder}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 -top-2.5 bg-gradient-to-r bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:bg-clip-text peer-focus:text-transparent ${getLabelGradientClasses()}`}
      >
        {label}
      </label>
    </div>
  );
};

// Error Message Component
interface AuthErrorProps {
  message: string;
}

export const AuthError: React.FC<AuthErrorProps> = ({ message }) => {
  return (
    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-700 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

// Submit Button Component
interface AuthButtonProps {
  isLoading: boolean;
  loadingText: string;
  buttonText: string;
  accentColor?: 'blue' | 'purple' | 'green';
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  isLoading,
  loadingText,
  buttonText,
  accentColor = 'blue'
}) => {
  const getButtonColors = () => {
    switch (accentColor) {
      case 'purple':
        return 'from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 focus:ring-purple-500';
      case 'green':
        return 'from-green-600 via-blue-600 to-green-700 hover:from-green-700 hover:via-blue-700 hover:to-green-800 focus:ring-green-500';
      default:
        return 'from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:ring-blue-500';
    }
  };

  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r ${getButtonColors()} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {isLoading ? loadingText : buttonText}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getButtonColors()} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
    </button>
  );
};

// Link Component
interface AuthLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  showArrow?: boolean;
}

export const AuthLink: React.FC<AuthLinkProps> = ({
  href,
  children,
  variant = 'primary',
  showArrow = false
}) => {
  const baseClasses = "transition-all duration-300";
  const variantClasses = variant === 'primary'
    ? "group inline-flex items-center font-medium text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:from-blue-700 hover:to-purple-700"
    : "text-gray-500 hover:text-gray-700 text-sm";

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses}`}>
      {children}
      {showArrow && (
        <svg className="ml-1 w-4 h-4 text-blue-600 group-hover:text-purple-600 transition-colors duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
};

// Grouped Inputs Component (for stacked inputs like email/password)
interface AuthInputGroupProps {
  children: React.ReactNode;
}

export const AuthInputGroup: React.FC<AuthInputGroupProps> = ({ children }) => {
  return (
    <div className="space-y-4 -space-y-px">
      {children}
    </div>
  );
};