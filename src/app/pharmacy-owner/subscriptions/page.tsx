'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function PharmacyOwnerSubscriptionsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <Navigation title="My Subscriptions" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">My Subscriptions</h1>
        {/* Placeholder content */}
        <p className="mt-4">Pharmacy owner subscription details and management will be implemented here.</p>
      </div>
    </ProtectedRoute>
  );
}