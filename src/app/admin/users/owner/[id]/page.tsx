'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';
import { useParams } from 'next/navigation';

export default function AdminViewPharmacyOwnerPage() {
  const params = useParams();
  const ownerId = params.id;

  // In a real app, you would fetch pharmacy owner data using this ID

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <Navigation title={`Admin: View/Edit Pharmacy Owner ${ownerId || ''}`} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Pharmacy Owner Details (ID: {ownerId})</h1>
        {/* Placeholder content */}
        <p className="mt-4">
          Interface for viewing and editing details for pharmacy owner with ID {ownerId} will be implemented here.
          This will include contact information, pharmacy details, and account status.
        </p>
        {/* Example: Display fetched data or a form here */}
      </div>
    </ProtectedRoute>
  );
}