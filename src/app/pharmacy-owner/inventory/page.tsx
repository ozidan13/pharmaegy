'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function PharmacyOwnerInventoryPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PHARMACY_OWNER]}>
      <Navigation title="Product & Inventory Management" />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Store Inventory</h1>
          <Link href="/pharmacy-owner/inventory/new" legacyBehavior>
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add New Product
            </a>
          </Link>
        </div>
        {/* Placeholder content */}
        <p className="mt-4">
          This page will display the list of products for the pharmacy owner. 
          They can add, edit, or remove products from here.
        </p>
        {/* Future implementation: Product list, edit/delete buttons */}
      </div>
    </ProtectedRoute>
  );
}