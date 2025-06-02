import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute, hasRole } from '@/lib/authUtils';
import { ApiError, handleApiError } from '@/lib/errors';
import { body, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner';
import { UserRole } from '@prisma/client';

// Validation for creating a product
const validateCreateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').notEmpty().withMessage('Stock is required').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('isNearExpiry').optional().isBoolean().withMessage('isNearExpiry must be a boolean value'),
  body('expiryDate').optional().isISO8601().withMessage('Expiry date must be a valid date')
    .custom((value, { req }) => {
      // In Next.js, req.body is already parsed, so access it directly
      const body = (req as any).body || {}; 
      if (body.isNearExpiry === true && !value) {
        throw new Error('Expiry date is required for near-expiry products');
      }
      return true;
    }),
  body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
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

    // Get pharmacy owner profile with subscription status
    const pharmacyOwner = await prisma.pharmacyOwnerProfile.findUnique({
      where: { userId },
      select: { 
        id: true, 
        subscriptionStatus: true,
        subscriptionExpiresAt: true
      }
    });

    if (!pharmacyOwner) {
      throw ApiError.notFound('Pharmacy owner profile not found. Please complete your profile.');
    }

    // Check if subscription is active
    const isSubscriptionActive = pharmacyOwner.subscriptionStatus === 'basic' || pharmacyOwner.subscriptionStatus === 'premium';
    // const isSubscriptionActive = pharmacyOwner.subscriptionStatus === 'ACTIVE' && 
    //   (!pharmacyOwner.subscriptionExpiresAt || new Date(pharmacyOwner.subscriptionExpiresAt) > new Date());

    if (!isSubscriptionActive) {
      // Correctly return a NextResponse for payment required error
      const paymentError = ApiError.paymentRequired('An active subscription is required to add products.');
      return NextResponse.json({ message: paymentError.message, errors: paymentError.errors }, { status: paymentError.statusCode });
    }
    
    // Clone the request to allow body consumption by both middleware and handler
    const reqClone = req.clone();
    const bodyData = await req.json();
    (reqClone as any).body = bodyData; // Attach parsed body for validator

    // Run validation middleware
    await runMiddleware(reqClone, NextResponse.next(), validateCreateProduct);
    const errors = validationResult(reqClone as any);
    if (!errors.isEmpty()) {
      throw ApiError.badRequest('Validation failed', errors.array());
    }

    const {
      name,
      description,
      price,
      category,
      isNearExpiry,
      expiryDate,
      imageUrl,
      stock
    } = bodyData;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        isNearExpiry: isNearExpiry === true,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        imageUrl,
        stock: parseInt(stock, 10),
        pharmacyOwnerId: pharmacyOwner.id,
      },
    });

    return NextResponse.json({ 
        success: true, 
        message: 'Product created successfully', 
        data: product 
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: { // Include pharmacy owner details for context
        pharmacyOwner: {
          select: {
            pharmacyName: true,
            city: true,
            area: true,
          }
        }
      }
    });

    const totalProducts = await prisma.product.count();

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