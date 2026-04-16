import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import { logAudit } from "@/libs/audit";
import { prisma } from "@/libs/prisma";
import { verifyPasscode } from "@/libs/security";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === UserRole.SUPER_ADMIN) {
    return NextResponse.json({ success: true, redirectTo: "/backend" });
  }

  const { passcode } = (await req.json()) as { passcode?: string };
  if (!passcode) {
    return NextResponse.json({ success: false, message: "Passcode is required" }, { status: 400 });
  }

  const membership = await prisma.coupleMember.findUnique({
    where: { userId: session.user.id },
    include: { couple: true },
  });

  if (!membership?.couple) {
    return NextResponse.json(
      { success: false, message: "Couple assignment not found" },
      { status: 403 },
    );
  }

  const valid = verifyPasscode(passcode, membership.couple.passcodeHash);
  if (!valid) {
    return NextResponse.json({ success: false, message: "Invalid code" }, { status: 401 });
  }

  await logAudit({
    actorId: session.user.id,
    coupleId: membership.coupleId,
    action: "COUPLE_UNLOCK",
    entityType: "COUPLE",
    entityId: membership.coupleId,
  });

  const res = NextResponse.json({ success: true, redirectTo: "/frontend/menus" });
  res.cookies.set("unlockedCoupleId", membership.coupleId, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
