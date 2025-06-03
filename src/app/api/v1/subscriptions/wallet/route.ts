import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateRoute } from '@/lib/authUtils';
import { handleApiError } from '@/lib/errors';

const prisma = new PrismaClient();

// GET /api/v1/subscriptions/wallet - Get wallet information for payments
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRoute(request);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }

    // Get active wallet configuration
    const walletConfig = await prisma.walletConfig.findFirst({
      where: { isActive: true },
      select: {
        walletAddress: true,
        currency: true,
        description: true
      }
    });

    if (!walletConfig) {
      return NextResponse.json(
        { success: false, message: 'Payment system is currently unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: walletConfig
    });

  } catch (error) {
    return handleApiError(error);
  } finally {
    await prisma.$disconnect();
  }
}