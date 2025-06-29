'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface PharmacistFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  experience: string;
  education: string;
  cvUrl: string;
  city: string;
  area: string;
}

interface City {
  id: string;
  name: string;
  nameAr: string;
  areas: Area[];
}

interface Area {
  id: string;
  name: string;
}

export default function PharmacistRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<PharmacistFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bio: '',
    experience: '',
    education: '',
    cvUrl: '',
    city: '',
    area: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/v1/locations/cities');
        const data = await response.json();
        if (data.success) {
          setCities(data.data.cities);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'city') {
      // When city changes, update areas and reset area selection
      const selectedCity = cities.find(city => city.id === value);
      setAreas(selectedCity ? selectedCity.areas : []);
      setFormData(prev => ({ ...prev, [name]: value, area: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      
      // Set default CV URL if not provided
      if (!registrationData.cvUrl || registrationData.cvUrl.trim() === '') {
        registrationData.cvUrl = 'https://docs.google.com/';
      }
      
      const response = await fetch('/api/v1/auth/register/pharmacists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        router.push('/auth/login?message=Registration successful! Please log in.');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden register">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <Navigation />
      
      <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header with Icon */}
          <div className="text-center relative">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Join as Pharmacist
            </h2>
            <p className="text-gray-600 text-lg">
              Create your professional profile
            </p>
          </div>
          
          {/* Glassmorphism Form Container */}
          <div className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="backdrop-blur-sm bg-red-500/10 border border-red-200/50 text-red-700 px-6 py-4 rounded-2xl shadow-lg animate-shake">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent"
                      placeholder="First Name"
                    />
                    <label
                      htmlFor="firstName"
                      className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
                    >
                      First Name *
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent"
                      placeholder="Last Name"
                    />
                    <label
                      htmlFor="lastName"
                      className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
                    >
                      Last Name *
                    </label>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent"
                      placeholder="Email Address"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
                    >
                      Email Address *
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent"
                      placeholder="Phone Number"
                    />
                    <label
                      htmlFor="phoneNumber"
                      className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
                    >
                      Phone Number *
                    </label>
                  </div>
                </div>
              </div>

              {/* Password Fields Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Security</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent"
                      placeholder="Password"
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
                    >
                      Password *
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent"
                      placeholder="Confirm Password"
                    />
                    <label
                      htmlFor="confirmPassword"
                      className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
                    >
                      Confirm Password *
                    </label>
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Professional Information</h3>
                </div>
                
                <div className="relative group">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent resize-none"
                    placeholder="Brief description about yourself"
                  />
                  <label
                    htmlFor="bio"
                    className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
                  >
                    Bio
                  </label>
                </div>

                <div className="relative group">
                  <textarea
                    id="experience"
                    name="experience"
                    rows={3}
                    required
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent resize-none"
                    placeholder="Describe your professional experience"
                  />
                  <label
                    htmlFor="experience"
                    className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
                  >
                    Experience *
                  </label>
                </div>

                <div className="relative group">
                  <textarea
                    id="education"
                    name="education"
                    rows={3}
                    required
                    value={formData.education}
                    onChange={handleInputChange}
                    className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent resize-none"
                    placeholder="Your educational background and qualifications"
                  />
                  <label
                    htmlFor="education"
                    className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
                  >
                    Education *
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="url"
                    id="cvUrl"
                    name="cvUrl"
                    value={formData.cvUrl}
                    onChange={handleInputChange}
                    className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent"
                    placeholder="CV URL (e.g., LinkedIn profile, online resume)"
                  />
                  <label
                    htmlFor="cvUrl"
                    className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
                  >
                    CV URL
                  </label>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <select
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={loadingCities}
                      className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {loadingCities ? 'Loading cities...' : 'Select a city'}
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor="city"
                      className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300"
                    >
                      City *
                    </label>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative group">
                    <select
                      id="area"
                      name="area"
                      required
                      value={formData.area}
                      onChange={handleInputChange}
                      disabled={!formData.city || areas.length === 0}
                      className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!formData.city ? 'Select a city first' : areas.length === 0 ? 'No areas available' : 'Select an area'}
                      </option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor="area"
                      className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300"
                    >
                      Area *
                    </label>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>



              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? 'Creating Your Account...' : 'Create Pharmacist Account'}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="group inline-flex items-center font-medium text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    Sign in
                    <svg className="ml-1 w-4 h-4 text-blue-600 group-hover:text-purple-600 transition-colors duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}