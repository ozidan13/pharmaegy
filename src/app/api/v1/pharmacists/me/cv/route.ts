import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute, hasRole } from '@/lib/authUtils';
import { ApiError, handleApiError } from '@/lib/errors';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRoute(req);
  if (authResult.response || !authResult.user) {
    return authResult.response;
  }
  if (!hasRole(authResult.user, UserRole.PHARMACIST)) {
    return NextResponse.json({ message: 'Access denied. Pharmacist role required.' }, { status: 403 });
  }
    const userId = authResult.user.id;

    const pharmacistProfile = await prisma.pharmacistProfile.findUnique({
      where: { userId },
      select: { cvUrl: true, updatedAt: true },
    });

    if (!pharmacistProfile) {
      throw ApiError.notFound('Pharmacist profile not found.');
    }

    if (!pharmacistProfile.cvUrl) {
      throw ApiError.notFound('CV URL not found for this pharmacist.');
    }

    return NextResponse.json({
      success: true,
      data: {
        url: pharmacistProfile.cvUrl, // Provide the direct URL
        uploadedAt: pharmacistProfile.updatedAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRoute(req);
  if (authResult.response || !authResult.user) {
    return authResult.response;
  }
  if (!hasRole(authResult.user, UserRole.PHARMACIST)) {
    return NextResponse.json({ message: 'Access denied. Pharmacist role required.' }, { status: 403 });
  }
    const userId = authResult.user.id;

    const body = await req.json();

    const schema = z.object({
      cvUrl: z.string().url({ message: "Invalid URL format for CV link." }),
    });

    const validation = schema.safeParse(body);

    if (!validation.success) {
      throw ApiError.badRequest('Validation failed', validation.error.errors);
    }

    const { cvUrl } = validation.data;

    // No need to delete old CV file as we are storing a URL now.
    // The old file deletion logic is removed.

    await prisma.pharmacistProfile.update({
      where: { userId },
      data: { cvUrl: cvUrl, updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: 'CV link updated successfully.',
      data: { url: cvUrl },
    });
  } catch (error) {
    return handleApiError(error);
  }
}