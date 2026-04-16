import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = new Set(["/", "/auth/signin", "/auth/verify"]);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token?.sub) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/auth/signin";
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const isAdmin = token.role === "SUPER_ADMIN";
  const coupleId = typeof token.coupleId === "string" ? token.coupleId : null;

  if (pathname.startsWith("/backend") && !isAdmin) {
    const deniedUrl = request.nextUrl.clone();
    deniedUrl.pathname = "/frontend/menus";
    return NextResponse.redirect(deniedUrl);
  }

  if (pathname === "/lock") {
    return NextResponse.next();
  }

  if (!isAdmin && pathname.startsWith("/frontend")) {
    const unlockedCoupleId = request.cookies.get("unlockedCoupleId")?.value;
    if (!coupleId || unlockedCoupleId !== coupleId) {
      const lockUrl = request.nextUrl.clone();
      lockUrl.pathname = "/lock";
      return NextResponse.redirect(lockUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
