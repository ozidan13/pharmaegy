import { NextRequest, NextResponse } from 'next/server';
import { authenticateRoute } from '@/lib/authUtils';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Use the existing authentication utility
    const { user, response } = await authenticateRoute(request);
    
    if (response) {
      return response; // Return error response if authentication failed
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Fetch complete user data with profiles
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Include profile data based on role
        pharmacistProfile: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
            bio: true,
            experience: true,
            education: true,
            city: true,
            area: true,
          }
        },
        pharmacyOwnerProfile: {
          select: {
            contactPerson: true,
            phoneNumber: true,
            pharmacyName: true,
            address: true,
            city: true,
            area: true,
          }
        }
      }
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}