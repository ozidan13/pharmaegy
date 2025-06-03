'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <Navigation title="Admin Users Management" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Admin Users Management</h1>
        {/* Placeholder content */}
        <p className="mt-4">Users management interface will be implemented here.</p>
      </div>
    </ProtectedRoute>
  );
}