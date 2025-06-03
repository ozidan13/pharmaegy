'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function PharmacyOwnerProfilePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <Navigation title="Pharmacy Owner Profile" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Pharmacy Owner Profile</h1>
        {/* Placeholder content */}
        <p className="mt-4">Pharmacy owner profile viewing and editing interface will be implemented here.</p>
      </div>
    </ProtectedRoute>
  );
}