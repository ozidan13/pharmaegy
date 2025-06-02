import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute, hasRole } from '@/lib/authUtils';
import { UserRole } from '@prisma/client';
import { ApiError, handleApiError } from '@/lib/errors';
import { body, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner';

// Validation for subscription update
const validateSubscription = [
  body('planType')
    .notEmpty().withMessage('Plan type is required')
    .isIn(['none', 'basic', 'premium']).withMessage('Plan type must be one of: none, basic, premium'),
];

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRoute(req);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }
    if (!hasRole(authResult.user, UserRole.PHARMACY_OWNER)) {
      return NextResponse.json({ message: 'Access denied. Pharmacy owner role required.' }, { status: 403 });
    }
    const userId = authResult.user.id;

    // Run validation middleware
    // Clone the request to allow body consumption by both middleware and handler
    const reqClone = req.clone();
    const bodyData = await req.json(); // Consume the body once
    (reqClone as any).body = bodyData; // Attach parsed body for validator
    (req as any).json = async () => bodyData; // Ensure original req can still access body if needed later by handler

    await runMiddleware(reqClone, NextResponse.next(), validateSubscription);
    const errors = validationResult(reqClone as any); // Cast req to any for express-validator
    if (!errors.isEmpty()) {
      throw ApiError.badRequest('Validation failed', errors.array());
    }

    const { planType } = bodyData;

    let expiresAt: Date | null = new Date();
    if (planType === 'none') {
        expiresAt = null; // No expiration for 'none' plan or set to now/past
    } else {
        expiresAt.setDate(expiresAt.getDate() + 30); // 30-day subscription for basic/premium
    }
    
    const updatedProfile = await prisma.pharmacyOwnerProfile.update({
      where: { userId },
      data: {
        subscriptionStatus: planType,
        subscriptionExpiresAt: expiresAt,
        updatedAt: new Date(),
      },
      select: {
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription updated successfully',
      data: {
        status: updatedProfile.subscriptionStatus,
        expiresAt: updatedProfile.subscriptionExpiresAt,
      },
    });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return handleApiError(ApiError.notFound('Pharmacy owner profile not found to update subscription.'));
    }
    return handleApiError(error);
  }
}