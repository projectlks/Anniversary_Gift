-- CreateTable
CREATE TABLE "PuzzleImages" (
    "id" SERIAL NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PuzzleImages_pkey" PRIMARY KEY ("id")
);
