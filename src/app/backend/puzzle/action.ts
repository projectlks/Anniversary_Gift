"use server";

import { prisma } from "@/libs/prisma";

export async function uploadImageFunction(url: string): Promise<boolean> {
  try {
    await prisma.puzzleImages.create({
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

export async function getAllPuzzleImages() {
  try {
    const images = await prisma.puzzleImages.findMany({
      where: {
        isArchived: false,
      },
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
    await prisma.puzzleImages.update({
      where: {
        id: id,
      },
      data: {
        isArchived: true,
      },
    });
    return true; // optionally return success
  } catch (error) {
    console.error('Error archiving puzzle image:', error);
    return false; // optionally return failure
  }
}
