'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function PharmacyOwnerStorePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <Navigation title="Manage Your Store" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Manage Your Store</h1>
        {/* Placeholder content */}
        <p className="mt-4">Pharmacy store management interface (e.g., details, staff, services) will be implemented here.</p>
      </div>
    </ProtectedRoute>
  );
}