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
    if (!hasRole(authResult.user, UserRole.PHARMACIST)) {
      return NextResponse.json({ message: 'Access denied. Pharmacist role required.' }, { status: 403 });
    }
    const user = authResult.user; // Extract user for convenience

    const pharmacistProfile = await prisma.pharmacistProfile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        cvUrl: true,
        bio: true,
        experience: true,
        education: true,
        city: true,
        area: true,
        available: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!pharmacistProfile) {
      throw ApiError.notFound('Pharmacist profile not found');
    }

    const { user: profileUser, cvUrl, ...profileData } = pharmacistProfile;
    const response = {
      ...profileData,
      email: profileUser?.email,
      cv: cvUrl ? {
        url: cvUrl.startsWith('http') ? cvUrl : `/uploads/cvs/${cvUrl.split('/').pop()}`,
        uploadedAt: pharmacistProfile.updatedAt
      } : null
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return handleApiError(error);
  }
}

// Validation rules for updating pharmacist profile
const validateUpdateProfile = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('phoneNumber').optional().isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  body('experience').optional().isString().withMessage('Experience must be a string'),
  body('education').optional().isString().withMessage('Education must be a string'),
  body('city').optional().isString().trim().isLength({ min: 2, max: 100 }).withMessage('City must be between 2 and 100 characters'),
  body('area').optional().isString().trim().isLength({ max: 100 }).withMessage('Area must be less than 100 characters'),
  body('available').optional().isBoolean().withMessage('Available must be a boolean value'),
];

export async function PUT(req: NextRequest) {
  try {
    const authResult = await authenticateRoute(req);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }
    if (!hasRole(authResult.user, UserRole.PHARMACIST)) {
      return NextResponse.json({ message: 'Access denied. Pharmacist role required.' }, { status: 403 });
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
    const errors = validationResult(reqClone as any); // Cast req to any to satisfy express-validator
    if (!errors.isEmpty()) {
      throw ApiError.badRequest('Validation failed', errors.array());
    }

    const bodyData = bodyForValidation;
    const {
      firstName,
      lastName,
      phoneNumber,
      bio,
      experience,
      education,
      city,
      area,
      available
    } = bodyData;

    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (bio !== undefined) updateData.bio = bio;
    if (experience !== undefined) updateData.experience = experience;
    if (education !== undefined) updateData.education = education;
    if (city !== undefined) updateData.city = city;
    if (area !== undefined) updateData.area = area;
    if (available !== undefined) updateData.available = available;
    
    if (Object.keys(updateData).length === 0) {
        throw ApiError.badRequest('No fields provided for update.');
    }
    updateData.updatedAt = new Date();

    const updatedProfile = await prisma.pharmacistProfile.update({
      where: { userId },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    const { user: profileUser, ...profileData } = updatedProfile;
    const response = {
      ...profileData,
      email: profileUser?.email,
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: response,
    });
  } catch (error) {
    // Handle Prisma's P2025 error (Record to update not found)
    if ((error as any).code === 'P2025') {
      return handleApiError(ApiError.notFound('Pharmacist profile not found to update.'));
    }
    return handleApiError(error);
  }
}