import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute, hasRole } from '@/lib/authUtils';
import { ApiError, handleApiError } from '@/lib/errors';
import { UserRole } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner';

// Validation for updating a product
const validateUpdateProduct = [
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('isNearExpiry').optional().isBoolean().withMessage('isNearExpiry must be a boolean value'),
  body('expiryDate').optional().isISO8601().withMessage('Expiry date must be a valid date')
    .custom((value, { req }) => {
      const body = (req as any).body || {};
      if (body.isNearExpiry === true && !value) {
        throw new Error('Expiry date is required for near-expiry products');
      }
      return true;
    }),
  body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
];

interface RouteContext {
  params: { id: string };
}

// Get product by ID (Public)
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        pharmacyOwner: {
          select: {
            pharmacyName: true,
            city: true,
            area: true,
          }
        }
      }
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleApiError(error);
  }
}

// Update a product (Pharmacy Owner only)
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: productId } = params;
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

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (product.pharmacyOwnerId !== pharmacyOwner.id) {
      throw ApiError.forbidden('You are not authorized to update this product.');
    }
    
    const reqClone = req.clone();
    const bodyData = await req.json();
    (reqClone as any).body = bodyData; 

    await runMiddleware(reqClone, NextResponse.next(), validateUpdateProduct);
    const errors = validationResult(reqClone as any);
    if (!errors.isEmpty()) {
      throw ApiError.badRequest('Validation failed', errors.array());
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...bodyData,
        price: bodyData.price ? parseFloat(bodyData.price) : undefined,
        stock: bodyData.stock ? parseInt(bodyData.stock, 10) : undefined,
        expiryDate: bodyData.expiryDate ? new Date(bodyData.expiryDate) : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ 
        success: true, 
        message: 'Product updated successfully', 
        data: updatedProduct 
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete a product (Pharmacy Owner only)
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: productId } = params;
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

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (product.pharmacyOwnerId !== pharmacyOwner.id) {
      throw ApiError.forbidden('You are not authorized to delete this product.');
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ 
        success: true, 
        message: 'Product deleted successfully' 
    });
  } catch (error) {
    if ((error as any).code === 'P2025') { // Prisma error for record not found
        return handleApiError(ApiError.notFound('Product not found or already deleted.'));
    }
    return handleApiError(error);
  }
}