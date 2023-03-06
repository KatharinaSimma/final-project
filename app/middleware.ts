import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/logout',
};

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  // FIXME
  const fakeSessionToken = request.cookies.get('fakeSessionToken')?.value;

  if (fakeSessionToken) {
    requestHeaders.set('x-fakeSessionToken-to-delete', fakeSessionToken);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set({
    name: 'fakeSessionToken',
    value: '',
    maxAge: -1,
  });

  return response;
}
