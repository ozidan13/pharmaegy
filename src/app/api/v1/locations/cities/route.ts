import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';

/**
 * GET /api/v1/locations/cities
 * Retrieves all Egyptian cities with their corresponding areas
 * This endpoint is designed for frontend dropdown menus
 */
export async function GET(request: NextRequest) {
  try {
    // Get all cities with their areas
    const cities = await prisma.city.findMany({
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
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transform the data for frontend consumption
    const formattedCities = cities.map(city => ({
      id: city.id,
      name: city.name,
      nameAr: city.nameAr,
      areas: city.areas.map(area => ({
        id: area.id,
        name: area.name
      }))
    }));

    return NextResponse.json({
      success: true,
      data: {
        cities: formattedCities,
        totalCities: cities.length,
        totalAreas: cities.reduce((sum, city) => sum + city.areas.length, 0)
      },
      message: 'Cities and areas retrieved successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching cities and areas:', error);
    return handleApiError(error, 'Failed to fetch cities and areas');
  }
}