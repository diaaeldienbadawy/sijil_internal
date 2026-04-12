import { NextRequest, NextResponse } from "next/server";

export default function middleware(request:NextRequest){
    const { pathname } = request.nextUrl;

    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) {
      return;
    }

    if(pathname.endsWith('/auth/login')) return NextResponse.next()

    const token = request.cookies.get('access_token')

    console.log("token ",token)

    if(!token){
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return NextResponse.next()
}