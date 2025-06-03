'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function AdminPaymentsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <Navigation title="Admin Payments Management" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Admin Payments Management</h1>
        {/* Placeholder content */}
        <p className="mt-4">Payments management interface will be implemented here.</p>
      </div>
    </ProtectedRoute>
  );
}