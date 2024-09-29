import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware running for path:", request.nextUrl.pathname);

  const token = request.cookies.get("token")?.value;
  console.log("Token present:", !!token);

  if (!token && !request.nextUrl.pathname.startsWith("/login")) {
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && request.nextUrl.pathname.startsWith("/login")) {
    console.log("Redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  console.log("Proceeding to next middleware or route handler");
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
