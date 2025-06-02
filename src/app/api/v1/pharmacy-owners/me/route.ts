import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute, hasRole } from '@/lib/authUtils';
import { ApiError, handleApiError } from '@/lib/errors';
import { UserRole } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner';

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

    const profile = await prisma.pharmacyOwnerProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        pharmacyName: true,
        contactPerson: true,
        phoneNumber: true,
        address: true,
        city: true,
        area: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
        createdAt: true,
        updatedAt: true,
        user: { // Include user's email
            select: {
                email: true
            }
        }
      },
    });

    if (!profile) {
      throw ApiError.notFound('Pharmacy owner profile not found');
    }
    
    const { user, ...profileData } = profile;
    const response = {
        ...profileData,
        email: user?.email
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return handleApiError(error);
  }
}

// Validation rules for updating pharmacy owner profile
const validateUpdateProfile = [
  body('pharmacyName').optional().notEmpty().withMessage('Pharmacy name cannot be empty'),
  body('contactPerson').optional().notEmpty().withMessage('Contact person name cannot be empty'),
  body('phoneNumber').optional().isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('address').optional().isString().withMessage('Address must be a string'),
  body('city').notEmpty().withMessage('City is required').isString().trim().isLength({ min: 2, max: 100 }).withMessage('City must be between 2 and 100 characters'),
  body('area').optional().isString().trim().isLength({ max: 100 }).withMessage('Area must be less than 100 characters'),
];

export async function PUT(req: NextRequest) {
  try {
    const authResult = await authenticateRoute(req);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }
    if (!hasRole(authResult.user, UserRole.PHARMACY_OWNER)) {
      return NextResponse.json({ message: 'Access denied. Pharmacy owner role required.' }, { status: 403 });
    }
    const userId = authResult.user.id;

    // Run validation middleware
    // Clone the request to allow body consumption by both middleware and handler
    const reqClone = req.clone();
    const bodyForValidation = await req.json(); // Consume the body once
    (reqClone as any).body = bodyForValidation; // Attach parsed body for validator
    // Make original req.json() return the already parsed body to avoid issues if handler calls it again
    (req as any).json = async () => bodyForValidation; 

    await runMiddleware(reqClone, NextResponse.next(), validateUpdateProfile);
    const errors = validationResult(reqClone as any); // Cast req to any for express-validator
    if (!errors.isEmpty()) {
      throw ApiError.badRequest('Validation failed', errors.array());
    }

    const bodyData = bodyForValidation;
    const {
      pharmacyName,
      contactPerson,
      phoneNumber,
      address,
      city,
      area,
    } = bodyData;

    const updateData: any = {};
    if (pharmacyName !== undefined) updateData.pharmacyName = pharmacyName;
    if (contactPerson !== undefined) updateData.contactPerson = contactPerson;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city; // city is required by validator but check here for partial updates
    if (area !== undefined) updateData.area = area;
    
    if (Object.keys(updateData).length === 0 && city === undefined) { // city is mandatory for update as per validator
        throw ApiError.badRequest('No fields provided for update, or missing mandatory fields like city.');
    }
    if (city) updateData.city = city; // Ensure city is included if other fields are present
    
    updateData.updatedAt = new Date();

    const updatedProfile = await prisma.pharmacyOwnerProfile.update({
      where: { userId },
      data: updateData,
       select: {
        id: true,
        pharmacyName: true,
        contactPerson: true,
        phoneNumber: true,
        address: true,
        city: true,
        area: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
        createdAt: true,
        updatedAt: true,
        user: { 
            select: {
                email: true
            }
        }
      }
    });
    
    const { user, ...profileData } = updatedProfile;
    const response = {
        ...profileData,
        email: user?.email
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: response,
    });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return handleApiError(ApiError.notFound('Pharmacy owner profile not found to update.'));
    }
    return handleApiError(error);
  }
}