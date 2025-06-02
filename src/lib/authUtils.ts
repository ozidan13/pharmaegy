import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

// Function to verify JWT token and return user data or an error response
export async function authenticateRoute(req: NextRequest): Promise<{ user?: AuthenticatedUser; response?: NextResponse }> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { response: NextResponse.json({ message: 'Authentication required. No token provided.' }, { status: 401 }) };
    }

    const token = authHeader.split(' ')[1];
    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables.');
        return { response: NextResponse.json({ message: 'Server configuration error.' }, { status: 500 }) };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return { response: NextResponse.json({ message: 'User not found' }, { status: 401 }) };
    }
    
    // Ensure the role from the token matches the role in the database for consistency
    if (user.role !== decoded.role) {
        return { response: NextResponse.json({ message: 'User role mismatch.' }, { status: 403 }) };
    }

    return { user: { id: user.id, email: user.email, role: user.role } };
  } catch (error) {
    console.error('Authentication error:', error);
    return { response: NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 }) };
  }
}

// Helper to check if user has a specific role
export function hasRole(user: AuthenticatedUser | undefined, role: UserRole): boolean {
  return user?.role === role;
}

// Example usage in an API route:
/*
export async function GET(req: NextRequest) {
  const authResult = await authenticateRoute(req);
  if (authResult.response) {
    return authResult.response; // Not authenticated or error
  }
  const { user } = authResult; // User is authenticated

  if (!hasRole(user, UserRole.PHARMACIST)) {
    return NextResponse.json({ message: 'Access denied. Pharmacist role required.' }, { status: 403 });
  }

  // Proceed with pharmacist-specific logic
  return NextResponse.json({ message: 'Hello Pharmacist!', userId: user?.id });
}
*/