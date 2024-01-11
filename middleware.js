import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export default async function middleware(req) {
  if (
    req.nextUrl.pathname == '/' ||
    req.nextUrl.pathname.startsWith('/location')
  ) {
    const token = await getToken({ req, secret: 'telemetrikey' });

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (req.nextUrl.pathname == '/location') {
      return NextResponse.redirect(new URL('/location/maps', req.url));
    }

    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith('/auth')) {
    const token = await getToken({ req, secret: 'telemetrikey' });

    if (token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  }
}
