import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['ADMIN'],
  '/pharmacist': ['PHARMACIST'],
  '/pharmacy-owner': ['PHARMACY_OWNER'],
};

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/admin',
  '/auth/register/pharmacist',
  '/auth/register/pharmacy-owner',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/api/')
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Check if the route is protected
  const protectedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  );
  
  if (protectedRoute) {
    // Get token from cookies or headers
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // Redirect to appropriate login page
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/auth/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
    
    // Note: In a production environment, you would verify the JWT token here
    // and check if the user has the required role. For now, we'll let the
    // client-side ProtectedRoute component handle the role verification.
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};