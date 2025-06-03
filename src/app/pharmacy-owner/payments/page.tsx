'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function PharmacyOwnerPaymentsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <Navigation title="My Payments" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">My Payments</h1>
        {/* Placeholder content */}
        <p className="mt-4">Pharmacy owner payment history and details will be implemented here.</p>
      </div>
    </ProtectedRoute>
  );
}