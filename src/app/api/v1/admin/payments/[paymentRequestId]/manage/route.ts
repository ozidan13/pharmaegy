import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute } from '@/lib/authUtils';
import { body, param, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner';
import { ApiError, handleApiError } from '@/lib/errors';
import { PaymentStatus, SubscriptionStatus, UserRole } from '@prisma/client';

const validateManagePayment = [
  param('paymentRequestId').isUUID().withMessage('Valid payment request ID is required.'),
  body('action').isIn(['CONFIRM', 'REJECT']).withMessage('Action must be either CONFIRM or REJECT.'),
  body('rejectedReason').optional().if(body('action').equals('REJECT')).notEmpty().isString().withMessage('Rejection reason is required if action is REJECT.'),
];

export async function PATCH(req: NextRequest, { params }: { params: { paymentRequestId: string } }) {
  try {
    const authResult = await authenticateRoute(req);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }
    
    if (authResult.user.role !== UserRole.ADMIN) {
      throw new ApiError(401, 'Unauthorized. Admin access required.');
    }

    const reqBody = await req.json();
    const mockReq = { body: reqBody, params, headers: req.headers, method: req.method, url: req.url } as any;
    const mockRes = { status: () => mockRes, json: () => mockRes } as any;

    // Manually run param validation
    const paramValidation = param('paymentRequestId').isUUID().withMessage('Valid payment request ID is required.');
    await runMiddleware(mockReq, mockRes, paramValidation);

    for (const validation of validateManagePayment.slice(1)) {
      await runMiddleware(mockReq, mockRes, validation);
    }

    const errors = validationResult(mockReq);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const { paymentRequestId } = params;
    const { action, rejectedReason } = mockReq.body as {
      action: 'CONFIRM' | 'REJECT';
      rejectedReason?: string;
    };

    const paymentRequest = await prisma.paymentRequest.findUnique({
      where: { id: paymentRequestId },
      include: { user: true }, // Include user to update their profile
    });

    if (!paymentRequest) {
      throw new ApiError(404, 'Payment request not found.');
    }

    if (paymentRequest.status !== PaymentStatus.PENDING) {
      throw new ApiError(400, `Payment request has already been ${paymentRequest.status.toLowerCase()}.`);
    }

    let updatedPaymentRequest;
    if (action === 'CONFIRM') {
      // Update payment request status
      updatedPaymentRequest = await prisma.paymentRequest.update({
        where: { id: paymentRequestId },
        data: {
          status: PaymentStatus.CONFIRMED,
          confirmedBy: authResult.user.id,
          confirmedAt: new Date(),
          rejectedReason: null,
        },
      });

      // Update user's subscription
      const targetProfile = paymentRequest.user.role === UserRole.PHARMACIST ? 'pharmacistProfile' : 'pharmacyOwnerProfile';
      const profileUpdateData = {
        subscriptionPlan: paymentRequest.subscriptionPlan,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        // Potentially set subscriptionExpiresAt based on plan duration
        // For simplicity, not adding expiry logic here, but it would be needed in a real app
      };

      if (targetProfile === 'pharmacistProfile') {
        await prisma.pharmacistProfile.update({
          where: { userId: paymentRequest.userId },
          data: profileUpdateData,
        });
      } else {
        await prisma.pharmacyOwnerProfile.update({
          where: { userId: paymentRequest.userId },
          data: profileUpdateData,
        });
      }

    } else { // action === 'REJECT'
      updatedPaymentRequest = await prisma.paymentRequest.update({
        where: { id: paymentRequestId },
        data: {
          status: PaymentStatus.REJECTED,
          rejectedReason: rejectedReason,
          confirmedBy: authResult.user.id, // Admin who rejected
          confirmedAt: new Date(), // Timestamp of rejection
        },
      });
      // Optionally, revert user's subscription status if it was PENDING_UPGRADE or similar
    }

    return NextResponse.json({
      message: `Payment request ${action.toLowerCase()}ed successfully.`,
      paymentRequest: {
        id: updatedPaymentRequest.id,
        status: updatedPaymentRequest.status,
        subscriptionPlan: updatedPaymentRequest.subscriptionPlan,
        ...(updatedPaymentRequest.rejectedReason && { rejectedReason: updatedPaymentRequest.rejectedReason }),
      },
    }, { status: 200 });

  } catch (error) {
    return handleApiError(error);
  }
}