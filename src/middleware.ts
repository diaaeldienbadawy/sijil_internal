import { NextRequest, NextResponse } from "next/server";


const pathes = [
  '/user/tenders',
  '/user/judges',
  '/user/updates'
]


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  /*const token = request.cookies.get('access_token')?.value;

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const API_VER = process.env.NEXT_PUBLIC_API_VER!;


  if (pathname.startsWith('/auth/login')) {
    if (!token) {
      return NextResponse.next();
    }

    try {
      const res = await fetch(`${API_URL}${API_VER}/auth/refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();

        console.log("Data is ",data)  

        const response = NextResponse.redirect(
          new URL('/user/tenders', request.url)
        );

        response.cookies.set('access_token', data.access_token);

        return response;
      }
      else{
        console.log("Data is ", res.body) 
      }

      return NextResponse.next();
    } catch(e) {
      console.log("error is ",e)  
      return NextResponse.next();
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }*/

  console.log("path name " ,pathname)

  if(!pathes.includes(pathname)) return NextResponse.redirect(new URL('/user/tenders', request.url));

  return NextResponse.next();
}