import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const protectedRoutes = ['/', '/location'];
export default async function middleware(req) {
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
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
