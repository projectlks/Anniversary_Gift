import { auth } from "@/libs/auth";
import { prisma } from "@/libs/prisma";
import { UserRole } from "@prisma/client";

export type ViewerContext = {
  userId: string;
  email: string | null;
  role: UserRole;
  isAdmin: boolean;
  coupleId: string | null;
  coupleName: string | null;
  canEdit: boolean;
};

export async function getViewerContext(): Promise<ViewerContext | null> {
  const session = await auth();

  if (!session?.user?.id) return null;

  const isAdmin = session.user.role === UserRole.SUPER_ADMIN;
  if (isAdmin) {
    return {
      userId: session.user.id,
      email: session.user.email ?? null,
      role: UserRole.SUPER_ADMIN,
      isAdmin: true,
      coupleId: null,
      coupleName: null,
      canEdit: true,
    };
  }

  const membership = await prisma.coupleMember.findUnique({
    where: { userId: session.user.id },
    include: { couple: true },
  });

  return {
    userId: session.user.id,
    email: session.user.email ?? null,
    role: UserRole.MEMBER,
    isAdmin: false,
    coupleId: membership?.coupleId ?? null,
    coupleName: membership?.couple?.name ?? null,
    canEdit: membership?.canEdit ?? false,
  };
}

export async function requireViewerContext(): Promise<ViewerContext> {
  const viewer = await getViewerContext();
  if (!viewer) {
    throw new Error("UNAUTHORIZED");
  }
  return viewer;
}

export async function requireAdmin() {
  const viewer = await requireViewerContext();
  if (!viewer.isAdmin) {
    throw new Error("FORBIDDEN");
  }
  return viewer;
}

export async function resolveCoupleScope(targetCoupleId?: string | null) {
  const viewer = await requireViewerContext();

  if (viewer.isAdmin) {
    const couple = targetCoupleId
      ? await prisma.couple.findFirst({
          where: { id: targetCoupleId, isArchived: false },
        })
      : await prisma.couple.findFirst({
          where: { isArchived: false },
          orderBy: { createdAt: "asc" },
        });

    if (!couple) {
      throw new Error("NO_COUPLE_FOUND");
    }
    return { viewer, couple };
  }

  if (!viewer.coupleId) {
    throw new Error("COUPLE_NOT_ASSIGNED");
  }

  const couple = await prisma.couple.findFirst({
    where: { id: viewer.coupleId, isArchived: false },
  });

  if (!couple) {
    throw new Error("COUPLE_NOT_FOUND");
  }

  return { viewer, couple };
}
