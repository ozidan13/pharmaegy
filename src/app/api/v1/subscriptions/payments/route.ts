import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateRoute } from '@/lib/authUtils';
import { handleApiError } from '@/lib/errors';

const prisma = new PrismaClient();

// GET /api/v1/subscriptions/payments - Get user's payment requests
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRoute(request);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }

    const userId = authResult.user.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      prisma.paymentRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          subscriptionPlan: true,
          amount: true,
          currency: true,
          walletAddress: true,
          userWalletAddress: true,
          status: true,
          confirmedAt: true,
          rejectedReason: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.paymentRequest.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    return handleApiError(error);
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/v1/subscriptions/payments - Update payment request with transaction details
export async function PUT(request: NextRequest) {
  try {
    const authResult = await authenticateRoute(request);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }

    const userId = authResult.user.id;
    const { paymentId, userWalletAddress, transactionHash } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { success: false, message: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Find the payment request
    const paymentRequest = await prisma.paymentRequest.findFirst({
      where: {
        id: paymentId,
        userId,
        status: 'PENDING'
      }
    });

    if (!paymentRequest) {
      return NextResponse.json(
        { success: false, message: 'Payment request not found or not pending' },
        { status: 404 }
      );
    }

    // Update payment request with transaction details
    const updatedPayment = await prisma.paymentRequest.update({
      where: { id: paymentId },
      data: {
        userWalletAddress: userWalletAddress || paymentRequest.userWalletAddress,
        transactionHash: transactionHash || paymentRequest.transactionHash
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment details updated successfully',
      data: updatedPayment
    });

  } catch (error) {
    return handleApiError(error);
  } finally {
    await prisma.$disconnect();
  }
}