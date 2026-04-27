import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // Only process POST requests
  if (request.method === 'POST') {
    const referer = request.headers.get('referer') || '';
    const isBitrixReferer = referer.includes('.bitrix24.') || referer.includes('.bitrix-24.');
    const isBitrixHeader = request.headers.has('x-bitrix-24');

    // Only attempt to process if it looks like a Bitrix request
    // This prevents consuming the body for regular website form submissions (POSTs)
    if (isBitrixReferer || isBitrixHeader) {
      try {
        const contentType = request.headers.get('content-type') || '';
        
        if (contentType.includes('application/x-www-form-urlencoded')) {
          const formData = await request.formData();
          const params = new URLSearchParams();
          
          formData.forEach((value, key) => {
            if (typeof value === 'string') {
              params.set(key, value);
            }
          });

          if (params.has('DOMAIN') || params.has('AUTH_ID')) {
            const url = request.nextUrl.clone();
            url.search = params.toString();
            return NextResponse.redirect(url, 303);
          }
        }
      } catch (error) {
        console.error('Proxy processing error:', error);
      }
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
