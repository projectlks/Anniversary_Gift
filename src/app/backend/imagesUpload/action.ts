"use server";

import { prisma } from "@/libs/prisma";

export async function uploadImageFunction(url: string): Promise<boolean> {
  try {
    await prisma.uploadedImage.create({
      data: {
        imgUrl: url,
      },
    });
    return true;
  } catch (error) {
    console.error("Error uploading image:", error);
    return false;
  }
}


export async function deleteImg(id: number): Promise<boolean> {
  try {
    await prisma.uploadedImage.update({
      where: {
        id,
      },
      data: {
        isArchived: true,
      },
    });
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}