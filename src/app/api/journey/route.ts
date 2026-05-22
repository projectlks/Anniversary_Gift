import { NextResponse } from "next/server";
import { resolveCoupleScope } from "@/libs/authz";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const { couple } = await resolveCoupleScope();
    const entries = await prisma.journeyEntry.findMany({
      where: { coupleId: couple.id },
      orderBy: [{ eventDate: "asc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json({
      startDate: couple.startDate,
      entries,
    });
  } catch (error) {
    console.error("Failed to fetch journey:", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
