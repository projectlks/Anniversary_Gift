import { NextResponse } from "next/server";
import { resolveCoupleScope } from "@/libs/authz";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const { couple } = await resolveCoupleScope();
    const note = await prisma.loveNote.findUnique({
      where: { coupleId: couple.id },
    });

    return NextResponse.json({
      dateLabel: note?.dateLabel ?? "",
      title: note?.title ?? "My Dearest Love,",
      greeting: note?.greeting ?? "My Dearest Love,",
      content: note?.content ?? "Every moment with you is a memory I treasure forever.",
      closing: note?.closing ?? "Forever and always yours,",
      signature: note?.signature ?? "Your Beloved",
    });
  } catch (error) {
    console.error("Failed to fetch note:", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
