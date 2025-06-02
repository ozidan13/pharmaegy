import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError } from '@/lib/errors';
import { query, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner';

// Validation for product search parameters
const validateSearchParams = [
  query('q').optional().isString().withMessage('Search query must be a string'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('nearExpiry').optional().isIn(['true', 'false']).withMessage('Near expiry must be true or false'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be a positive number')
    .custom((value, { req }) => {
      const minPrice = req.query?.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = parseFloat(value);
      if (minPrice !== undefined && maxPrice < minPrice) {
        throw new Error('Maximum price must be greater than or equal to minimum price');
      }
      return true;
    }),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100').toInt(),
  query('city').optional().isString().withMessage('City must be a string'),
  query('area').optional().isString().withMessage('Area must be a string'),
];

export async function GET(req: NextRequest) {
  try {
    // express-validator needs the original query object from NextRequest's URL
    // We'll reconstruct a simplified req object for it.
    const pseudoReq = {
        query: Object.fromEntries(req.nextUrl.searchParams.entries()),
    };

    await runMiddleware(pseudoReq, NextResponse.next(), validateSearchParams);
    const errors = validationResult(pseudoReq as any);
    if (!errors.isEmpty()) {
      throw ApiError.badRequest('Validation failed', errors.array());
    }

    const { searchParams } = req.nextUrl;
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const nearExpiry = searchParams.get('nearExpiry');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const city = searchParams.get('city');
    const area = searchParams.get('area');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (nearExpiry) {
      where.isNearExpiry = nearExpiry === 'true';
    }
    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }
    
    // Filter by pharmacy location (city/area)
    if (city || area) {
        where.pharmacyOwner = {
            is: { // Changed from 'some' to 'is' as pharmacyOwner is a direct relation
                ...(city && { city: { equals: city, mode: 'insensitive' } }),
                ...(area && { area: { equals: area, mode: 'insensitive' } }),
            }
        };
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
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

    const totalProducts = await prisma.product.count({ where });

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