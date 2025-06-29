import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner';
import { handleApiError } from '@/lib/errors';

const JWT_SECRET = process.env.JWT_SECRET as string;

const generateToken = (id: string, email: string, role: UserRole): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d'; // 30 days for persistent login
  return jwt.sign(
    { id, email, role },
    JWT_SECRET as jwt.Secret,
    { expiresIn } as jwt.SignOptions
  );
};

const validateRegisterPharmacyOwner = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('pharmacyName')
    .notEmpty()
    .withMessage('Pharmacy name is required'),
  body('contactPerson')
    .notEmpty()
    .withMessage('Contact person name is required'),
  body('phoneNumber')
    .optional()
    .isMobilePhone('any') // Consider 'ar-EG'
    .withMessage('Please provide a valid phone number'),
  body('address').optional().isString().withMessage('Address must be a string'),
  body('city')
    .notEmpty()
    .withMessage('City is required')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  body('area')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Area must be less than 100 characters'),
];

export async function POST(req: NextRequest) {
  try {
    // Run validation middleware
    // Clone the request to allow body consumption by both middleware and handler
    const bodyForValidation = await req.json();

    // Create a mock request object for express-validator
    const mockReq = {
      ...req,
      body: bodyForValidation,
      headers: req.headers,
      method: req.method,
      url: req.url,
    };

    await runMiddleware(mockReq, NextResponse.next(), validateRegisterPharmacyOwner);
    const errors = validationResult(mockReq as any);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const {
      email,
      password,
      pharmacyName,
      contactPerson,
      phoneNumber,
      address,
      city,
      area
      // latitude and longitude are not in the validator
    } = bodyForValidation;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await prisma.$transaction(async (prismaTx) => {
      const user = await prismaTx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: UserRole.PHARMACY_OWNER,
        },
      });

      const pharmacyOwnerProfile = await prismaTx.pharmacyOwnerProfile.create({
        data: {
          userId: user.id,
          pharmacyName,
          contactPerson,
          phoneNumber,
          address,
          city,
          area: area || null,
          // Default subscription settings
          subscriptionPlan: 'FREE',
          subscriptionStatus: 'ACTIVE',
          subscriptionExpiresAt: null,
        },
      });

      return { user, pharmacyOwnerProfile };
    });

    const token = generateToken(result.user.id, result.user.email, result.user.role);

    return NextResponse.json({
      message: 'Pharmacy owner registered successfully',
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        profile: {
          pharmacyName: result.pharmacyOwnerProfile.pharmacyName,
          contactPerson: result.pharmacyOwnerProfile.contactPerson,
        },
      },
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error);
  }
}