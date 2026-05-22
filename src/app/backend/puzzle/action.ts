"use server";

import { logAudit } from "@/libs/audit";
import { requireAdmin, resolveCoupleScope } from "@/libs/authz";
import { uploadPuzzleImageFile } from "@/libs/action";
import { prisma } from "@/libs/prisma";

export async function uploadImageFunction(
  fileData: FormData,
  targetCoupleId?: string,
): Promise<boolean> {
  try {
    return await uploadPuzzleImageFile(fileData, targetCoupleId);
  } catch (error) {
    console.error("Error uploading image:", error);
    return false;
  }
}

export async function getAllPuzzleImages(targetCoupleId?: string) {
  try {
    const { viewer, couple } = await resolveCoupleScope(targetCoupleId);

    const where =
      viewer.isAdmin && targetCoupleId === "all"
        ? { isArchived: false }
        : { isArchived: false, coupleId: couple.id };

    const images = await prisma.puzzleImages.findMany({
      where,
      orderBy: {
        uploadedAt: "desc",
      },
    });

    return images ?? [];
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
} 


export async function deletePuzzleImage(id: number) {
  try {
    const viewer = await requireAdmin();

    const existing = await prisma.puzzleImages.findUnique({ where: { id } });
    if (!existing) return false;

    await prisma.puzzleImages.update({
      where: {
        id: id,
      },
      data: {
        isArchived: true,
      },
    });

    await logAudit({
      actorId: viewer.userId,
      coupleId: existing.coupleId,
      action: "ARCHIVE_PUZZLE_IMAGE",
      entityType: "PuzzleImages",
      entityId: String(id),
    });

    return true; // optionally return success
  } catch (error) {
    console.error('Error archiving puzzle image:', error);
    return false; // optionally return failure
  }
}
