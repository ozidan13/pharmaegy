import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute, hasRole } from '@/lib/authUtils';
import { UserRole } from '@prisma/client';
import { ApiError, handleApiError } from '@/lib/errors';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: pharmacistProfileId } = params; // This is the PharmacistProfile ID

    const authResult = await authenticateRoute(req);
    if (authResult.response || !authResult.user) {
      return authResult.response;
    }
    // Role check after ensuring user is authenticated
    if (!hasRole(authResult.user, UserRole.PHARMACY_OWNER)) {
      return NextResponse.json({ message: 'Access denied. Pharmacy owner role required.' }, { status: 403 });
    }
    const pharmacyOwnerUserId = authResult.user.id;

    // Verify the pharmacy owner has an active subscription (simplified check)
    const pharmacyOwnerProfile = await prisma.pharmacyOwnerProfile.findUnique({
        where: { userId: pharmacyOwnerUserId },
        select: { subscriptionStatus: true, subscriptionExpiresAt: true }
    });

    if (!pharmacyOwnerProfile) {
        throw ApiError.forbidden('Pharmacy owner profile not found.');
    }

    const hasValidSubscription =
      pharmacyOwnerProfile.subscriptionStatus && pharmacyOwnerProfile.subscriptionStatus !== 'none' &&
      (!pharmacyOwnerProfile.subscriptionExpiresAt || new Date(pharmacyOwnerProfile.subscriptionExpiresAt) > new Date());

    if (!hasValidSubscription) {
      throw ApiError.forbidden('Access denied. A valid subscription is required to view pharmacist details.');
    }

    const pharmacistProfile = await prisma.pharmacistProfile.findUnique({
      where: { id: pharmacistProfileId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true, // Consider privacy implications for direct phone number access
        cvUrl: true,
        bio: true,
        experience: true,
        education: true,
        city: true,
        area: true,
        available: true,
        user: {
          select: {
            email: true, // Provide email for contact
          },
        },
        updatedAt: true,
      },
    });

    if (!pharmacistProfile) {
      throw ApiError.notFound('Pharmacist profile not found.');
    }
    
    // Ensure the pharmacist user account is active
    const pharmacistUser = await prisma.user.findFirst({
        where: { pharmacistProfile: { id: pharmacistProfileId } },
        select: { isActive: true }
    });

    if (!pharmacistUser) { // Check if user exists first
        throw ApiError.notFound('Pharmacist user record not found.');
    }
    // Then check isActive status. If isActive is not explicitly false, it's considered active or status is unknown (treat as active for now or add specific handling)
    if (pharmacistUser.isActive === false) { 
        throw ApiError.forbidden('Pharmacist account is not active.'); // Changed to 403 as profile exists but user is inactive
    }

    const { user: profileUser, cvUrl, ...profileData } = pharmacistProfile;
    const cvFileName = cvUrl ? cvUrl.split('/').pop() : null;
    const publicCvUrl = cvFileName ? `/uploads/cvs/${cvFileName}` : null;

    const response = {
      ...profileData,
      email: profileUser?.email,
      cv: publicCvUrl ? {
        url: publicCvUrl,
        uploadedAt: pharmacistProfile.updatedAt
      } : null
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return handleApiError(error);
  }
}