'use client';

import { UserRole } from '@prisma/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function PharmacistDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACIST]}>
      <Navigation title="Pharmacist Dashboard" />

      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>


        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="backdrop-blur-sm bg-white/30 border border-white/20 rounded-2xl p-6 shadow-xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, Pharmacist!
                </h1>
                <p className="text-gray-600">
                  Manage your professional profile and stay updated with the latest opportunities.
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="backdrop-blur-sm bg-white/40 border border-white/30 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/50 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Profile Status</dt>
                      <dd className="text-2xl font-bold text-gray-900 mt-1">Active</dd>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/40 border border-white/30 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/50 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Subscription</dt>
                      <dd className="text-2xl font-bold text-gray-900 mt-1">Coming Soon</dd>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/40 border border-white/30 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/50 group sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Profile Views</dt>
                      <dd className="text-2xl font-bold text-gray-900 mt-1">10</dd>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-sm bg-white/30 border border-white/20 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                  href="/pharmacist/profile"
                  className="group backdrop-blur-sm bg-gradient-to-r from-blue-50/50 to-blue-100/50 border border-blue-200/30 p-6 rounded-xl hover:from-blue-100/70 hover:to-blue-200/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-blue-700 font-semibold text-lg mb-2">Manage Profile</div>
                    <div className="text-sm text-gray-600">Update your professional information and CV</div>
                  </div>
                </Link>

                <Link
                  href="/pharmacist/subscription"
                  className="group backdrop-blur-sm bg-gradient-to-r from-yellow-50/50 to-yellow-100/50 border border-yellow-200/30 p-6 rounded-xl hover:from-yellow-100/70 hover:to-yellow-200/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>
                    <div className="text-yellow-700 font-semibold text-lg mb-2">Subscription</div>
                    <div className="text-sm text-gray-600">Manage your subscription plan</div>
                  </div>
                </Link>

                <Link
                  href="https://wa.me/201555299709"
                  className="group backdrop-blur-sm bg-gradient-to-r from-green-50/50 to-green-100/50 border border-green-200/30 p-6 rounded-xl hover:from-green-100/70 hover:to-green-200/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 15v-3a2 2 0 114 0v3H8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-green-700 font-semibold text-lg mb-2">Create a CV</div>
                    <div className="text-sm text-gray-600">Get the Chance to get a professional CV</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}