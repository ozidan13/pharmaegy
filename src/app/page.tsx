'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@prisma/client';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their respective dashboards
      switch (user.role) {
        case UserRole.ADMIN:
          router.push('/admin/dashboard');
          break;
        case UserRole.PHARMACIST:
          router.push('/pharmacist/dashboard');
          break;
        case UserRole.PHARMACY_OWNER:
          router.push('/pharmacy-owner/dashboard');
          break;
        default:
          break;
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Pharma Connect
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Connecting pharmacists with pharmacy owners for better healthcare services
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">For Pharmacists</h3>
              <p className="text-gray-600 mb-4">
                Find opportunities, showcase your skills, and connect with pharmacy owners
              </p>
              <Link 
                href="/auth/register/pharmacist" 
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Join as Pharmacist
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-green-600">For Pharmacy Owners</h3>
              <p className="text-gray-600 mb-4">
                Find qualified pharmacists and manage your pharmacy operations
              </p>
              <Link 
                href="/auth/register/pharmacy-owner" 
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Join as Owner
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-purple-600">Already a Member?</h3>
              <p className="text-gray-600 mb-4">
                Sign in to access your dashboard and manage your profile
              </p>
              <Link 
                href="/auth/login" 
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/auth/admin" 
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
