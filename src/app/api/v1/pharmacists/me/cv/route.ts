import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRoute, hasRole } from '@/lib/authUtils';
import { ApiError, handleApiError } from '@/lib/errors';
import { UserRole } from '@prisma/client';
import fs from 'fs/promises'; // Use promises API for fs
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'cvs'); // Store in public for direct access

// Ensure uploads directory exists
const ensureUploadsDirExists = async () => {
  try {
    await fs.access(UPLOADS_DIR);
  } catch (error) {
    // Directory does not exist, create it
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
};

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
      throw ApiError.notFound('CV not found for this pharmacist.');
    }
    
    // Construct a public URL for the CV
    const cvFileName = pharmacistProfile.cvUrl.split('/').pop();
    const publicCvUrl = `/uploads/cvs/${cvFileName}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicCvUrl, // Provide the public URL
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

    await ensureUploadsDirExists();

    const formData = await req.formData();
    const file = formData.get('cv') as File | null;

    if (!file) {
      throw ApiError.badRequest('No CV file provided.');
    }

    // Validate file type and size (basic validation)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      throw ApiError.badRequest('Invalid file type. Only PDF, DOC, and DOCX are allowed.');
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw ApiError.badRequest('File is too large. Maximum size is 5MB.');
    }

    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.name).toLowerCase();
    const filename = `cv-${userId}-${uniqueSuffix}${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Save the file
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    // Update pharmacist profile with new CV path (relative to public folder)
    const cvPublicUrl = `/uploads/cvs/${filename}`; // Path for accessing via web

    const oldProfile = await prisma.pharmacistProfile.findUnique({ 
        where: { userId }, 
        select: { cvUrl: true }
    });

    // If an old CV exists, delete it from the filesystem
    if (oldProfile?.cvUrl) {
        const oldCvFileName = oldProfile.cvUrl.split('/').pop();
        if (oldCvFileName) {
            const oldCvPath = path.join(UPLOADS_DIR, oldCvFileName);
            try {
                await fs.unlink(oldCvPath);
                console.log(`Old CV deleted: ${oldCvPath}`);
            } catch (unlinkError) {
                console.error(`Failed to delete old CV: ${oldCvPath}`, unlinkError);
                // Non-critical error, so we don't stop the process
            }
        }
    }

    await prisma.pharmacistProfile.update({
      where: { userId },
      data: { cvUrl: cvPublicUrl, updatedAt: new Date() }, // Store the public URL
    });

    return NextResponse.json({
      success: true,
      message: 'CV uploaded successfully.',
      data: { url: cvPublicUrl },
    });
  } catch (error) {
    return handleApiError(error);
  }
}