import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute, hasRole } from '@/lib/authUtils';
import { ApiError, handleApiError } from '@/lib/errors';
import { UserRole } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRoute(req);
  if (authResult.response || !authResult.user) {
    return authResult.response;
  }
  if (!hasRole(authResult.user, UserRole.PHARMACY_OWNER)) {
    return NextResponse.json({ message: 'Access denied. Pharmacy owner role required.' }, { status: 403 });
  }
    const userId = authResult.user.id;

    const pharmacyOwner = await prisma.pharmacyOwnerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!pharmacyOwner) {
      throw ApiError.notFound('Pharmacy owner profile not found.');
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      where: {
        pharmacyOwnerId: pharmacyOwner.id,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalProducts = await prisma.product.count({
      where: {
        pharmacyOwnerId: pharmacyOwner.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        limit,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}