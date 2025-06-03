import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

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

    // Get platform statistics
    const [userStats, subscriptionStats, paymentStats, productStats] = await Promise.all([
      // User statistics
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true
        }
      }),
      
      // Subscription statistics
      Promise.all([
        prisma.pharmacistProfile.groupBy({
          by: ['subscriptionPlan', 'subscriptionStatus'],
          _count: {
            id: true
          }
        }),
        prisma.pharmacyOwnerProfile.groupBy({
          by: ['subscriptionPlan', 'subscriptionStatus'],
          _count: {
            id: true
          }
        })
      ]),
      
      // Payment request statistics
      prisma.paymentRequest.groupBy({
        by: ['status'],
        _count: {
          id: true
        },
        _sum: {
          amount: true
        }
      }),
      
      // Product statistics
      prisma.product.aggregate({
        _count: {
          id: true
        },
        _sum: {
          stock: true
        }
      })
    ]);

    // Get recent payment requests
    const recentPayments = await prisma.paymentRequest.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });

    // Get users with expiring subscriptions (next 7 days)
    const expiringSubscriptions = await Promise.all([
      prisma.pharmacistProfile.findMany({
        where: {
          subscriptionExpiresAt: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      }),
      prisma.pharmacyOwnerProfile.findMany({
        where: {
          subscriptionExpiresAt: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      })
    ]);

    return NextResponse.json({
      userStats,
      subscriptionStats: {
        pharmacists: subscriptionStats[0],
        pharmacyOwners: subscriptionStats[1]
      },
      paymentStats,
      productStats,
      recentPayments,
      expiringSubscriptions: {
        pharmacists: expiringSubscriptions[0],
        pharmacyOwners: expiringSubscriptions[1]
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}