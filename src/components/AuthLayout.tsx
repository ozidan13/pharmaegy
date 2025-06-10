'use client';

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: 'blue' | 'purple' | 'green';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  icon, 
  accentColor = 'blue' 
}) => {
  const getAccentColors = () => {
    switch (accentColor) {
      case 'purple':
        return {
          gradient: 'from-purple-500 to-indigo-600',
          bgGradient: 'from-purple-50 to-indigo-100',
          ring: 'focus:ring-purple-500/50',
          text: 'from-purple-600 to-indigo-600'
        };
      case 'green':
        return {
          gradient: 'from-green-500 to-blue-600',
          bgGradient: 'from-green-50 to-blue-100',
          ring: 'focus:ring-green-500/50',
          text: 'from-green-600 to-blue-600'
        };
      default:
        return {
          gradient: 'from-blue-500 to-purple-600',
          bgGradient: 'from-blue-50 to-indigo-100',
          ring: 'focus:ring-blue-500/50',
          text: 'from-blue-600 to-purple-600'
        };
    }
  };

  const colors = getAccentColors();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bgGradient}`}>
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/30 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-white/25 rounded-full blur-xl animate-bounce" style={{ animationDelay: '3s' }}></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-64 h-64 border border-white/20 rounded-3xl rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/15 rounded-2xl rotate-12 animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            {icon && (
              <div className="mx-auto mb-6 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                {icon}
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
            {subtitle && (
              <p className="text-gray-600">{subtitle}</p>
            )}
          </div>

          {/* Form Container */}
          <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;