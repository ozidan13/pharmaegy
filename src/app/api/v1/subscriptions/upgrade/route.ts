import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute, hasRole } from '@/lib/authUtils';
import { ApiError, handleApiError } from '@/lib/errors';
import { UserRole, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

// POST /api/v1/subscriptions/upgrade - Create payment request for subscription upgrade
export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRoute(req);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }

    const body = await req.json();
    const { plan, userWalletAddress } = body;

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

    // For FREE plan, upgrade immediately
    if (plan === SubscriptionPlan.FREE) {
      let updatedProfile;

      if (userRole === UserRole.PHARMACIST) {
        updatedProfile = await prisma.pharmacistProfile.update({
          where: { userId },
          data: {
            subscriptionPlan: plan,
            subscriptionStatus: SubscriptionStatus.ACTIVE,
            subscriptionExpiresAt: null
          }
        });
      } else if (userRole === UserRole.PHARMACY_OWNER) {
        updatedProfile = await prisma.pharmacyOwnerProfile.update({
          where: { userId },
          data: {
            subscriptionPlan: plan,
            subscriptionStatus: SubscriptionStatus.ACTIVE,
            subscriptionExpiresAt: null
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
        message: `Successfully downgraded to ${plan} plan`,
        data: {
          subscriptionPlan: updatedProfile.subscriptionPlan,
          subscriptionStatus: updatedProfile.subscriptionStatus,
          subscriptionExpiresAt: updatedProfile.subscriptionExpiresAt,
          pricing: pricingInfo
        }
      });
    }

    // For paid plans, create payment request
    if (!userWalletAddress) {
      return NextResponse.json(
        { success: false, message: 'User wallet address is required for paid plans' },
        { status: 400 }
      );
    }

    // Get pricing information
    const pricingInfo = await prisma.subscriptionPricing.findUnique({
      where: { plan }
    });

    if (!pricingInfo) {
      return NextResponse.json(
        { success: false, message: 'Pricing information not found' },
        { status: 404 }
      );
    }

    // Get active wallet configuration
    const walletConfig = await prisma.walletConfig.findFirst({
      where: { isActive: true }
    });

    if (!walletConfig) {
      return NextResponse.json(
        { success: false, message: 'Payment system is currently unavailable' },
        { status: 503 }
      );
    }

    // Check for existing pending payment request
    const existingRequest = await prisma.paymentRequest.findFirst({
      where: {
        userId,
        subscriptionPlan: plan,
        status: 'PENDING'
      }
    });

    if (existingRequest) {
      return NextResponse.json({
        success: false,
        message: 'You already have a pending payment request for this plan',
        data: {
          paymentRequest: existingRequest,
          walletAddress: walletConfig.walletAddress
        }
      });
    }

    // Create payment request
    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        userId,
        subscriptionPlan: plan,
        amount: pricingInfo.price,
        currency: pricingInfo.currency,
        walletAddress: walletConfig.walletAddress,
        userWalletAddress,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment request created. Please send the payment and wait for admin confirmation.',
      data: {
        paymentRequest,
        walletAddress: walletConfig.walletAddress,
        amount: pricingInfo.price,
        currency: pricingInfo.currency,
        instructions: `Please send ${pricingInfo.price} ${pricingInfo.currency} to wallet address: ${walletConfig.walletAddress}`
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
}