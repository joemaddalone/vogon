import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServers } from "@/lib/client/database/server";

const protectedRoutes = ["/movie", "/show", "/import", "/"];
// const publicRoutes = ["/", "/config"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  if (isProtectedRoute) {
    // Check if servers are configured
    const servers = await getServers();
    if (servers.length === 0) {
      return NextResponse.redirect(new URL('/config', request.nextUrl), { status: 307 });
    }
    // Note: Server selection is now handled client-side via ServerContext
    // We just verify that at least one server exists
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
