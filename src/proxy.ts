import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getClients } from "@/lib/client/getClients";

const protectedRoutes = ["/movie", "/show", "/import"];
// const publicRoutes = ["/", "/config"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const config = await getClients();
	if (isProtectedRoute && !config?.plexToken) {
    return NextResponse.redirect(new URL('/config', request.nextUrl))
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
