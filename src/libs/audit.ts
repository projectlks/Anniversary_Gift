"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";

type AuditInput = {
  actorId?: string | null;
  coupleId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Prisma.InputJsonValue;
};

export async function logAudit(input: AuditInput) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        coupleId: input.coupleId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        details: input.details,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
