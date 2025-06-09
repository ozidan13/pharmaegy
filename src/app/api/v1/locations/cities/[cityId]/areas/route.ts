import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';

/**
 * GET /api/v1/locations/cities/[cityId]/areas
 * Retrieves areas for a specific city
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { cityId: string } }
) {
  try {
    const { cityId } = params;

    if (!cityId) {
      return NextResponse.json({
        success: false,
        error: 'City ID is required'
      }, { status: 400 });
    }

    const city = await prisma.city.findUnique({
      where: { id: cityId },
      include: {
        areas: {
          select: {
            id: true,
            name: true
          },
          orderBy: {
            name: 'asc'
          }
        }
      }
    });

    if (!city) {
      return NextResponse.json({
        success: false,
        error: 'City not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        city: {
          id: city.id,
          name: city.name,
          nameAr: city.nameAr
        },
        areas: city.areas.map(area => ({
          id: area.id,
          name: area.name
        })),
        totalAreas: city.areas.length
      },
      message: `Areas for ${city.name} retrieved successfully`
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching city areas:', error);
    return handleApiError(error, 'Failed to fetch city areas');
  }
}