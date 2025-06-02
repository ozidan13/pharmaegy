import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma'; // Adjusted import path
import { UserRole } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner'; // Helper to run express-validator middleware
import { handleApiError } from '@/lib/errors';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Helper function to generate JWT token
const generateToken = (id: string, email: string, role: UserRole): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign(
    { id, email, role },
    JWT_SECRET as jwt.Secret,
    { expiresIn } as jwt.SignOptions
  );
};

// Validation rules (copied from auth.validator.ts and adapted)
const validateRegisterPharmacist = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required'),
  body('phoneNumber')
    .optional()
    .isMobilePhone('any') // Consider specifying a region like 'ar-EG'
    .withMessage('Please provide a valid phone number'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  body('experience').optional().isString().withMessage('Experience must be a string'),
  body('education').optional().isString().withMessage('Education must be a string'),
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
    // For Next.js API routes, express-validator needs a bit of adaptation.
    // We'll assume a helper `runMiddleware` that can execute express-validator chains.
    // This is a common pattern, or one might opt for a Next.js specific validation library like Zod or Joi.
    // Run validation middleware
    // Clone the request to allow body consumption by both middleware and handler
    // const reqClone = req.clone(); // Cloning might not be necessary if we construct a new object for validation
    const bodyForValidation = await req.json(); // Consume the body once

    // Create a mock request object that express-validator can work with
    const mockReq = {
      body: bodyForValidation,
      // Copy other necessary properties from the original NextRequest if your validators need them
      // For example, if validators check headers, params, or query:
      // headers: req.headers,
      // params: {}, // Populate if you have route params and validators use req.params
      // query: Object.fromEntries(req.nextUrl.searchParams), // Populate if validators use req.query
    };

    // Pass the mockReq to runMiddleware and validationResult
    // Ensure runMiddleware is adapted to handle this mockReq structure if it expects a full NextRequest/Express Request
    await runMiddleware(mockReq as any, NextResponse.next(), validateRegisterPharmacist);
    const errors = validationResult(mockReq as any);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      bio,
      experience,
      education,
      city,
      area
      // latitude and longitude are not in the validator, ensure they are handled if needed
    } = bodyForValidation; // Use the parsed body

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
          role: UserRole.PHARMACIST,
        },
      });

      const pharmacistProfile = await prismaTx.pharmacistProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          phoneNumber,
          bio,
          experience,
          education,
          city,
          area: area || null,
          // Default subscription settings
          subscriptionPlan: 'FREE',
          subscriptionStatus: 'ACTIVE',
          subscriptionExpiresAt: null,
        },
      });

      return { user, pharmacistProfile };
    });

    const token = generateToken(result.user.id, result.user.email, result.user.role);

    return NextResponse.json({
      message: 'Pharmacist registered successfully',
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        profile: {
          firstName: result.pharmacistProfile.firstName,
          lastName: result.pharmacistProfile.lastName,
        },
      },
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error);
  }
}