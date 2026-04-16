"use server";

import { prisma } from "@/libs/prisma";
import { requireViewerContext, resolveCoupleScope } from "@/libs/authz";

export async function incrementLoveClick() {
  const viewer = await requireViewerContext();
  if (!viewer.coupleId) return;

  await prisma.clickCountTable.upsert({
    where: { coupleId: viewer.coupleId },
    create: {
      coupleId: viewer.coupleId,
      count: 1,
    },
    update: {
      count: { increment: 1 },
    },
  });
}

export async function getTotalCounts() {
  const viewer = await requireViewerContext();
  if (!viewer.coupleId) return 0;

  const record = await prisma.clickCountTable.findUnique({
    where: { coupleId: viewer.coupleId },
    select: { count: true },
  });

  return record?.count ?? 0;
}

export async function getAllImages(targetCoupleId?: string) {
  const { viewer, couple } = await resolveCoupleScope(targetCoupleId);

  const where =
    viewer.isAdmin && targetCoupleId === "all"
      ? { isArchived: false }
      : { isArchived: false, coupleId: couple.id };

  const images = await prisma.uploadedImage.findMany({
    where,
    orderBy: { uploadedAt: "desc" },
  });

  return images ?? [];
}

export async function getLoveNote(targetCoupleId?: string) {
  const { couple } = await resolveCoupleScope(targetCoupleId);

  return prisma.loveNote.findUnique({
    where: { coupleId: couple.id },
  });
}

export async function getJourneyEntries(targetCoupleId?: string) {
  const { couple } = await resolveCoupleScope(targetCoupleId);

  return prisma.journeyEntry.findMany({
    where: { coupleId: couple.id },
    orderBy: [{ eventDate: "asc" }, { sortOrder: "asc" }],
  });
}
