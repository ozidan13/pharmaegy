'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@prisma/client';
import Navigation from '@/components/Navigation';
import { useParams } from 'next/navigation';

export default function AdminViewSubscriptionPage() {
  const params = useParams();
  const subscriptionId = params.id;

  // In a real app, you would fetch subscription data using this ID

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <Navigation title={`Admin: View Subscription ${subscriptionId || ''}`} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Subscription Details (ID: {subscriptionId})</h1>
        {/* Placeholder content */}
        <p className="mt-4">
          Interface for viewing details for subscription with ID {subscriptionId} will be implemented here.
          This will include user, plan, status, start/end dates, and payment history.
        </p>
        {/* Example: Display fetched data here */}
      </div>
    </ProtectedRoute>
  );
}