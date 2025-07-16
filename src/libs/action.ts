
"use server";


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
