/*
  Warnings:

  - You are about to drop the column `maxPuzzleImages` on the `Couple` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Couple" DROP COLUMN "maxPuzzleImages",
ADD COLUMN     "secretNote" TEXT,
ADD COLUMN     "surpriseMessage" TEXT,
ADD COLUMN     "surpriseVideoUrl" TEXT;

-- CreateTable
CREATE TABLE "ShortNote" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'bg-[#FFF3A3]',
    "x" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "y" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reactions" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShortNote_coupleId_idx" ON "ShortNote"("coupleId");

-- AddForeignKey
ALTER TABLE "ShortNote" ADD CONSTRAINT "ShortNote_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;
