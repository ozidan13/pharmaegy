'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function AddNewPharmacyPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <Navigation title="Add New Pharmacy" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Add New Pharmacy</h1>
        {/* Placeholder content */}
        <p className="mt-4">Form for adding a new pharmacy will be implemented here.</p>
      </div>
    </ProtectedRoute>
  );
}