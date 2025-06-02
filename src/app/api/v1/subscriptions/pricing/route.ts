import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';

// GET /api/v1/subscriptions/pricing - Get all subscription pricing plans
export async function GET(req: NextRequest) {
  try {
    const pricingPlans = await prisma.subscriptionPricing.findMany({
      orderBy: {
        price: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: pricingPlans
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/v1/subscriptions/pricing - Update subscription pricing (Admin only)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, price, features } = body;

    if (!plan || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Plan and price are required' },
        { status: 400 }
      );
    }

    const updatedPricing = await prisma.subscriptionPricing.update({
      where: { plan },
      data: {
        price: parseFloat(price),
        features: features || undefined
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription pricing updated successfully',
      data: updatedPricing
    });
  } catch (error) {
    return handleApiError(error);
  }
}