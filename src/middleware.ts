// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const PUBLIC_PATHS = new Set(["/", "/auth/signin", "/auth/verify"]);

// export async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   if (PUBLIC_PATHS.has(pathname)) {
//     return NextResponse.next();
//   }

//   const token = await getToken({
//     req: request,
//     secret: process.env.AUTH_SECRET,
//   });

//   if (!token?.sub) {
//     const signInUrl = request.nextUrl.clone();
//     signInUrl.pathname = "/auth/signin";
//     signInUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(signInUrl);
//   }

//   const isAdmin = token.role === "SUPER_ADMIN";
//   const coupleId = typeof token.coupleId === "string" ? token.coupleId : null;

//   if (pathname.startsWith("/backend") && !isAdmin) {
//     const deniedUrl = request.nextUrl.clone();
//     deniedUrl.pathname = "/frontend";
//     return NextResponse.redirect(deniedUrl);
//   }

//   if (pathname === "/lock") {
//     return NextResponse.next();
//   }

//   if (!isAdmin && pathname.startsWith("/frontend")) {
//     const unlockedCoupleId = request.cookies.get("unlockedCoupleId")?.value;
//     if (!coupleId || unlockedCoupleId !== coupleId) {
//       const lockUrl = request.nextUrl.clone();
//       lockUrl.pathname = "/lock";
//       return NextResponse.redirect(lockUrl);
//     }
//   }

//   return NextResponse.next();
// }

// // ဒီအပိုင်းကို ပြင်ဆင်ထားပါတယ်
// export const config = {
//   matcher: [
//     /*
//      * အောက်ပါလမ်းကြောင်းများကို Middleware မှ ကင်းလွတ်ခွင့်ပြုပါမည်:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - ပုံများအားလုံး (svg, png, jpg, jpeg, gif, webp)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)",
//   ],
// };


import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = new Set(["/", "/auth/signin", "/auth/verify"]);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Public Paths များကို ကျော်ဖြတ်ခွင့်ပြုပါ
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // 2. Token စစ်ဆေးခြင်း
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

  // 3. Backend Routes များကို Admin သာ ဝင်ခွင့်ပြုမည်
  if (pathname.startsWith("/backend")) {
    if (!isAdmin) {
      const deniedUrl = request.nextUrl.clone();
      deniedUrl.pathname = "/menus"; // Admin မဟုတ်လျှင် Home (သို့) လုံခြုံသောနေရာသို့ ပို့ပါမည်
      return NextResponse.redirect(deniedUrl);
    }
    return NextResponse.next();
  }

  // 4. Lock Page ကို ကျော်ဖြတ်ခွင့်ပြုပါ
  if (pathname === "/lock") {
    return NextResponse.next();
  }

  // 5. ကျန်သော User Routes (Frontend) အားလုံးအတွက် Lock Check လုပ်ပါမည်
  // 🌟 (URL တွင် /frontend မပါတော့သောကြောင့် အောက်ပါအတိုင်း စစ်ဆေးပါသည်) 🌟
  if (!isAdmin) {
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
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)",
  ],
};