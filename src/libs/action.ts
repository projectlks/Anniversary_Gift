"use server";

import { CoupleMemberStatus } from "@prisma/client";
import { logAudit } from "@/libs/audit";
import { resolveCoupleScope, requireAdmin, requireViewerContext } from "@/libs/authz";
import {
  DRIVE_IMAGE_FOLDER_NAME,
  DRIVE_MUSIC_FOLDER_NAME,
  DRIVE_ROOT_FOLDER_NAME,
  getOrCreateFolder,
  getOrCreateSubFolder,
  initializeDriveClient,
  uploadFileToDrive,
  type DriveUploadResult,
} from "@/libs/drive";
import { prisma } from "@/libs/prisma";
import type { GalleryImage } from "@/types/gallery-image";

type UploadType = "image" | "music";

type PreparedUploadFile = {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
};

type DriveUploadActionResult = DriveUploadResult & {
  fileName: string;
  mimeType: string;
};

const uploadFolderByType: Record<UploadType, string> = {
  image: DRIVE_IMAGE_FOLDER_NAME,
  music: DRIVE_MUSIC_FOLDER_NAME,
};

const uploadEntityByType: Record<UploadType, "UploadedImage" | "MusicTrack"> = {
  image: "UploadedImage",
  music: "MusicTrack",
};

function sanitizeFileName(fileName: string) {
  const cleaned = fileName.replace(/[\\/:*?"<>|]+/g, "-").trim();
  return cleaned || `upload-${Date.now()}`;
}

function isFileLike(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "name" in value &&
    "size" in value &&
    "type" in value
  );
}

// src/libs/action.ts (သို့မဟုတ် သက်ဆိုင်ရာ action ဖိုင်) တွင် ထည့်ရန်

// 🌟 ယူဆာကိုယ်တိုင် ပုံတင်ရန် သီးသန့် Action (Couple ID အလိုလို ယူပေးမည်)
export async function uploadUserImageAction(fileData: FormData) {
  try {
    // ၁။ လက်ရှိ ဝင်ထားသော ယူဆာကို စစ်ဆေးခြင်း
    const viewer = await requireViewerContext();

    if (!viewer.coupleId) {
      throw new Error("သင်သည် စုံတွဲအကောင့်ထဲတွင် မရှိသေးပါ။");
    }

    // ၂။ ယူဆာ၏ ကိုယ်ပိုင် coupleId ကိုသာ အသုံးပြု၍ Admin ၏ Upload Function ကို ပြန်ခေါ်ခြင်း
    // (uploadMemoryImageFile သည် အစ်ကို အရင်ကတည်းက ရေးထားပြီးသား Function ဖြစ်သည်)
    return await uploadMemoryImageFile(fileData, viewer.coupleId);
  } catch (error) {
    console.error("User upload error:", error);
    return null;
  }
}

function hasImageExtension(fileName: string) {
  return /\.(avif|gif|jpe?g|png|webp)$/i.test(fileName);
}

function hasMusicExtension(fileName: string) {
  return /\.(aac|flac|m4a|mp3|oga|ogg|wav|webm)$/i.test(fileName);
}

function fallbackMimeType(fileName: string, type: UploadType) {
  if (type === "image") {
    if (/\.png$/i.test(fileName)) return "image/png";
    if (/\.webp$/i.test(fileName)) return "image/webp";
    if (/\.gif$/i.test(fileName)) return "image/gif";
    if (/\.avif$/i.test(fileName)) return "image/avif";
    return "image/jpeg";
  }

  if (/\.wav$/i.test(fileName)) return "audio/wav";
  if (/\.m4a$/i.test(fileName)) return "audio/mp4";
  if (/\.ogg|\.oga$/i.test(fileName)) return "audio/ogg";
  if (/\.webm$/i.test(fileName)) return "audio/webm";
  if (/\.flac$/i.test(fileName)) return "audio/flac";
  if (/\.aac$/i.test(fileName)) return "audio/aac";
  return "audio/mpeg";
}

function assertAllowedFile(fileName: string, mimeType: string, type: UploadType) {
  const isAllowed =
    type === "image"
      ? mimeType.startsWith("image/") || hasImageExtension(fileName)
      : mimeType.startsWith("audio/") || hasMusicExtension(fileName);

  if (!isAllowed) {
    throw new Error(type === "image" ? "Please upload an image file." : "Please upload an audio file.");
  }
}

// async function readUploadFile(fileData: FormData, type: UploadType): Promise<PreparedUploadFile> {
//   const uploadedFile = fileData.get("file");

//   if (!isFileLike(uploadedFile) || uploadedFile.size <= 0) {
//     throw new Error("No upload file was provided.");
//   }

//   const fileName = sanitizeFileName(uploadedFile.name);
//   const mimeType = uploadedFile.type || fallbackMimeType(fileName, type);
//   assertAllowedFile(fileName, mimeType, type);

//   return {
//     buffer: Buffer.from(await uploadedFile.arrayBuffer()),
//     fileName,
//     mimeType,
//   };
// }
async function readUploadFile(fileData: FormData, type: UploadType): Promise<PreparedUploadFile> {
  const uploadedFile = fileData.get("file");

  if (!isFileLike(uploadedFile) || uploadedFile.size <= 0) {
    throw new Error("No upload file was provided.");
  }

  // 🌟 ပြင်ဆင်ချက်: Backend ၏ အလုံခြုံဆုံး File Size ကန့်သတ်ချက်များ
  const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // ပုံအတွက် 20 MB (မည်သည့်ဖုန်းဖြင့်ရိုက်ရိုက် အဆင်ပြေပါသည်)
  const MAX_MUSIC_SIZE = 15 * 1024 * 1024; // သီချင်းအတွက် 15 MB

  if (type === "image" && uploadedFile.size > MAX_IMAGE_SIZE) {
    throw new Error("ပုံအရွယ်အစားသည် 20MB ထက် မကျော်လွန်ရပါ။");
  }

  if (type === "music" && uploadedFile.size > MAX_MUSIC_SIZE) {
    throw new Error("သီချင်းအရွယ်အစားသည် 15MB ထက် မကျော်လွန်ရပါ။");
  }

  // မူလရှိပြီးသား Code များ ဆက်လုပ်ရန်...
  const fileName = sanitizeFileName(uploadedFile.name);
  const mimeType = uploadedFile.type || fallbackMimeType(fileName, type);
  assertAllowedFile(fileName, mimeType, type);

  return {
    buffer: Buffer.from(await uploadedFile.arrayBuffer()),
    fileName,
    mimeType,
  };
}
async function findGoogleAccountForUser(userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "google",
    },
    select: {
      userId: true,
      refresh_token: true,
    },
  });

  if (!account?.refresh_token) {
    throw new Error("Google Drive access is missing. Sign in with Google again and grant Drive permission.");
  }

  return {
    userId: account.userId,
    refresh_token: account.refresh_token,
  };
}

async function findGoogleAccountForCouple(coupleId: string) {
  const memberships = await prisma.coupleMember.findMany({
    where: {
      coupleId,
      userId: { not: null },
      status: { in: [CoupleMemberStatus.ACTIVE, CoupleMemberStatus.INVITED] },
    },
    orderBy: [{ joinedAt: "desc" }, { invitedAt: "asc" }],
    select: {
      userId: true,
    },
  });

  const userIds = Array.from(
    new Set(memberships.flatMap((membership) => (membership.userId ? [membership.userId] : []))),
  );

  if (userIds.length === 0) {
    throw new Error("No Google user is linked to this couple yet.");
  }

  const accounts = await prisma.account.findMany({
    where: {
      userId: { in: userIds },
      provider: "google",
    },
    select: {
      userId: true,
      refresh_token: true,
    },
  });

  const account = accounts.find((item) => item.refresh_token);
  if (!account?.refresh_token) {
    throw new Error("This couple does not have a Google Drive refresh token yet.");
  }

  return {
    userId: account.userId,
    refresh_token: account.refresh_token,
  };
}

async function uploadFileWithToken(
  refreshToken: string,
  file: PreparedUploadFile,
  type: UploadType,
): Promise<DriveUploadActionResult> {
  const driveClient = initializeDriveClient(refreshToken);
  const rootFolderId = await getOrCreateFolder(driveClient, DRIVE_ROOT_FOLDER_NAME);
  const folderId = await getOrCreateSubFolder(driveClient, rootFolderId, uploadFolderByType[type]);
  const upload = await uploadFileToDrive(driveClient, file.buffer, file.fileName, file.mimeType, folderId);

  return {
    ...upload,
    fileName: file.fileName,
    mimeType: file.mimeType,
  };
}

async function uploadCoupleFileToDrive({
  coupleId,
  fileData,
  type,
  driveOwnerUserId,
}: {
  coupleId: string;
  fileData: FormData;
  type: UploadType;
  driveOwnerUserId?: string;
}) {
  const file = await readUploadFile(fileData, type);
  const account = driveOwnerUserId
    ? await findGoogleAccountForUser(driveOwnerUserId)
    : await findGoogleAccountForCouple(coupleId);

  return uploadFileWithToken(account.refresh_token, file, type);
}

export async function adminUploadFile(
  targetCoupleId: string,
  fileData: FormData,
  type: UploadType,
) {
  const viewer = await requireAdmin();

  const couple = await prisma.couple.findFirst({
    where: { id: targetCoupleId, isArchived: false },
    select: { id: true },
  });

  if (!couple) {
    throw new Error("NO_COUPLE_FOUND");
  }

  const upload = await uploadCoupleFileToDrive({
    coupleId: couple.id,
    fileData,
    type,
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId: couple.id,
    action: "DRIVE_UPLOAD",
    entityType: uploadEntityByType[type],
    details: {
      fileName: upload.fileName,
      driveLink: upload.driveLink,
    },
  });

  return upload;
}

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


import { startOfDay, differenceInDays } from "date-fns";

// ... (အခြား import များနှင့် function များ)

export async function processStackClickAction() {
  try {
    const viewer = await requireViewerContext();
    if (!viewer.coupleId || !viewer.userId) {
      return { success: false, message: "Unauthorized", currentStack: 0 };
    }

    // ၁။ လက်ရှိ ယူဆာ၏ Role ကို ရှာပါမည်
    const member = await prisma.coupleMember.findFirst({
      where: { coupleId: viewer.coupleId, userId: viewer.userId }
    });
    if (!member) return { success: false, message: "Member not found", currentStack: 0 };

    const isOwner = member.role === "OWNER";
    const now = new Date();
    const todayStart = startOfDay(now);

    // ၂။ Data ဆွဲထုတ်မည် / မရှိရင် အသစ်လုပ်မည်
    let clickData = await prisma.clickCountTable.findUnique({
      where: { coupleId: viewer.coupleId }
    });

    if (!clickData) {
      clickData = await prisma.clickCountTable.create({
        data: { coupleId: viewer.coupleId }
      });
    }

    let { stackCount, ownerLastClick, partnerLastClick } = clickData;
    const { lastStackDate, count } = clickData;

    // ၃။ The Risk Rule (၂ ရက်ခြားသွားရင် 0 ပြန်စမည်)
    if (lastStackDate) {
      const daysMissed = differenceInDays(todayStart, startOfDay(lastStackDate));
      if (daysMissed > 1) {
        stackCount = 0;
        ownerLastClick = null;
        partnerLastClick = null;
      }
    }

    // ၄။ ဒီနေ့အတွက် နှိပ်ပြီးသားလား စစ်မည်
    const myLastClick = isOwner ? ownerLastClick : partnerLastClick;
    if (myLastClick && startOfDay(myLastClick).getTime() === todayStart.getTime()) {
      return {
        success: false,
        message: "ဒီနေ့အတွက် နှိပ်ပြီးပါပြီ။ ချစ်သူ နှိပ်တာကို စောင့်ပေးပါ 💖",
        currentStack: stackCount
      };
    }

    // ၅။ The Mutual Rule (နှစ်ယောက်လုံး နှိပ်မှ ၁ တိုးမည်)
    const newOwnerClick = isOwner ? now : ownerLastClick;
    const newPartnerClick = !isOwner ? now : partnerLastClick;

    let newLastStackDate = lastStackDate;
    let isLevelUp = false;

    if (
      newOwnerClick && startOfDay(newOwnerClick).getTime() === todayStart.getTime() &&
      newPartnerClick && startOfDay(newPartnerClick).getTime() === todayStart.getTime()
    ) {
      stackCount += 1;
      newLastStackDate = now;
      isLevelUp = true;
    }

    // ၆။ Database သို့ Save မည်
    await prisma.clickCountTable.update({
      where: { coupleId: viewer.coupleId },
      data: {
        count: count + 1, // Raw click count လည်း သိမ်းမည်
        stackCount,
        ownerLastClick: newOwnerClick,
        partnerLastClick: newPartnerClick,
        lastStackDate: newLastStackDate
      }
    });

    return {
      success: true,
      currentStack: stackCount,
      isLevelUp: isLevelUp, // 🌟 UI တွင် Animation ပြရန် အချက်ပြ
      message: isLevelUp ? `Wow! Stack ${stackCount} ခု ပြည့်သွားပါပြီ! 🔥` : "အိုကေ! သူ နှိပ်ဖို့ပဲ ကျန်တော့တယ် ✨"
    };

  } catch (error) {
    console.error("Stack processing error:", error);
    return { success: false, message: "တစ်ခုခု မှားယွင်းနေပါသည်။", currentStack: 0 };
  }
}

// src/libs/action.ts (ဖိုင်အောက်ခြေနားတွင် ပေါင်းထည့်ပါ)

export async function getInitialStackData() {
  try {
    const viewer = await requireViewerContext();
    if (!viewer.coupleId || !viewer.userId) return null;

    const clickData = await prisma.clickCountTable.findUnique({
      where: { coupleId: viewer.coupleId }
    });

    return {
      initialCount: clickData?.stackCount ?? 0,
      coupleId: viewer.coupleId,
      userId: viewer.userId
    };
  } catch (error) {
    console.error("Failed to fetch initial stack data:", error);
    return null;
  }
}

export async function incrementCoupleStack(coupleId: string, userId: string) {
  try {
    // လက်ရှိအချိန်ကို ယူပါမည်
    const now = new Date();

    // Owner လား Partner လား ခွဲခြားပြီး LastClick Update လုပ်ရန် Logic (ရွေးချယ်စရာ)
    // လောလောဆယ် ရိုးရှင်းအောင် အောက်ပါအတိုင်း ရေးပါမည်
    const updated = await prisma.clickCountTable.update({
      where: { coupleId: coupleId },
      data: {
        stackCount: { increment: 1 }, // ရှိပြီးသားကို ၁ တိုးမည်
        lastStackDate: now,
      },
    });

    return { success: true, count: updated.stackCount };
  } catch (error) {
    console.error("Stack update error:", error);
    return { success: false, error: "Failed to update stack" };
  }
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
export async function uploadMemoryImageFile(
  fileData: FormData,
  targetCoupleId?: string,
): Promise<GalleryImage> {
  const { viewer, couple } = await resolveCoupleScope(targetCoupleId);

  // if (!viewer.isAdmin && !viewer.canEdit) {
  //   throw new Error("FORBIDDEN");
  // }

  if (!viewer.isAdmin && viewer.coupleId !== couple.id) {
    throw new Error("FORBIDDEN: ပုံတင်ရန် ခွင့်ပြုချက် မရှိပါ။");
  }

  const currentCount = await prisma.uploadedImage.count({
    where: { coupleId: couple.id, isArchived: false },
  });

  if (currentCount >= couple.maxMemories) {
    throw new Error("Memory image limit reached for this couple.");
  }

  // 🌟 [အသစ်] ဒီ Couple ရဲ့ OWNER (Master Account) ကို Database မှ ရှာပါမည်
  const ownerMember = await prisma.coupleMember.findFirst({
    where: { coupleId: couple.id, role: "OWNER" },
  });

  if (!ownerMember || !ownerMember.userId) {
    throw new Error("Master Account (Owner) ကို ရှာမတွေ့ပါ။ ပုံသိမ်းဆည်းရန် နေရာမရှိပါ။");
  }

  // 🌟 [အသစ်ပြင်ဆင်ချက်] viewer.userId အစား ownerMember.userId ကို အမြဲတမ်း အသုံးပြုပါမည်
  const upload = await uploadCoupleFileToDrive({
    coupleId: couple.id,
    fileData,
    type: "image",
    // ဘယ်သူပဲတင်တင် (Admin ဖြစ်စေ၊ Partner ဖြစ်စေ) Owner ရဲ့ Drive ကိုပဲ သွားပါမည်
    driveOwnerUserId: ownerMember.userId,
  });

  const created = await prisma.uploadedImage.create({
    data: {
      imgUrl: upload.driveLink,
      coupleId: couple.id,
      // ပုံတင်တဲ့သူ (Uploader) ရဲ့ မှတ်တမ်းကိုတော့ လက်ရှိလူအတိုင်း အမှန်ပဲ မှတ်ထားပါမည်
      createdById: viewer.userId,
    },
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId: couple.id,
    action: "DRIVE_UPLOAD",
    entityType: "UploadedImage",
    entityId: String(created.id),
    details: {
      fileName: upload.fileName,
      driveLink: upload.driveLink,
    },
  });

  return {
    id: created.id,
    coupleId: created.coupleId,
    createdById: created.createdById,
    imgUrl: created.imgUrl,
    uploadedAt: created.uploadedAt.toISOString(),
    isArchived: created.isArchived,
  };
}

export async function uploadPuzzleImageFile(
  fileData: FormData,
  targetCoupleId?: string,
) {
  const { viewer, couple } = await resolveCoupleScope(targetCoupleId);

  if (!viewer.isAdmin) {
    throw new Error("FORBIDDEN");
  }

  const currentCount = await prisma.puzzleImages.count({
    where: { coupleId: couple.id, isArchived: false },
  });

  if (currentCount >= couple.maxPuzzleImages) {
    throw new Error("Puzzle image limit reached for this couple.");
  }

  const upload = await uploadCoupleFileToDrive({
    coupleId: couple.id,
    fileData,
    type: "image",
  });

  const created = await prisma.puzzleImages.create({
    data: {
      imgUrl: upload.driveLink,
      coupleId: couple.id,
      createdById: viewer.userId,
    },
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId: couple.id,
    action: "DRIVE_UPLOAD",
    entityType: "PuzzleImages",
    entityId: String(created.id),
    details: {
      fileName: upload.fileName,
      driveLink: upload.driveLink,
    },
  });

  return true;
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

export async function getMusicTracks(targetCoupleId: string) {
  const { couple } = await resolveCoupleScope(targetCoupleId);

  return prisma.musicTrack.findMany({
    where: { coupleId: couple.id },
    orderBy: { addedAt: "asc" },
  });
}

export async function addMusicTrack(name: string, url: string, targetCoupleId: string) {
  const { couple } = await resolveCoupleScope(targetCoupleId);

  const existingTrack = await prisma.musicTrack.findFirst({
    where: {
      coupleId: couple.id,
      url,
    },
  });

  if (existingTrack) {
    throw new Error("This track is already in the playlist.");
  }

  return prisma.musicTrack.create({
    data: {
      name,
      url,
      coupleId: couple.id,
    },
  });
}

export async function uploadMusicFile(fileData: FormData, targetCoupleId: string) {
  const { viewer, couple } = await resolveCoupleScope(targetCoupleId);

  const upload = await uploadCoupleFileToDrive({
    coupleId: couple.id,
    fileData,
    type: "music",
    driveOwnerUserId: viewer.isAdmin ? undefined : viewer.userId,
  });

  const created = await prisma.musicTrack.create({
    data: {
      name: upload.fileName.replace(/\.[^/.]+$/, ""),
      url: upload.driveLink,
      coupleId: couple.id,
    },
  });

  await logAudit({
    actorId: viewer.userId,
    coupleId: couple.id,
    action: "DRIVE_UPLOAD",
    entityType: "MusicTrack",
    entityId: created.id,
    details: {
      fileName: upload.fileName,
      driveLink: upload.driveLink,
    },
  });

  return {
    id: created.id,
    name: created.name,
    url: created.url,
  };
}

export async function getYouTubeTitle(url: string) {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    );

    if (!response.ok) return null;

    const data = (await response.json()) as { title?: unknown };
    return typeof data.title === "string" ? data.title : null;
  } catch (error) {
    console.error("Failed to fetch YouTube title:", error);
    return null;
  }
}
