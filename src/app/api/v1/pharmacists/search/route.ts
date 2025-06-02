import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError } from '@/lib/errors';
import { query, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner';
import { Prisma } from '@prisma/client';

// Validation rules for search parameters
const validateSearchParams = [
  query('city').notEmpty().withMessage('City is required').isString().trim().isLength({ min: 2, max: 100 }).withMessage('City must be between 2 and 100 characters'),
  query('area').optional().isString().trim().isLength({ max: 100 }).withMessage('Area must be less than 100 characters'),
  query('available').optional().isIn(['true', 'false']).withMessage('Available must be true or false').toBoolean(),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100').toInt(),
];

export async function GET(req: NextRequest) {
  try {
    // Run validation middleware
    // For query parameters in NextRequest, we need to adapt how runMiddleware gets them.
    // express-validator expects them on req.query. NextRequest has them on req.nextUrl.searchParams.
    // A simple way is to convert searchParams to an object for the validator.
    const queryParams: { [key: string]: any } = {};
    req.nextUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // Run validation middleware
    // Clone the request to allow body consumption by both middleware and handler
    const reqClone = req.clone();
    // For query parameters, express-validator can work with req.query.
    // We'll construct it from searchParams for the cloned request.
    const queryForValidation: { [key: string]: any } = {};
    req.nextUrl.searchParams.forEach((value, key) => {
        queryForValidation[key] = value;
    });
    (reqClone as any).query = queryForValidation; // Attach query for validator

    await runMiddleware(reqClone, NextResponse.next(), validateSearchParams);
    const errors = validationResult(reqClone as any); 
    if (!errors.isEmpty()) {
      throw ApiError.badRequest('Validation failed', errors.array());
    }

    const city = req.nextUrl.searchParams.get('city') as string;
    const area = req.nextUrl.searchParams.get('area') || undefined;
    const availableParam = req.nextUrl.searchParams.get('available');
    const available = availableParam ? availableParam === 'true' : undefined;
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const whereClause: Prisma.PharmacistProfileWhereInput = {
      city: { equals: city, mode: 'insensitive' },
      user: { 
        // isActive: true, // This causes type errors as isActive is not directly filterable here
        role: 'PHARMACIST' // Attempting to filter by role
      }
    };

    if (area) {
      whereClause.area = { equals: area, mode: 'insensitive' };
    }
    if (available !== undefined) {
      whereClause.available = available;
    }

    const pharmacists = await prisma.pharmacistProfile.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        experience: true,
        education: true,
        city: true,
        area: true,
        available: true,
        user: { select: { email: true } }, // Include email for contact or display
        updatedAt: true, // To show how recent the profile is
      },
      skip,
      take: limit,
      orderBy: {
        updatedAt: 'desc', // Show recently updated profiles first
      },
    });

    const totalPharmacists = await prisma.pharmacistProfile.count({ where: whereClause });

    return NextResponse.json({
      success: true,
      data: pharmacists,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPharmacists / limit),
        totalResults: totalPharmacists,
        limit,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}