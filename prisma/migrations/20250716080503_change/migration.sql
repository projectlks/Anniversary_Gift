/*
  Warnings:

  - You are about to drop the `ClickCount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ClickCount";

-- CreateTable
CREATE TABLE "ClickCountTable" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ClickCountTable_pkey" PRIMARY KEY ("id")
);
