"use server";
import { prisma } from "@/libs/prisma";
import { pusher } from "@/libs/pusher";

export async function savePixelBoardAction(coupleId: string, pixels: string[]) {
    try {
        await prisma.pixelArt.upsert({
            where: { coupleId },
            update: { pixels: JSON.stringify(pixels) },
            create: { coupleId, pixels: JSON.stringify(pixels) },
        });
        await pusher.trigger(`pixel-art-${coupleId}`, "board-updated", { pixels });
        return { success: true };
    } catch (error) {
        console.error("Pixel update error:", error);
        return { success: false };
    }
}

export async function clearPixelArtAction(coupleId: string) {
    // 🌟 24x24 အတွက် 576 ကွက် ပြောင်းလိုက်ပါသည်
    const blankPixels = Array(576).fill("#ffffff");
    await prisma.pixelArt.upsert({
        where: { coupleId },
        update: { pixels: JSON.stringify(blankPixels) },
        create: { coupleId, pixels: JSON.stringify(blankPixels) },
    });

    await pusher.trigger(`pixel-art-${coupleId}`, "board-cleared", {});
    return { success: true };
}