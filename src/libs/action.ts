
"use server";



import { prisma } from "./prisma";


export async function incrementLoveClick() {


  await prisma.clickCountTable.update({
    where: { id: 1 }, // Assuming you have a single record to update
    data: { count: { increment: 1 } },
  })
}

export async function getTotalCounts() {
  let record = await prisma.clickCountTable.findUnique({
    where: { id: 1 },
    select: { count: true },
  });

  if (!record) {
    await prisma.clickCountTable.create({
      data: {
        id: 1,
        count: 0,
      },
    });

    // Fetch the record again after creation
    record = { count: 0 };
  }

  return record.count;
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


