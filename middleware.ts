import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_TOSS_ORIGIN || 'https://saju-strength.apps.tossmini.com',
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const response = NextResponse.next();

  // CORS — API 라우트 전용
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development') {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }
  }

  // CSP 헤더 (XSS 방어)
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api-partner.toss.im https://*.supabase.co",
      "frame-ancestors 'self' https://*.toss.im",
    ].join('; ')
  );

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
