'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

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

interface Pharmacist {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  experience: string;
  education: string;
  city: string;
  area: string;
  available: boolean;
  cvUrl?: string;
  phoneNumber?: string; // Add phoneNumber to the interface
  user: {
    email: string;
  };
  updatedAt: string;
}

interface SearchResponse {
  success: boolean;
  data: Pharmacist[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
  };
}

export default function PharmacyOwnerPharmacistsPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Search filters
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [availableOnly, setAvailableOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 10
  });

  // Fetch cities on component mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Search pharmacists when filters change
  useEffect(() => {
    if (selectedCity) {
      searchPharmacists();
    }
  }, [selectedCity, selectedArea, availableOnly, currentPage]);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/v1/locations/cities');
      const data = await response.json();
      if (data.success) {
        setCities(data.data.cities);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const searchPharmacists = async () => {
    if (!selectedCity) return;
    
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        city: selectedCity,
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (selectedArea) {
        params.append('area', selectedArea);
      }
      
      if (availableOnly) {
        params.append('available', 'true');
      }
      
      const response = await fetch(`/api/v1/pharmacists/search?${params}`);
      const data: SearchResponse = await response.json();
      
      if (data.success) {
        setPharmacists(data.data);
        setPagination(data.pagination);
      } else {
        setError('Failed to search pharmacists');
      }
    } catch (err) {
      setError('Error searching pharmacists');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    setSelectedArea(''); // Reset area when city changes
    setCurrentPage(1); // Reset to first page
  };

  const handleAreaChange = (areaName: string) => {
    setSelectedArea(areaName);
    setCurrentPage(1); // Reset to first page
  };

  const selectedCityData = cities.find(city => city.name === selectedCity);

  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <div className="min-h-screen bg-gray-50">
        <Navigation title="Pharmacist Search & Hiring" />
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Search Filters */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Search Filters</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* City Selection */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    id="city"
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Area Selection */}
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                    Area (Optional)
                  </label>
                  <select
                    id="area"
                    value={selectedArea}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    disabled={!selectedCityData}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">All areas</option>
                    {selectedCityData?.areas.map((area) => (
                      <option key={area.id} value={area.name}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Available Only Filter */}
                <div className="flex items-center">
                  <input
                    id="available-only"
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => {
                      setAvailableOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="available-only" className="ml-2 block text-sm text-gray-900">
                    Show only available pharmacists
                  </label>
                </div>
              </div>
            </div>
            
            {/* Results Section */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Searching pharmacists...</p>
              </div>
            )}
            
            {!loading && selectedCity && (
              <>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Search Results ({pagination.totalResults} pharmacists found)
                  </h3>
                </div>
                
                {/* Pharmacist Cards */}
                {pharmacists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {pharmacists.map((pharmacist) => (
                      <div key={pharmacist.id} className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">
                              {pharmacist.firstName} {pharmacist.lastName}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">{pharmacist.user.email}</p>
                            
                            <div className="mb-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                pharmacist.available 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {pharmacist.available ? 'Available' : 'Not Available'}
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <p><strong>Location:</strong> {pharmacist.city}{pharmacist.area && `, ${pharmacist.area}`}</p>
                              {pharmacist.experience && (
                                <p><strong>Experience:</strong> {pharmacist.experience}</p>
                              )}
                              {pharmacist.education && (
                                <p><strong>Education:</strong> {pharmacist.education}</p>
                              )}
                              {pharmacist.bio && (
                                <p><strong>Bio:</strong> {pharmacist.bio}</p>
                              )}
                              {pharmacist.phoneNumber && (
                                <p><strong>Phone:</strong> {pharmacist.phoneNumber}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          {pharmacist.cvUrl ? (
                            <a 
                              href={pharmacist.cvUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              View CV
                            </a>
                          ) : (
                            <button 
                              disabled
                              className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                            >
                              CV Not Available
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              if (pharmacist.user.email) {
                                const subject = encodeURIComponent('Job Opportunity - PharmaEgy');
                                const body = encodeURIComponent(
                                  `Hello ${pharmacist.firstName},\n\nI found your profile on PharmaEgy and I'm interested in discussing potential opportunities.\n\nBest regards.`
                                );
                                window.location.href = `mailto:${pharmacist.user.email}?subject=${subject}&body=${body}`;
                              }
                            }}
                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                          >
                            Contact
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !loading && selectedCity && (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No pharmacists found matching your criteria.</p>
                    </div>
                  )
                )}
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                        disabled={currentPage === pagination.totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing page <span className="font-medium">{currentPage}</span> of{' '}
                          <span className="font-medium">{pagination.totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          
                          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                  currentPage === pageNum
                                    ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                            disabled={currentPage === pagination.totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {!selectedCity && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-600">Please select a city to search for pharmacists.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}