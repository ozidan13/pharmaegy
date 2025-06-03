'use client';

import { UserRole } from '@prisma/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function PharmacyOwnerDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <div className="min-h-screen bg-gray-50">
        <Navigation title="Pharmacy Owner Dashboard" />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pharmacy Status</dt>
                        <dd className="text-lg font-medium text-gray-900">Active</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Pharmacists</dt>
                        <dd className="text-lg font-medium text-gray-900">Coming Soon</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Products Listed</dt>
                        <dd className="text-lg font-medium text-gray-900">Coming Soon</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link
                    href="/pharmacy-owner/profile"
                    className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-green-600 font-medium">Pharmacy Profile</div>
                      <div className="text-sm text-gray-600 mt-1">Manage pharmacy information</div>
                    </div>
                  </Link>
                  
                  <Link
                    href="/pharmacy-owner/pharmacists"
                    className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-blue-600 font-medium">Find Pharmacists</div>
                      <div className="text-sm text-gray-600 mt-1">Browse available pharmacists</div>
                    </div>
                  </Link>
                  
                  <Link
                    href="/pharmacy-owner/products"
                    className="bg-yellow-50 p-4 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-yellow-600 font-medium">Manage Products</div>
                      <div className="text-sm text-gray-600 mt-1">Add and manage products</div>
                    </div>
                  </Link>
                  
                  <Link
                    href="/pharmacy-owner/subscription"
                    className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-purple-600 font-medium">Subscription</div>
                      <div className="text-sm text-gray-600 mt-1">Manage subscription plan</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}