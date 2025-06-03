'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';
import { useParams } from 'next/navigation';

export default function EditPharmacyPage() {
  const params = useParams();
  const pharmacyId = params.id;

  // In a real app, you would fetch pharmacy data using this ID

  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <Navigation title={`Edit Pharmacy ${pharmacyId || ''}`} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Edit Pharmacy (ID: {pharmacyId})</h1>
        {/* Placeholder content */}
        <p className="mt-4">
          Form for editing pharmacy with ID {pharmacyId} will be implemented here.
        </p>
        {/* Example: Display fetched data in a form here */}
      </div>
    </ProtectedRoute>
  );
}