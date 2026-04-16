"use server";

import { revalidatePath } from "next/cache";
import { logAudit } from "@/libs/audit";
import { requireAdmin } from "@/libs/authz";
import { prisma } from "@/libs/prisma";

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function saveLoveNoteAction(formData: FormData) {
  const viewer = await requireAdmin();
  const coupleId = getText(formData, "coupleId");
  if (!coupleId) throw new Error("Couple is required.");

  const title = getText(formData, "title");
  const greeting = getText(formData, "greeting");
  const content = getText(formData, "content");
  const closing = getText(formData, "closing");
  const signature = getText(formData, "signature");
  const dateLabel = getText(formData, "dateLabel");

  const saved = await prisma.loveNote.upsert({
    where: { coupleId },
    update: {
      title,
      greeting,
      content,
      closing,
      signature,
      dateLabel,
      updatedById: viewer.userId,
    },
    create: {
      coupleId,
      title,
      greeting,
      content,
      closing,
      signature,
      dateLabel,
      updatedById: viewer.userId,
    },
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId,
    action: "SAVE_LOVE_NOTE",
    entityType: "LoveNote",
    entityId: saved.id,
  });

  revalidatePath(`/backend/note?coupleId=${coupleId}`);
  revalidatePath("/frontend/note");
}
