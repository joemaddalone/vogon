import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getClients } from "@/lib/client/getClients";
import { getServers } from "@/lib/client/database/server";

const protectedRoutes = ["/movie", "/show", "/import", "/"];
// const publicRoutes = ["/", "/config"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const config = await getClients();
  const servers = await getServers();
	if (isProtectedRoute && !config?.tmdbApiKey) {
    return NextResponse.redirect(new URL('/config', request.nextUrl), { status: 307 })
  }

  if(isProtectedRoute && (!servers || servers.length === 0)) {
    return NextResponse.redirect(new URL('/config', request.nextUrl), { status: 307 })
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
