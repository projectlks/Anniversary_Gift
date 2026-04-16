"use server";

import { revalidatePath } from "next/cache";
import { logAudit } from "@/libs/audit";
import { requireAdmin } from "@/libs/authz";
import { prisma } from "@/libs/prisma";

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createJourneyEntryAction(formData: FormData) {
  const viewer = await requireAdmin();
  const coupleId = getText(formData, "coupleId");
  const title = getText(formData, "title");
  const description = getText(formData, "description");
  const eventDateRaw = getText(formData, "eventDate");
  const sortOrder = Number(getText(formData, "sortOrder") || "0");

  if (!coupleId || !title || !eventDateRaw) {
    throw new Error("Couple, title and date are required.");
  }

  const created = await prisma.journeyEntry.create({
    data: {
      coupleId,
      title,
      description: description || null,
      eventDate: new Date(eventDateRaw),
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      createdById: viewer.userId,
    },
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId,
    action: "CREATE_JOURNEY_ENTRY",
    entityType: "JourneyEntry",
    entityId: created.id,
  });

  revalidatePath(`/backend/journey?coupleId=${coupleId}`);
  revalidatePath("/frontend/journey");
}

export async function updateJourneyEntryAction(formData: FormData) {
  const viewer = await requireAdmin();
  const entryId = getText(formData, "entryId");
  const coupleId = getText(formData, "coupleId");
  const title = getText(formData, "title");
  const description = getText(formData, "description");
  const eventDateRaw = getText(formData, "eventDate");
  const sortOrder = Number(getText(formData, "sortOrder") || "0");

  if (!entryId || !coupleId || !title || !eventDateRaw) {
    throw new Error("Invalid journey entry input.");
  }

  await prisma.journeyEntry.update({
    where: { id: entryId },
    data: {
      title,
      description: description || null,
      eventDate: new Date(eventDateRaw),
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId,
    action: "UPDATE_JOURNEY_ENTRY",
    entityType: "JourneyEntry",
    entityId: entryId,
  });

  revalidatePath(`/backend/journey?coupleId=${coupleId}`);
  revalidatePath("/frontend/journey");
}

export async function deleteJourneyEntryAction(formData: FormData) {
  const viewer = await requireAdmin();
  const entryId = getText(formData, "entryId");
  const coupleId = getText(formData, "coupleId");
  if (!entryId || !coupleId) throw new Error("Entry is required.");

  await prisma.journeyEntry.delete({ where: { id: entryId } });

  await logAudit({
    actorId: viewer.userId,
    coupleId,
    action: "DELETE_JOURNEY_ENTRY",
    entityType: "JourneyEntry",
    entityId: entryId,
  });

  revalidatePath(`/backend/journey?coupleId=${coupleId}`);
  revalidatePath("/frontend/journey");
}
