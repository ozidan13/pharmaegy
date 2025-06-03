import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// GET - List all users with filtering
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
    const role = searchParams.get('role');
    const subscriptionPlan = searchParams.get('subscriptionPlan');
    const subscriptionStatus = searchParams.get('subscriptionStatus');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (role && role !== 'all') {
      where.role = role;
    }

    // Add search functionality
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        {
          pharmacistProfile: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } }
            ]
          }
        },
        {
          pharmacyOwnerProfile: {
            OR: [
              { pharmacyName: { contains: search, mode: 'insensitive' } },
              { contactPerson: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      ];
    }

    // Add subscription filters
    if (subscriptionPlan || subscriptionStatus) {
      const subscriptionWhere: any = {};
      if (subscriptionPlan) subscriptionWhere.subscriptionPlan = subscriptionPlan;
      if (subscriptionStatus) subscriptionWhere.subscriptionStatus = subscriptionStatus;

      where.OR = [
        { pharmacistProfile: subscriptionWhere },
        { pharmacyOwnerProfile: subscriptionWhere }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          pharmacistProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              city: true,
              area: true,
              available: true,
              subscriptionPlan: true,
              subscriptionStatus: true,
              subscriptionExpiresAt: true
            }
          },
          pharmacyOwnerProfile: {
            select: {
              id: true,
              pharmacyName: true,
              contactPerson: true,
              phoneNumber: true,
              address: true,
              city: true,
              area: true,
              subscriptionPlan: true,
              subscriptionStatus: true,
              subscriptionExpiresAt: true,
              _count: {
                select: {
                  products: true
                }
              }
            }
          },
          adminProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update user subscription or status
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

    const { userId, action, subscriptionPlan, subscriptionStatus, available } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pharmacistProfile: true,
        pharmacyOwnerProfile: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot modify admin users' },
        { status: 403 }
      );
    }

    let result;

    switch (action) {
      case 'updateSubscription':
        if (!subscriptionPlan || !subscriptionStatus) {
          return NextResponse.json(
            { error: 'Subscription plan and status are required' },
            { status: 400 }
          );
        }

        const expiresAt = subscriptionPlan === 'FREE' ? null : 
          subscriptionStatus === 'ACTIVE' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

        if (user.role === 'PHARMACIST') {
          result = await prisma.pharmacistProfile.update({
            where: { userId },
            data: {
              subscriptionPlan,
              subscriptionStatus,
              subscriptionExpiresAt: expiresAt
            }
          });
        } else {
          result = await prisma.pharmacyOwnerProfile.update({
            where: { userId },
            data: {
              subscriptionPlan,
              subscriptionStatus,
              subscriptionExpiresAt: expiresAt
            }
          });
        }
        break;

      case 'updateAvailability':
        if (user.role !== 'PHARMACIST') {
          return NextResponse.json(
            { error: 'Availability can only be updated for pharmacists' },
            { status: 400 }
          );
        }

        if (typeof available !== 'boolean') {
          return NextResponse.json(
            { error: 'Available status must be boolean' },
            { status: 400 }
          );
        }

        result = await prisma.pharmacistProfile.update({
          where: { userId },
          data: { available }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: 'User updated successfully',
      result
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}