import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute } from '@/lib/authUtils';
import { body, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner';
import { ApiError, handleApiError } from '@/lib/errors';
import { SubscriptionPlan, PaymentStatus, UserRole } from '@prisma/client';

const validateSubscriptionChangeRequest = [
  body('newPlan')
    .isIn(Object.values(SubscriptionPlan))
    .withMessage('Invalid subscription plan requested.'),
];

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRoute(req);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }

    const reqBody = await req.json();
    const mockReq = { body: reqBody, headers: req.headers, method: req.method, url: req.url } as any;
    const mockRes = { status: () => mockRes, json: () => mockRes } as any;

    for (const validation of validateSubscriptionChangeRequest) {
      await runMiddleware(mockReq, mockRes, validation);
    }

    const errors = validationResult(mockReq);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const { newPlan } = mockReq.body as { newPlan: SubscriptionPlan };

    // 1. Get current user's profile to check current plan (optional, for validation)
    let userProfile;
    if (authResult.user.role === UserRole.PHARMACIST) {
      userProfile = await prisma.pharmacistProfile.findUnique({ where: { userId: authResult.user.id } });
    } else if (authResult.user.role === UserRole.PHARMACY_OWNER) {
      userProfile = await prisma.pharmacyOwnerProfile.findUnique({ where: { userId: authResult.user.id } });
    }

    if (!userProfile) {
      throw new ApiError(404, 'User profile not found.');
    }

    if (userProfile.subscriptionPlan === newPlan && userProfile.subscriptionStatus === 'ACTIVE') {
        throw new ApiError(400, `You are already subscribed to the ${newPlan} plan.`);
    }

    // 2. Fetch active platform wallet
    const activeWallet = await prisma.walletConfig.findFirst({
      where: { isActive: true },
    });

    if (!activeWallet) {
      throw new ApiError(500, 'Platform payment wallet not configured. Please contact support.');
    }

    // 3. Fetch pricing for the new plan
    const planPricing = await prisma.subscriptionPricing.findUnique({
      where: { plan: newPlan },
    });

    if (!planPricing) {
      throw new ApiError(404, `Pricing for ${newPlan} plan not found.`);
    }

    // 4. Create a PaymentRequest
    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        userId: authResult.user.id,
        subscriptionPlan: newPlan,
        amount: planPricing.price,
        currency: planPricing.currency,
        walletAddress: activeWallet.walletAddress, // Platform's wallet to receive payment
        status: PaymentStatus.PENDING,
      },
    });

    return NextResponse.json({
      message: 'Subscription change request initiated. Please complete the payment.',
      paymentRequest: {
        id: paymentRequest.id,
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        platformWalletAddress: paymentRequest.walletAddress,
        requestedPlan: paymentRequest.subscriptionPlan,
      },
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error);
  }
}