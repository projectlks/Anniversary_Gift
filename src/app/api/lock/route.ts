import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import { logAudit } from "@/libs/audit";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("unlockedCoupleId", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  await logAudit({
    actorId: session.user.id,
    coupleId: session.user.coupleId ?? null,
    action: "COUPLE_LOCK",
    entityType: "COUPLE",
    entityId: session.user.coupleId ?? null,
  });

  return res;
}
