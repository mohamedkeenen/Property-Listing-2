import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if it's a POST request (likely from Bitrix24 initial load)
  if (request.method === 'POST') {
    try {
      const contentType = request.headers.get('content-type') || '';
      
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        const params = new URLSearchParams();
        
        // Extract all Bitrix24 parameters from POST body
        formData.forEach((value, key) => {
          if (typeof value === 'string') {
            params.set(key, value);
          }
        });

        // If we found Bitrix parameters, redirect to GET with those parameters
        if (params.has('DOMAIN') || params.has('AUTH_ID')) {
          const url = request.nextUrl.clone();
          url.search = params.toString();
          
          // Return a 303 redirect to the same URL but with GET method
          return NextResponse.redirect(url, 303);
        }
      }
    } catch (error) {
      console.error('Middleware POST processing error:', error);
    }
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
