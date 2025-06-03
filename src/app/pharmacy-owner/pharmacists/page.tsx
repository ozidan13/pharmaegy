'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function PharmacyOwnerPharmacistsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <Navigation title="Pharmacist Search & Hiring" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Pharmacist Search & Hiring</h1>
        {/* Placeholder content */}
        <p className="mt-4">
          This page will allow Pharmacy Owners to view, search, and initiate hiring actions for pharmacists.
        </p>
      </div>
    </ProtectedRoute>
  );
}