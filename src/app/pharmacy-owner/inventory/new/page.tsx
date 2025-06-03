'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';

export default function AddNewProductPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <Navigation title="Add New Product" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        {/* Placeholder content */}
        <p className="mt-4">
          Form for adding a new product to the store inventory will be implemented here.
        </p>
        {/* Future implementation: Product form (name, description, price, stock, category, image upload) */}
      </div>
    </ProtectedRoute>
  );
}