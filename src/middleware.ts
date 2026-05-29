// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const PUBLIC_PATHS = new Set(["/", "/auth/signin", "/auth/verify"]);

// export async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   // 1. Public Paths များကို ကျော်ဖြတ်ခွင့်ပြုပါ
//   if (PUBLIC_PATHS.has(pathname)) {
//     return NextResponse.next();
//   }

//   // 2. Token စစ်ဆေးခြင်း
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

//   // 3. Backend Routes များကို Admin သာ ဝင်ခွင့်ပြုမည်
//   if (pathname.startsWith("/backend")) {
//     if (!isAdmin) {
//       const deniedUrl = request.nextUrl.clone();
//       deniedUrl.pathname = "/menus"; // Admin မဟုတ်လျှင် Home (သို့) လုံခြုံသောနေရာသို့ ပို့ပါမည်
//       return NextResponse.redirect(deniedUrl);
//     }
//     return NextResponse.next();
//   }

//   // 4. Lock Page ကို ကျော်ဖြတ်ခွင့်ပြုပါ
//   if (pathname === "/lock") {
//     return NextResponse.next();
//   }

//   // 5. ကျန်သော User Routes (Frontend) အားလုံးအတွက် Lock Check လုပ်ပါမည်
//   // 🌟 (URL တွင် /frontend မပါတော့သောကြောင့် အောက်ပါအတိုင်း စစ်ဆေးပါသည်) 🌟
//   if (!isAdmin) {
//     const unlockedCoupleId = request.cookies.get("unlockedCoupleId")?.value;
//     if (!coupleId || unlockedCoupleId !== coupleId) {
//       const lockUrl = request.nextUrl.clone();
//       lockUrl.pathname = "/lock";
//       return NextResponse.redirect(lockUrl);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)",
//   ],
// };
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = new Set([
  "/",
  "/auth/signin",
  "/auth/verify",
  "/privacy",
  "/sitemap.xml",
  "/terms-of-service",
]);

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

  // 🌟 ၄။ Lock Page ကို ဝင်လာလျှင် (Back နှိပ်၍သော်လည်းကောင်း) စစ်ဆေးမည့် အပိုင်းသစ် 🌟
  if (pathname === "/lock") {
    // Admin မဟုတ်လျှင် (သာမန် User ဖြစ်လျှင်)
    if (!isAdmin) {
      const unlockedCoupleId = request.cookies.get("unlockedCoupleId")?.value;

      // Passcode ရိုက်ပြီးသွားပြီ (Cookie ရှိနေပြီ) သို့မဟုတ် သူပိုင်တဲ့ coupleId နဲ့ ကိုက်နေပြီဆိုလျှင် 
      // Lock Page ကို ထပ်ဝင်ခွင့်မပေးတော့ဘဲ /menus ကို တန်းပို့ပါမည်။
      if (unlockedCoupleId && unlockedCoupleId === coupleId) {
        const menusUrl = request.nextUrl.clone();
        menusUrl.pathname = "/menus";
        return NextResponse.redirect(menusUrl);
      }
    }
    // Cookie မရှိသေးလျှင် (Passcode မရိုက်ရသေးလျှင်) Lock Page သို့ သွားခွင့်ပြုမည်
    return NextResponse.next();
  }

  // 5. ကျန်သော User Routes (Frontend) အားလုံးအတွက် Lock Check လုပ်ပါမည်
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
