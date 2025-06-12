'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function PharmacyOwnerProfilePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <Navigation title="Pharmacy Owner Profile" />
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
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
            {/* Profile Card */}
            <div className="backdrop-blur-sm bg-white/30 border border-white/20 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pharmacy Owner Profile</h1>
                <p className="text-gray-600">Manage your pharmacy information and settings</p>
              </div>

              {/* Profile Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Information */}
                <div className="backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                      <div className="text-gray-900 bg-white/50 rounded-lg p-3 border border-white/30">
                        Coming Soon
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="text-gray-900 bg-white/50 rounded-lg p-3 border border-white/30">
                        testpharmacy3@gmail.com
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="text-gray-900 bg-white/50 rounded-lg p-3 border border-white/30">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pharmacy Information */}
                <div className="backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    Pharmacy Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Name</label>
                      <div className="text-gray-900 bg-white/50 rounded-lg p-3 border border-white/30">
                        Coming Soon
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <div className="text-gray-900 bg-white/50 rounded-lg p-3 border border-white/30">
                        Coming Soon
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City & Area</label>
                      <div className="text-gray-900 bg-white/50 rounded-lg p-3 border border-white/30">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Edit Profile
                </button>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}