import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only protect proposal routes
  if (!request.nextUrl.pathname.startsWith('/proposal')) {
    return NextResponse.next();
  }

  // Extract proposal ID from URL
  const pathParts = request.nextUrl.pathname.split('/');
  const proposalId = pathParts[2]; // /proposal/[proposalId]/...

  if (!proposalId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check for password in URL parameters
  const urlPassword = request.nextUrl.searchParams.get('pw');
  
  if (urlPassword) {
    // If password is in URL, redirect to verify it via the landing page
    // This ensures proper session creation
    const returnUrl = request.nextUrl.pathname;
    return NextResponse.redirect(
      new URL(`/?pw=${urlPassword}&return=${encodeURIComponent(returnUrl)}`, request.url)
    );
  }

  // For now, let the route handlers check the session
  // This is because middleware can't easily access encrypted cookies
  return NextResponse.next();
}

export const config = {
  matcher: '/proposal/:path*'
}; 