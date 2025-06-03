'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.productId;

  // In a real app, you would fetch product data using this ID

  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <Navigation title={`Edit Product ${productId || ''}`} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Edit Product (ID: {productId})</h1>
        {/* Placeholder content */}
        <p className="mt-4">
          Form for editing product with ID {productId} will be implemented here.
        </p>
        {/* Future implementation: Product form pre-filled with data, update/delete actions */}
      </div>
    </ProtectedRoute>
  );
}