import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute } from '@/lib/authUtils';
import { ApiError, handleApiError } from '@/lib/errors';
import { UserRole } from '@prisma/client';

// GET /api/v1/subscriptions/me - Get current user's subscription status
export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRoute(req);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }

    const userId = authResult.user.id;
    const userRole = authResult.user.role;

    let profile;
    let subscriptionData;

    if (userRole === UserRole.PHARMACIST) {
      profile = await prisma.pharmacistProfile.findUnique({
        where: { userId },
        select: {
          subscriptionPlan: true,
          subscriptionStatus: true,
          subscriptionExpiresAt: true
        }
      });
    } else if (userRole === UserRole.PHARMACY_OWNER) {
      profile = await prisma.pharmacyOwnerProfile.findUnique({
        where: { userId },
        select: {
          subscriptionPlan: true,
          subscriptionStatus: true,
          subscriptionExpiresAt: true
        }
      });
    } else {
      throw ApiError.badRequest('Invalid user role');
    }

    if (!profile) {
      throw ApiError.notFound('User profile not found');
    }

    // Get pricing information for current plan
    const pricingInfo = await prisma.subscriptionPricing.findUnique({
      where: { plan: profile.subscriptionPlan }
    });

    // Check if subscription is expired
    const isExpired = profile.subscriptionExpiresAt && 
      new Date() > profile.subscriptionExpiresAt;

    subscriptionData = {
      plan: profile.subscriptionPlan,
      status: isExpired ? 'EXPIRED' : profile.subscriptionStatus,
      expiresAt: profile.subscriptionExpiresAt,
      pricing: pricingInfo,
      isExpired,
      daysRemaining: profile.subscriptionExpiresAt 
        ? Math.max(0, Math.ceil((profile.subscriptionExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : null
    };

    return NextResponse.json({
      success: true,
      data: subscriptionData
    });
  } catch (error) {
    return handleApiError(error);
  }
}