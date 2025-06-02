import { NextResponse } from 'next/server';

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
  }

  static badRequest(message: string, errors?: any[]) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message: string = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message: string = 'Resource not found') {
    return new ApiError(404, message);
  }

  static internal(message: string = 'Internal server error') {
    return new ApiError(500, message);
  }

  static paymentRequired(message: string = 'Payment Required') {
    return new ApiError(402, message);
  }
}

// Utility function to handle errors in API routes and return a standardized NextResponse
export function handleApiError(error: any): NextResponse {
  console.error(`API Error: ${error.message}`);
  if (error.stack) {
    console.error(error.stack);
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        ...(error.errors && { errors: error.errors }),
      },
      { status: error.statusCode }
    );
  }

  // Handle Prisma-like errors (check by name or code if PrismaClientKnownRequestError is not directly available)
  // This is a simplified check; you might need more specific checks for Prisma error codes.
  if (error.name === 'PrismaClientKnownRequestError' || (error.code && typeof error.code === 'string' && error.code.startsWith('P'))) {
    return NextResponse.json(
      {
        success: false,
        message: 'Database operation failed.',
        errorDetails: error.message, // Or more specific details from error.meta
      },
      { status: 400 } // Or a more appropriate status code based on the Prisma error
    );
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return NextResponse.json(
      { success: false, message: 'Invalid token' },
      { status: 401 }
    );
  }
  if (error.name === 'TokenExpiredError') {
    return NextResponse.json(
      { success: false, message: 'Token expired' },
      { status: 401 }
    );
  }

  // Default to 500 internal server error
  return NextResponse.json(
    {
      success: false,
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { errorDetails: error.message }),
    },
    { status: 500 }
  );
}

// Example usage in an API route:
/*
import { handleApiError, ApiError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    // ... your logic ...
    if (someCondition) {
      throw ApiError.badRequest('Invalid input provided', [{ field: 'name', message: 'cannot be empty' }]);
    }
    // ... more logic ...
    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    return handleApiError(error);
  }
}
*/