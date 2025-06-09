'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

interface NavigationProps {
  title?: string;
}

export default function Navigation({ title = 'PharmaBridge' }: NavigationProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    
    switch (user.role) {
      case 'PHARMACIST':
        return '/pharmacist/dashboard';
      case 'PHARMACY_OWNER':
        return '/pharmacy-owner/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/auth/login';
    }
  };

  const getProfileLink = () => {
    if (!user) return '/auth/login';
    
    switch (user.role) {
      case 'PHARMACIST':
        return '/pharmacist/profile';
      case 'PHARMACY_OWNER':
        return '/pharmacy-owner/profile';
      case 'ADMIN':
        return '/admin/users'; // Changed from /admin/wallet to /admin/users
      default:
        return '/auth/login';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={isAuthenticated ? getDashboardLink() : '/'} className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">{title}</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center space-x-4">
                  <Link
                    href={getDashboardLink()}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  
                  <Link
                    href={getProfileLink()}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Profile
                  </Link>

                  {user.role === 'PHARMACY_OWNER' && (
                    <Link
                      href="/pharmacy-owner/store" // Corrected link
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Store
                    </Link>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{user.email}</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {user.role.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging out...
                      </div>
                    ) : (
                      'Logout'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register/pharmacist"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}