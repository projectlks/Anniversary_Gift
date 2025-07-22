
"use server";


// export const runtime = "nodejs"; // 👈 IMPORTANT LINE

import { prisma } from "./prisma";


export async function incrementLoveClick() {


  await prisma.clickCountTable.update({
    where: { id: 1 }, // Assuming you have a single record to update
    data: { count: { increment: 1 } },
  })
}

export async function getTotalCounts() {
  const record = await prisma.clickCountTable.findUnique({
    where: { id: 1 },
    select: { count: true },
  });
  return record?.count ?? 0;  // record ရှိရင် count ကို return၊ မရှိရင် 0 return
}

export async function getAllImages() {
  try {
    const images = await prisma.uploadedImage.findMany({
      where: {
        isArchived: false,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    return images ?? [];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}



export async function validateCode(code: string) {
  const secretCode = process.env.APP_SECRET_CODE;

  if (code === secretCode) {

    return { valid: true };
  } else {
    return { valid: false };
  }
}


