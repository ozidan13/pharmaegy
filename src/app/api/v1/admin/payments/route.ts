import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// GET - List all payment requests
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where = status ? { status: status as any } : {};

    const [payments, total] = await Promise.all([
      prisma.paymentRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              pharmacistProfile: {
                select: {
                  firstName: true,
                  lastName: true
                }
              },
              pharmacyOwnerProfile: {
                select: {
                  pharmacyName: true,
                  contactPerson: true
                }
              }
            }
          }
        }
      }),
      prisma.paymentRequest.count({ where })
    ]);

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Confirm or reject payment
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { paymentId, action, rejectedReason } = await request.json();

    if (!paymentId || !action || !['confirm', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Payment ID and valid action (confirm/reject) are required' },
        { status: 400 }
      );
    }

    if (action === 'reject' && !rejectedReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    // Get payment request
    const paymentRequest = await prisma.paymentRequest.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          include: {
            pharmacistProfile: true,
            pharmacyOwnerProfile: true
          }
        }
      }
    });

    if (!paymentRequest) {
      return NextResponse.json(
        { error: 'Payment request not found' },
        { status: 404 }
      );
    }

    if (paymentRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Payment request is not pending' },
        { status: 400 }
      );
    }

    if (action === 'confirm') {
      // Update payment request and user subscription
      const result = await prisma.$transaction(async (tx) => {
        // Update payment request
        const updatedPayment = await tx.paymentRequest.update({
          where: { id: paymentId },
          data: {
            status: 'CONFIRMED',
            confirmedBy: decoded.userId,
            confirmedAt: new Date()
          }
        });

        // Calculate subscription expiry (30 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        // Update user subscription based on role
        if (paymentRequest.user.role === 'PHARMACIST') {
          await tx.pharmacistProfile.update({
            where: { userId: paymentRequest.userId },
            data: {
              subscriptionPlan: paymentRequest.subscriptionPlan,
              subscriptionStatus: 'ACTIVE',
              subscriptionExpiresAt: expiresAt
            }
          });
        } else if (paymentRequest.user.role === 'PHARMACY_OWNER') {
          await tx.pharmacyOwnerProfile.update({
            where: { userId: paymentRequest.userId },
            data: {
              subscriptionPlan: paymentRequest.subscriptionPlan,
              subscriptionStatus: 'ACTIVE',
              subscriptionExpiresAt: expiresAt
            }
          });
        }

        return updatedPayment;
      });

      return NextResponse.json({
        message: 'Payment confirmed and subscription updated',
        payment: result
      });
    } else {
      // Reject payment
      const updatedPayment = await prisma.paymentRequest.update({
        where: { id: paymentId },
        data: {
          status: 'REJECTED',
          rejectedReason,
          confirmedBy: decoded.userId,
          confirmedAt: new Date()
        }
      });

      return NextResponse.json({
        message: 'Payment rejected',
        payment: updatedPayment
      });
    }

  } catch (error) {
    console.error('Update payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}