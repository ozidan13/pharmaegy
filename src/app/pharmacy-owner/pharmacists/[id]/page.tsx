'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

interface PharmacistProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  experience?: string;
  education?: string;
  city: string;
  area?: string;
  available: boolean;
  cv?: {
    url: string;
    uploadedAt: string;
  } | null;
  updatedAt: string;
}

export default function PharmacistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [pharmacist, setPharmacist] = useState<PharmacistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const pharmacistId = params.id as string;

  useEffect(() => {
    if (pharmacistId) {
      fetchPharmacistProfile();
    }
  }, [pharmacistId]);

  const fetchPharmacistProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/v1/pharmacists/${pharmacistId}`);
      const data = await response.json();
      
      if (data.success) {
        setPharmacist(data.data);
      } else {
        setError(data.message || 'Failed to load pharmacist profile');
      }
    } catch (err) {
      setError('Error loading pharmacist profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    if (!pharmacist?.phoneNumber) {
      alert('Phone number not available for this pharmacist');
      return;
    }
    
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = pharmacist.phoneNumber.replace(/[^+\d]/g, '');
    
    // Create WhatsApp message
    const message = encodeURIComponent(
      `Hello ${pharmacist.firstName}, I found your profile on PharmaEgy and I'm interested in discussing potential opportunities. Best regards.`
    );
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailContact = () => {
    if (!pharmacist?.email) {
      alert('Email not available for this pharmacist');
      return;
    }
    
    const subject = encodeURIComponent('Job Opportunity - PharmaEgy');
    const body = encodeURIComponent(
      `Hello ${pharmacist.firstName},\n\nI found your profile on PharmaEgy and I'm interested in discussing potential opportunities.\n\nBest regards.`
    );
    
    window.location.href = `mailto:${pharmacist.email}?subject=${subject}&body=${body}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
        <div className="min-h-screen bg-gray-50">
          <Navigation title="Pharmacist Profile" />
          <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading pharmacist profile...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
        <div className="min-h-screen bg-gray-50">
          <Navigation title="Pharmacist Profile" />
          <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => router.back()}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!pharmacist) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
        <div className="min-h-screen bg-gray-50">
          <Navigation title="Pharmacist Profile" />
          <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="text-center py-8">
              <p className="text-gray-600">Pharmacist not found.</p>
              <button
                onClick={() => router.back()}
                className="mt-2 text-blue-600 hover:text-blue-800 underline"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <div className="min-h-screen bg-gray-50">
        <Navigation title="Pharmacist Profile" />
        
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to search
              </button>
            </div>

            {/* Profile Header */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {pharmacist.firstName} {pharmacist.lastName}
                  </h1>
                  <p className="text-gray-600 mt-1">{pharmacist.email}</p>
                  
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      pharmacist.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pharmacist.available ? 'Available for hire' : 'Not available'}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Profile last updated: {formatDate(pharmacist.updatedAt)}</p>
                  </div>
                </div>
                
                {/* Contact Actions */}
                <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col space-y-2">
                  <button
                    onClick={handleEmailContact}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Email
                  </button>
                  
                  <button
                    onClick={handleWhatsAppContact}
                    disabled={!pharmacist.phoneNumber}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                      pharmacist.phoneNumber
                        ? 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                        : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                    }`}
                    title={!pharmacist.phoneNumber ? 'Phone number not available' : 'Contact via WhatsApp'}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    {pharmacist.phoneNumber ? 'WhatsApp' : 'No Phone'}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Personal Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {pharmacist.city}{pharmacist.area && `, ${pharmacist.area}`}
                    </p>
                  </div>
                  
                  {pharmacist.phoneNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="mt-1 text-sm text-gray-900">{pharmacist.phoneNumber}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{pharmacist.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Availability Status</label>
                    <p className={`mt-1 text-sm font-medium ${
                      pharmacist.available ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {pharmacist.available ? 'Available for hire' : 'Not currently available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h2>
                
                <div className="space-y-4">
                  {pharmacist.education && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Education</label>
                      <p className="mt-1 text-sm text-gray-900">{pharmacist.education}</p>
                    </div>
                  )}
                  
                  {pharmacist.experience && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <p className="mt-1 text-sm text-gray-900">{pharmacist.experience}</p>
                    </div>
                  )}
                  
                  {pharmacist.cv && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CV/Resume</label>
                      <div className="mt-1">
                        <a
                          href={pharmacist.cv.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download CV
                        </a>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded: {formatDate(pharmacist.cv.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {pharmacist.bio && (
              <div className="mt-6 bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{pharmacist.bio}</p>
              </div>
            )}

            {/* Contact Information Notice */}
            {!pharmacist.phoneNumber && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Limited Contact Information
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>This pharmacist hasn't provided a phone number. You can still contact them via email.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}