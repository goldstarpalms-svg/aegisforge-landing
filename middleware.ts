import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { securityHeaders } from "@/middleware/security-headers";

export function middleware(_request: NextRequest) {
  void _request;
  const response = NextResponse.next();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
