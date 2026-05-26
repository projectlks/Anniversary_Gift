// "use server";

// import { revalidatePath } from "next/cache";
// import { CoupleMemberRole, CoupleMemberStatus } from "@prisma/client";
// import { logAudit } from "@/libs/audit";
// import { requireAdmin } from "@/libs/authz";
// import { prisma } from "@/libs/prisma";
// import { hashPasscode, normalizeEmail } from "@/libs/security";

// function getText(formData: FormData, key: string) {
//   return String(formData.get(key) ?? "").trim();
// }

// function toSlug(input: string) {
//   return input
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// }

// export async function createCoupleAction(formData: FormData) {
//   const viewer = await requireAdmin();

//   const name = getText(formData, "name");
//   const passcode = getText(formData, "passcode");
//   const ownerEmailRaw = getText(formData, "ownerEmail");
//   const partnerEmailRaw = getText(formData, "partnerEmail");
//   const startDateRaw = getText(formData, "startDate");
//   const startTimeRaw = getText(formData, "startTime");
//   const maxMemoriesRaw = Number(getText(formData, "maxMemories") || "120");
//   // const maxPuzzleImagesRaw = Number(getText(formData, "maxPuzzleImages") || "30");

//   if (!name || !passcode || !ownerEmailRaw) {
//     throw new Error("Name, passcode and owner email are required.");
//   }

//   const slugBase = toSlug(name);
//   if (!slugBase) {
//     throw new Error("Unable to generate slug from couple name.");
//   }

//   const ownerEmail = normalizeEmail(ownerEmailRaw);
//   const partnerEmail = partnerEmailRaw ? normalizeEmail(partnerEmailRaw) : null;
//   // const startDate = startDateRaw ? new Date(startDateRaw) : null;

//   let startDate: Date | null = null;

//   if (startDateRaw) {
//     if (startTimeRaw) {
//       startDate = new Date(`${startDateRaw}T${startTimeRaw}`);
//     } else {
//       startDate = new Date(startDateRaw);
//     }
//   }

//   const slugCount = await prisma.couple.count({
//     where: { slug: { startsWith: slugBase } },
//   });
//   const slug = slugCount === 0 ? slugBase : `${slugBase}-${slugCount + 1}`;

//   const created = await prisma.couple.create({
//     data: {
//       name,
//       slug,
//       passcodeHash: hashPasscode(passcode),
//       startDate,
//       maxMemories: Number.isFinite(maxMemoriesRaw) ? Math.max(maxMemoriesRaw, 1) : 120,
//       // maxPuzzleImages: Number.isFinite(maxPuzzleImagesRaw) ? Math.max(maxPuzzleImagesRaw, 1) : 30,
//       members: {
//         create: [
//           {
//             email: ownerEmail,
//             role: CoupleMemberRole.OWNER,
//             status: CoupleMemberStatus.INVITED,
//             canEdit: false,
//           },
//           ...(partnerEmail
//             ? [
//               {
//                 email: partnerEmail,
//                 role: CoupleMemberRole.PARTNER,
//                 status: CoupleMemberStatus.INVITED,
//                 canEdit: false,
//               },
//             ]
//             : []),
//         ],
//       },
//       clickCounter: {
//         create: {
//           count: 0,
//         },
//       },
//       loveNotes: {
//         create: {
//           dateLabel: new Date().toLocaleDateString("en-US", {
//             month: "long",
//             day: "numeric",
//             year: "numeric",
//           }),
//         },
//       },
//     },
//   });

//   await logAudit({
//     actorId: viewer.userId,
//     coupleId: created.id,
//     action: "CREATE_COUPLE",
//     entityType: "Couple",
//     entityId: created.id,
//     details: { ownerEmail, partnerEmail },
//   });

//   revalidatePath("/backend/couples");
// }

// export async function inviteMemberAction(formData: FormData) {
//   const viewer = await requireAdmin();
//   const coupleId = getText(formData, "coupleId");
//   const emailRaw = getText(formData, "email");
//   const roleRaw = getText(formData, "role");

//   if (!coupleId || !emailRaw) throw new Error("Couple and email are required.");

//   const email = normalizeEmail(emailRaw);
//   const role = roleRaw === "OWNER" ? CoupleMemberRole.OWNER : CoupleMemberRole.PARTNER;

//   await prisma.coupleMember.upsert({
//     where: {
//       coupleId_email: {
//         coupleId,
//         email,
//       },
//     },
//     update: {
//       role,
//       status: CoupleMemberStatus.INVITED,
//       canEdit: false,
//       userId: null,
//       joinedAt: null,
//     },
//     create: {
//       coupleId,
//       email,
//       role,
//       status: CoupleMemberStatus.INVITED,
//       canEdit: false,
//     },
//   });

//   await logAudit({
//     actorId: viewer.userId,
//     coupleId,
//     action: "INVITE_MEMBER",
//     entityType: "CoupleMember",
//     entityId: email,
//     details: { role },
//   });

//   revalidatePath("/backend/couples");
// }

// export async function updatePasscodeAction(formData: FormData) {
//   const viewer = await requireAdmin();
//   const coupleId = getText(formData, "coupleId");
//   const passcode = getText(formData, "passcode");

//   if (!coupleId || !passcode) throw new Error("Couple and passcode are required.");

//   await prisma.couple.update({
//     where: { id: coupleId },
//     data: { passcodeHash: hashPasscode(passcode) },
//   });

//   await logAudit({
//     actorId: viewer.userId,
//     coupleId,
//     action: "UPDATE_COUPLE_PASSCODE",
//     entityType: "Couple",
//     entityId: coupleId,
//   });

//   revalidatePath("/backend/couples");
// }

// export async function updateLimitsAction(formData: FormData) {
//   const viewer = await requireAdmin();
//   const coupleId = getText(formData, "coupleId");
//   const maxMemories = Number(getText(formData, "maxMemories"));
//   // const maxPuzzleImages = Number(getText(formData, "maxPuzzleImages"));

//   if (!coupleId) throw new Error("Couple is required.");

//   await prisma.couple.update({
//     where: { id: coupleId },
//     data: {
//       maxMemories: Number.isFinite(maxMemories) ? Math.max(1, maxMemories) : 120,
//       // maxPuzzleImages: Number.isFinite(maxPuzzleImages) ? Math.max(1, maxPuzzleImages) : 30,
//     },
//   });

//   await logAudit({
//     actorId: viewer.userId,
//     coupleId,
//     action: "UPDATE_COUPLE_LIMITS",
//     entityType: "Couple",
//     entityId: coupleId,
//   });

//   revalidatePath("/backend/couples");
// }

// export async function archiveCoupleAction(formData: FormData) {
//   const viewer = await requireAdmin();
//   const coupleId = getText(formData, "coupleId");
//   if (!coupleId) throw new Error("Couple is required.");

//   await prisma.couple.update({
//     where: { id: coupleId },
//     data: { isArchived: true },
//   });

//   await logAudit({
//     actorId: viewer.userId,
//     coupleId,
//     action: "ARCHIVE_COUPLE",
//     entityType: "Couple",
//     entityId: coupleId,
//   });

//   revalidatePath("/backend/couples");
// }


"use server";

import { revalidatePath } from "next/cache";
import { CoupleMemberRole } from "@prisma/client";
import { logAudit } from "@/libs/audit";
import { requireAdmin } from "@/libs/authz";
import { prisma } from "@/libs/prisma";
import { hashPasscode } from "@/libs/security";

// 🌟 အစ်ကို့ရဲ့ မူလ Helper Function များကို ပြန်ထည့်ပေးထားပါသည်
function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCoupleAction(formData: FormData) {
  const viewer = await requireAdmin();

  const name = getText(formData, "name");
  const passcode = getText(formData, "passcode");
  const ownerEmailRaw = getText(formData, "ownerEmail");
  const partnerEmailRaw = getText(formData, "partnerEmail");
  const startDateRaw = getText(formData, "startDate");
  const startTimeRaw = getText(formData, "startTime");

  // 🌟 Puzzle Limit ဖြုတ်ပြီးသားပါ
  const maxMemoriesRaw = Number(getText(formData, "maxMemories") || "120");

  // 🌟 Surprise Section အတွက် Data များ
  const surpriseMessageRaw = getText(formData, "surpriseMessage");
  const surpriseVideoUrlRaw = getText(formData, "surpriseVideoUrl");
  const secretNoteRaw = getText(formData, "secretNote");

  if (!name || !passcode || !ownerEmailRaw) {
    throw new Error("Missing required fields.");
  }

  const slug = toSlug(name);

  let startDate: Date | null = null;
  if (startDateRaw) {
    startDate = startTimeRaw
      ? new Date(`${startDateRaw}T${startTimeRaw}`)
      : new Date(startDateRaw);
  }

  const created = await prisma.couple.create({
    data: {
      name,
      slug,
      passcodeHash: hashPasscode(passcode),
      startDate,
      maxMemories: Number.isFinite(maxMemoriesRaw) ? Math.max(maxMemoriesRaw, 1) : 120,
      surpriseMessage: surpriseMessageRaw || null,
      surpriseVideoUrl: surpriseVideoUrlRaw || null,
      secretNote: secretNoteRaw || null,
    },
  });
  // 🌟 TypeScript ကို CoupleMemberRole အကုန်လက်ခံကြောင်း အတိအကျ ကြေညာပေးလိုက်ပါသည်
  const memberData: { coupleId: string; email: string; role: CoupleMemberRole }[] = [
    {
      coupleId: created.id,
      email: ownerEmailRaw.toLowerCase(),
      role: CoupleMemberRole.OWNER,
    },
  ];

  if (
    partnerEmailRaw &&
    partnerEmailRaw.toLowerCase() !== ownerEmailRaw.toLowerCase()
  ) {
    memberData.push({
      coupleId: created.id,
      email: partnerEmailRaw.toLowerCase(),
      role: CoupleMemberRole.PARTNER,
    });
  }

  await prisma.coupleMember.createMany({
    data: memberData,
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId: created.id,
    action: "CREATE_COUPLE",
    entityType: "Couple",
    entityId: created.id,
  });

  revalidatePath("/backend/couples");
}

export async function archiveCoupleAction(formData: FormData) {
  const viewer = await requireAdmin();
  const coupleId = getText(formData, "coupleId");
  const shouldArchive = getText(formData, "shouldArchive") === "true";

  if (!coupleId) throw new Error("Couple is required.");

  await prisma.couple.update({
    where: { id: coupleId },
    data: { isArchived: shouldArchive },
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId,
    action: shouldArchive ? "ARCHIVE_COUPLE" : "UNARCHIVE_COUPLE",
    entityType: "Couple",
    entityId: coupleId,
  });

  revalidatePath("/backend/couples");
}

export async function updateLimitsAction(formData: FormData) {
  const viewer = await requireAdmin();
  const coupleId = getText(formData, "coupleId");
  const maxMemories = Number(getText(formData, "maxMemories"));

  if (!coupleId) throw new Error("Couple is required.");

  await prisma.couple.update({
    where: { id: coupleId },
    data: {
      maxMemories: Number.isFinite(maxMemories) ? Math.max(1, maxMemories) : 120,
    },
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId,
    action: "UPDATE_COUPLE_LIMITS",
    entityType: "Couple",
    entityId: coupleId,
  });

  revalidatePath("/backend/couples");
}

export async function updatePasscodeAction(formData: FormData) {
  const viewer = await requireAdmin();
  const coupleId = getText(formData, "coupleId");
  const passcode = getText(formData, "passcode");

  if (!coupleId || !passcode || passcode.length < 4) {
    throw new Error("Missing required fields or passcode too short.");
  }

  await prisma.couple.update({
    where: { id: coupleId },
    data: { passcodeHash: hashPasscode(passcode) },
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId,
    action: "UPDATE_COUPLE_PASSCODE",
    entityType: "Couple",
    entityId: coupleId,
  });

  revalidatePath("/backend/couples");
}

// 🌟 [အသစ်] Surprise Settings များ ပြင်ဆင်ရန်
export async function updateSurpriseAction(formData: FormData) {
  const viewer = await requireAdmin();
  const coupleId = getText(formData, "coupleId");
  const surpriseMessage = getText(formData, "surpriseMessage");
  const surpriseVideoUrl = getText(formData, "surpriseVideoUrl");
  const secretNote = getText(formData, "secretNote");

  if (!coupleId) throw new Error("Couple is required.");

  await prisma.couple.update({
    where: { id: coupleId },
    data: {
      surpriseMessage: surpriseMessage || null,
      surpriseVideoUrl: surpriseVideoUrl || null,
      secretNote: secretNote || null,
    },
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId,
    action: "UPDATE_COUPLE_SURPRISE",
    entityType: "Couple",
    entityId: coupleId,
  });

  revalidatePath("/backend/couples");
}

export async function inviteMemberAction(formData: FormData) {
  const viewer = await requireAdmin();
  const coupleId = getText(formData, "coupleId");
  const email = getText(formData, "email")?.toLowerCase();

  // Role မရွေးထားလျှင် PARTNER ကို Default ယူပါမည်
  const role = (getText(formData, "role") as CoupleMemberRole) || CoupleMemberRole.PARTNER;
  if (!coupleId || !email) {
    throw new Error("Missing required fields.");
  }

  await prisma.coupleMember.create({
    data: {
      coupleId,
      email,
      role,
    },
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId,
    action: "INVITE_MEMBER",
    entityType: "CoupleMember",
    entityId: email,
    details: { role },
  });

  revalidatePath("/backend/couples");
}