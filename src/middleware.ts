import { NextRequest, NextResponse } from "next/server";

export default function middleware(request:NextRequest){
    console.log('entered middleware')
    
    if(request.url.endsWith('/auth/login')) return NextResponse.next()

    console.log('entered middleware1')

    const token = request.cookies.get('accessToken')

    if(!token){
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return NextResponse.next()
}