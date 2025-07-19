-- CreateTable
CREATE TABLE "UploadedImage" (
    "id" SERIAL NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UploadedImage_pkey" PRIMARY KEY ("id")
);
