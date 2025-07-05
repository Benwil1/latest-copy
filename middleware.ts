import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Using jose for JWT verification as it's more modern and Edge-compatible

const JWT_SECRET_RAW = process.env.JWT_SECRET;

if (!JWT_SECRET_RAW) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

// Define which paths are public (don't require authentication)
const publicPaths = [
  '/api/auth/login',
  '/api/auth/signup',
  // Add other public paths like '/api/listings' if some are public GET requests
  // Or specific asset paths if needed
];

// Define paths that should be accessible only to unauthenticated users
const unauthenticatedOnlyPaths = [
  '/login',
  '/signup',
  // '/forgot-password' // if you have this page
];


export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get('token')?.value;

  // Check if the path is public
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // Handle unauthenticated only paths (e.g. redirect logged-in users from /login to /home)
  if (token && unauthenticatedOnlyPaths.some(unauthPath => path.startsWith(unauthPath))) {
    try {
      await jwtVerify(token, JWT_SECRET); // Verify token to ensure it's valid
      // If token is valid, redirect to a protected route like home or dashboard
      return NextResponse.redirect(new URL('/home', req.url));
    } catch (err) {
      // Invalid token, allow access to unauthenticatedOnlyPaths
      // Or clear the invalid cookie
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }


  // For all other paths, token is required
  if (!token) {
    // If it's an API route, return 401
    if (path.startsWith('/api/')) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    // For page routes, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Verify the token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Token is valid, proceed
    const response = NextResponse.next();
    // Optionally, you can add the decoded payload to the request headers
    // for easy access in your API routes or server components, though this is more common with Express-like middleware.
    // For Next.js 13+ app router, you'd typically re-verify or pass necessary IDs.
    // response.headers.set('x-user-id', payload.userId as string);
    // response.headers.set('x-user-email', payload.email as string);
    return response;

  } catch (err) {
    console.error('JWT Verification Error:', err);
    // If token is invalid (e.g., expired, malformed)
    // If it's an API route, return 401
    if (path.startsWith('/api/')) {
      const response = NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
      response.cookies.delete('token'); // Clear the invalid token
      return response;
    }
    // For page routes, redirect to login and clear the invalid token
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('token');
    return response;
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root path, if it's your landing page and public) - adjust as needed
     * - /api/public (example if you have a dedicated public API folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/login|api/auth/signup).*)',
    // Add any other paths you want the middleware to run on or ignore.
    // The publicPaths array above gives more granular control for API routes.
    // The matcher is for Next.js to know WHEN to run this middleware function.
  ],
};
