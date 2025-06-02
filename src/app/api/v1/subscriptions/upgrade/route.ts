import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute, hasRole } from '@/lib/authUtils';
import { ApiError, handleApiError } from '@/lib/errors';
import { UserRole, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

// POST /api/v1/subscriptions/upgrade - Upgrade user subscription
export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRoute(req);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }

    const body = await req.json();
    const { plan } = body;

    if (!plan || !Object.values(SubscriptionPlan).includes(plan)) {
      return NextResponse.json(
        { success: false, message: 'Valid subscription plan is required' },
        { status: 400 }
      );
    }

    const userId = authResult.user.id;
    const userRole = authResult.user.role;

    // Check if the plan is valid for the user role
    if (plan === SubscriptionPlan.PREMIUM && userRole === UserRole.PHARMACIST) {
      return NextResponse.json(
        { success: false, message: 'Premium plan is not available for pharmacists' },
        { status: 400 }
      );
    }

    // Calculate subscription expiry date (30 days from now for paid plans)
    const subscriptionExpiresAt = plan === SubscriptionPlan.FREE 
      ? null 
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    let updatedProfile;

    if (userRole === UserRole.PHARMACIST) {
      updatedProfile = await prisma.pharmacistProfile.update({
        where: { userId },
        data: {
          subscriptionPlan: plan,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
          subscriptionExpiresAt
        }
      });
    } else if (userRole === UserRole.PHARMACY_OWNER) {
      updatedProfile = await prisma.pharmacyOwnerProfile.update({
        where: { userId },
        data: {
          subscriptionPlan: plan,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
          subscriptionExpiresAt
        }
      });
    } else {
      throw ApiError.badRequest('Invalid user role');
    }

    // Get pricing information
    const pricingInfo = await prisma.subscriptionPricing.findUnique({
      where: { plan }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${plan} plan`,
      data: {
        subscriptionPlan: updatedProfile.subscriptionPlan,
        subscriptionStatus: updatedProfile.subscriptionStatus,
        subscriptionExpiresAt: updatedProfile.subscriptionExpiresAt,
        pricing: pricingInfo
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}