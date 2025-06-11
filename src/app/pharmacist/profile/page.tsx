'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

interface PharmacistProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string | null;
  cvUrl?: string | null;
  bio?: string | null;
  experience?: string | null;
  education?: string | null;
  city?: string | null;
  area?: string | null;
  available?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function PharmacistProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<PharmacistProfile | null>(null);
  const [newCvUrl, setNewCvUrl] = useState<string>('');
  const [updateCvMessage, setUpdateCvMessage] = useState<string | null>(null);
  const [updateCvError, setUpdateCvError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError('No authentication token available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/v1/pharmacists/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleUpdateCv = async () => {
    if (!token) {
      setUpdateCvError('No authentication token available');
      return;
    }
    if (!newCvUrl) {
      setUpdateCvError('Please enter a new CV URL.');
      return;
    }

    try {
      setLoading(true);
      setUpdateCvMessage(null);
      setUpdateCvError(null);
      const response = await fetch('/api/v1/pharmacists/me/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cvUrl: newCvUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update CV URL');
      }

      setUpdateCvMessage(result.message || 'CV URL updated successfully!');
      // Optionally, refresh profile data to show the new CV URL immediately
      if (profile) {
        setProfile({ ...profile, cvUrl: newCvUrl });
      }
      setNewCvUrl(''); // Clear the input field
    } catch (err: any) {
      setUpdateCvError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACIST]}>
      <div className="min-h-screen relative overflow-hidden profile-page">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <Navigation title="Pharmacist Profile" />

        <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl w-full space-y-8">
            {/* Header with Icon */}
            <div className="text-center relative">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Pharmacist Profile
              </h2>
              <p className="text-gray-600 text-lg">
                View and manage your professional information.
              </p>
            </div>

            {/* Glassmorphism Form Container */}
            <div className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl p-8 shadow-2xl">
              {loading && (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-700 mt-4">Loading profile...</p>
                </div>
              )}
              {error && (
                <div className="backdrop-blur-sm bg-red-500/10 border border-red-200/50 text-red-700 px-6 py-4 rounded-2xl shadow-lg animate-shake">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Error: {error}
                  </div>
                </div>
              )}

              {profile && !loading && !error && (
                <div className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                      <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="text-lg">{profile.firstName} {profile.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-lg">{profile.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                        <p className="text-lg">{profile.phoneNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Availability</p>
                        <p className={`text-lg font-semibold ${profile.available ? 'text-green-700' : 'text-red-700'}`}>
                          {profile.available ? 'Available' : 'Not Available'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-lg">{profile.city || 'N/A'}{profile.area ? `, ${profile.area}` : ''}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details Section */}
                  {(profile.bio || profile.education || profile.experience || profile.cvUrl) && (
                    <div className="space-y-6 pt-6 border-t border-white/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full animate-pulse"></div>
                        <h3 className="text-xl font-semibold text-gray-800">Professional Details</h3>
                      </div>
                      <div className="space-y-4 text-gray-700">
                        {profile.bio && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Bio</p>
                            <p className="text-lg whitespace-pre-wrap">{profile.bio}</p>
                          </div>
                        )}
                        {profile.education && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Education</p>
                            <p className="text-lg whitespace-pre-wrap">{profile.education}</p>
                          </div>
                        )}
                        {profile.experience && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Experience</p>
                            <p className="text-lg whitespace-pre-wrap">{profile.experience}</p>
                          </div>
                        )}
                        {profile.cvUrl && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Curriculum Vitae (CV)</p>
                            <a 
                              href={profile.cvUrl.startsWith('http') ? profile.cvUrl : `/uploads/cvs/${profile.cvUrl.split('/').pop()}`}
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300"
                            >
                              View/Download CV
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CV Update Section */}
                  <div className="space-y-6 pt-6 border-t border-white/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
                      <h3 className="text-xl font-semibold text-gray-800">Update CV Link</h3>
                    </div>
                    <div className="relative group">
                      <input 
                        type="url" 
                        id="newCvUrl"
                        value={newCvUrl} 
                        onChange={(e) => {
                          setNewCvUrl(e.target.value);
                          setUpdateCvMessage(null);
                          setUpdateCvError(null);
                        }} 
                        placeholder="Enter new CV URL (e.g., https://example.com/cv.pdf)" 
                        className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent"
                      />
                      <label
                        htmlFor="newCvUrl"
                        className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
                      >
                        New CV Link
                      </label>
                    </div>
                    <button 
                      onClick={handleUpdateCv} 
                      disabled={loading || !newCvUrl}
                      className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                      {loading && !updateCvMessage && !updateCvError ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : 'Update CV Link'}
                    </button>
                    {updateCvMessage && (
                        <div className="backdrop-blur-sm bg-green-500/10 border border-green-200/50 text-green-700 px-6 py-4 rounded-2xl shadow-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {updateCvMessage}
                            </div>
                        </div>
                    )}
                    {updateCvError && (
                        <div className="backdrop-blur-sm bg-red-500/10 border border-red-200/50 text-red-700 px-6 py-4 rounded-2xl shadow-lg animate-shake">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {updateCvError}
                            </div>
                        </div>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="mt-8 pt-6 border-t border-white/20 text-sm text-gray-500 text-center">
                    <p>Profile Created: {new Date(profile.createdAt).toLocaleDateString()}</p>
                    <p>Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}