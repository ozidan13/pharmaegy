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

  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACIST]}>
      <Navigation title="Pharmacist Profile" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Pharmacist Profile</h1>
        
        {loading && <p>Loading profile...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {profile && !loading && !error && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-semibold">{profile.firstName} {profile.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg">{profile.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-lg">{profile.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className={`text-lg font-semibold ${profile.available ? 'text-green-600' : 'text-red-600'}`}>
                  {profile.available ? 'Available' : 'Not Available'}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-lg">{profile.city || 'N/A'}{profile.area ? `, ${profile.area}` : ''}</p>
              </div>
              {profile.bio && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-lg whitespace-pre-wrap">{profile.bio}</p>
                </div>
              )}
              {profile.education && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Education</p>
                  <p className="text-lg whitespace-pre-wrap">{profile.education}</p>
                </div>
              )}
              {profile.experience && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-lg whitespace-pre-wrap">{profile.experience}</p>
                </div>
              )}
              {profile.cvUrl && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Curriculum Vitae (CV)</p>
                  <a 
                    href={profile.cvUrl.startsWith('http') ? profile.cvUrl : `/uploads/cvs/${profile.cvUrl.split('/').pop()}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    View/Download CV
                  </a>
                </div>
              )}
            </div>
            <div className="mt-6 border-t pt-4 text-sm text-gray-500">
              <p>Profile Created: {new Date(profile.createdAt).toLocaleDateString()}</p>
              <p>Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}