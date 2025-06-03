'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function PharmacistPaymentsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACIST]}>
      <Navigation title="My Payments" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">My Payments</h1>
        {/* Placeholder content */}
        <p className="mt-4">Pharmacist payment history and details will be implemented here.</p>
      </div>
    </ProtectedRoute>
  );
}