import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // Only process POST requests with form data
  if (request.method === 'POST') {
    try {
      const contentType = request.headers.get('content-type') || '';
      
      if (contentType.includes('application/x-www-form-urlencoded')) {
        // Clone the request so we can read the body without consuming it for downstream handlers
        const clone = request.clone();
        const formData = await clone.formData();
        const params = new URLSearchParams();
        
        formData.forEach((value, key) => {
          if (typeof value === 'string') {
            params.set(key, value);
          }
        });

        // Check if this looks like a Bitrix24 authentication request
        const isBitrix = params.has('DOMAIN') && (params.has('AUTH_ID') || params.has('member_id'));

        if (isBitrix) {
          const url = request.nextUrl.clone();
          url.search = params.toString();
          
          // Use 303 (See Other) to force the browser to perform a GET request
          return NextResponse.redirect(url, 303);
        }
      }
    } catch (error) {
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
