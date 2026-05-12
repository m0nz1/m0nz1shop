import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin/dashboard");

  if (isAdminRoute && adminSession?.value !== "true") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
