'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';
import { useParams } from 'next/navigation';

export default function AdminViewPharmacistPage() {
  const params = useParams();
  const pharmacistId = params.id;

  // In a real app, you would fetch pharmacist data using this ID

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <Navigation title={`Admin: View/Edit Pharmacist ${pharmacistId || ''}`} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Pharmacist Details (ID: {pharmacistId})</h1>
        {/* Placeholder content */}
        <p className="mt-4">
          Interface for viewing and editing details for pharmacist with ID {pharmacistId} will be implemented here.
          This will include personal information, professional qualifications, CV, and account status.
        </p>
        {/* Example: Display fetched data or a form here */}
      </div>
    </ProtectedRoute>
  );
}