"use server";

import { logAudit } from "@/libs/audit";
import { requireAdmin } from "@/libs/authz";
import { uploadMemoryImageFile } from "@/libs/action";
import { prisma } from "@/libs/prisma";
import type { GalleryImage } from "@/types/gallery-image";

export async function uploadImageFunction(
  fileData: FormData,
  targetCoupleId?: string,
): Promise<GalleryImage | null> {
  try {
    return await uploadMemoryImageFile(fileData, targetCoupleId);
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}
export async function deleteImg(id: number): Promise<boolean> {
  try {
    // ၁။ Admin ဟုတ်/မဟုတ် စစ်ဆေးခြင်း
    const viewer = await requireAdmin();

    // ၂။ Database ထဲတွင် ပုံရှိ/မရှိ စစ်ဆေးခြင်း
    const existing = await prisma.uploadedImage.findUnique({ where: { id } });
    if (!existing) return false;

    // ၃။ Database ထဲမှ အပြီးတိုင် ဖျက်ပစ်ခြင်း (App ပေါ်တွင် လုံးဝ ပေါ်တော့မည် မဟုတ်ပါ)
    await prisma.uploadedImage.delete({
      where: { id }
    });

    // ၄။ ဘယ်သူက ဘယ်ပုံကို ဖျက်သွားလဲဆိုတာ မှတ်တမ်း (Audit Log) ရေးသွင်းခြင်း
    await logAudit({
      actorId: viewer.userId,
      coupleId: existing.coupleId,
      action: "DELETE_MEMORY_IMAGE",
      entityType: "UploadedImage",
      entityId: String(id),
    });

    console.log(`🎉 Image ID ${id} ကို Database မှ အောင်မြင်စွာ ဖျက်ပစ်လိုက်ပါပြီ။`);
    return true;
  } catch (error) {
    console.error("Error in deleteImg:", error);
    return false;
  }
}