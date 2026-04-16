"use server";

import { logAudit } from "@/libs/audit";
import { requireAdmin, resolveCoupleScope } from "@/libs/authz";
import { prisma } from "@/libs/prisma";

export async function uploadImageFunction(url: string, targetCoupleId?: string): Promise<boolean> {
  try {
    const { viewer, couple } = await resolveCoupleScope(targetCoupleId);
    if (!viewer.isAdmin) return false;

    const currentCount = await prisma.uploadedImage.count({
      where: { coupleId: couple.id, isArchived: false },
    });

    if (currentCount >= couple.maxMemories) {
      throw new Error("Memory image limit reached for this couple.");
    }

    const created = await prisma.uploadedImage.create({
      data: {
        imgUrl: url,
        coupleId: couple.id,
        createdById: viewer.userId,
      },
    });

    await logAudit({
      actorId: viewer.userId,
      coupleId: couple.id,
      action: "CREATE_MEMORY_IMAGE",
      entityType: "UploadedImage",
      entityId: String(created.id),
    });

    return true;
  } catch (error) {
    console.error("Error uploading image:", error);
    return false;
  }
}

export async function deleteImg(id: number): Promise<boolean> {
  try {
    const viewer = await requireAdmin();

    const existing = await prisma.uploadedImage.findUnique({ where: { id } });
    if (!existing) return false;

    await prisma.uploadedImage.update({
      where: {
        id,
      },
      data: {
        isArchived: true,
      },
    });

    await logAudit({
      actorId: viewer.userId,
      coupleId: existing.coupleId,
      action: "ARCHIVE_MEMORY_IMAGE",
      entityType: "UploadedImage",
      entityId: String(id),
    });

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}
