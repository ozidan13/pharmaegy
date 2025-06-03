'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function BrowseProductsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACIST, UserRole.PHARMACY_OWNER]}>
      <Navigation title="Browse Store Products" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Store Products</h1>
        {/* Placeholder content */}
        <p className="mt-4">
          This page will display a list of store products, including names, descriptions, prices, and availability. 
          Pharmacists and Pharmacy Owners can view this page.
        </p>
        {/* Future implementation: Product listing, search, filters */}
      </div>
    </ProtectedRoute>
  );
}