import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client'; // Ensure UserRole is imported if used in generateToken
import { body, validationResult } from 'express-validator';
import { runMiddleware } from '@/lib/middlewareRunner';
import { ApiError, handleApiError } from '@/lib/errors';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Helper function to generate JWT token (can be moved to a shared utils file)
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

// Validation rules for login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const mockReq = { body: reqBody, headers: req.headers, method: req.method, url: req.url } as any;
    const mockRes = { status: () => mockRes, json: () => mockRes } as any;

    for (const validation of validateLogin) {
      await runMiddleware(mockReq, mockRes, validation);
    }

    const errors = validationResult(mockReq);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const { email, password } = mockReq.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        pharmacistProfile: true,
        pharmacyOwnerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken(user.id, user.email, user.role);

    // Construct user profile based on role
    let userProfile = {};
    if (user.role === UserRole.PHARMACIST && user.pharmacistProfile) {
      userProfile = {
        firstName: user.pharmacistProfile.firstName,
        lastName: user.pharmacistProfile.lastName,
        // Add other relevant pharmacist profile fields
      };
    } else if (user.role === UserRole.PHARMACY_OWNER && user.pharmacyOwnerProfile) {
      userProfile = {
        pharmacyName: user.pharmacyOwnerProfile.pharmacyName,
        contactPerson: user.pharmacyOwnerProfile.contactPerson,
        // Add other relevant pharmacy owner profile fields
      };
    }

    const response = NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: userProfile,
      },
    }, { status: 200 });

    // Set token as httpOnly cookie for middleware authentication
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    return response;

  } catch (error) {
    return handleApiError(error);
  }
}