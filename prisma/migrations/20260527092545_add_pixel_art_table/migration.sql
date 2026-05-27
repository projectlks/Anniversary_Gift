-- CreateTable
CREATE TABLE "PixelArt" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "pixels" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PixelArt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PixelArt_coupleId_key" ON "PixelArt"("coupleId");

-- AddForeignKey
ALTER TABLE "PixelArt" ADD CONSTRAINT "PixelArt_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;
