import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute } from '@/lib/authUtils';
import { body, param, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner';
import { ApiError, handleApiError } from '@/lib/errors';
import { PaymentStatus } from '@prisma/client';

const validateSubmitPayment = [
  param('paymentRequestId').isUUID().withMessage('Valid payment request ID is required.'),
  body('userWalletAddress').notEmpty().isString().withMessage('Sender wallet address is required.'),
  body('transactionHash').optional().isString().withMessage('Transaction hash must be a string.'),
];

export async function PATCH(req: NextRequest, { params }: { params: { paymentRequestId: string } }) {
  try {
    const authResult = await authenticateRoute(req);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }

    const reqBody = await req.json();
    const mockReq = { body: reqBody, params, headers: req.headers, method: req.method, url: req.url } as any;
    const mockRes = { status: () => mockRes, json: () => mockRes } as any;

    // Manually run param validation as runMiddleware might not handle it directly for route params
    const paramValidation = param('paymentRequestId').isUUID().withMessage('Valid payment request ID is required.');
    await runMiddleware(mockReq, mockRes, paramValidation);
    
    for (const validation of validateSubmitPayment.slice(1)) { // Skip param validation as it's handled
      await runMiddleware(mockReq, mockRes, validation);
    }

    const errors = validationResult(mockReq);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const { paymentRequestId } = params;
    const { userWalletAddress, transactionHash } = mockReq.body as {
      userWalletAddress: string;
      transactionHash?: string;
    };

    // 1. Find the payment request
    const paymentRequest = await prisma.paymentRequest.findUnique({
      where: { id: paymentRequestId, userId: authResult.user.id }, // Ensure user owns this request
    });

    if (!paymentRequest) {
      throw new ApiError(404, 'Payment request not found or you are not authorized to update it.');
    }

    // 2. Check if payment is already processed
    if (paymentRequest.status !== PaymentStatus.PENDING) {
      throw new ApiError(400, `Payment request is already ${paymentRequest.status.toLowerCase()}.`);
    }

    // 3. Update the payment request with user's wallet and optional transaction hash
    const updatedPaymentRequest = await prisma.paymentRequest.update({
      where: { id: paymentRequestId },
      data: {
        userWalletAddress,
        transactionHash,
        // Status remains PENDING until admin confirmation
      },
    });

    return NextResponse.json({
      message: 'Payment details submitted successfully. Your subscription will be updated after admin confirmation.',
      paymentRequest: {
        id: updatedPaymentRequest.id,
        status: updatedPaymentRequest.status,
        userWalletAddress: updatedPaymentRequest.userWalletAddress,
        transactionHash: updatedPaymentRequest.transactionHash,
      },
    }, { status: 200 });

  } catch (error) {
    return handleApiError(error);
  }
}