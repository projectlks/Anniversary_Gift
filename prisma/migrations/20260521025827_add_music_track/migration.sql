-- CreateTable
CREATE TABLE "MusicTrack" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MusicTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MusicTrack_coupleId_addedAt_idx" ON "MusicTrack"("coupleId", "addedAt");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_coupleId_createdAt_idx" ON "AuditLog"("coupleId", "createdAt");

-- CreateIndex
CREATE INDEX "ClickCountTable_coupleId_idx" ON "ClickCountTable"("coupleId");

-- CreateIndex
CREATE INDEX "CoupleMember_coupleId_idx" ON "CoupleMember"("coupleId");

-- CreateIndex
CREATE INDEX "JourneyEntry_coupleId_eventDate_idx" ON "JourneyEntry"("coupleId", "eventDate");

-- CreateIndex
CREATE INDEX "LoveNote_coupleId_idx" ON "LoveNote"("coupleId");

-- CreateIndex
CREATE INDEX "PuzzleImages_coupleId_idx" ON "PuzzleImages"("coupleId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "UploadedImage_coupleId_idx" ON "UploadedImage"("coupleId");

-- AddForeignKey
ALTER TABLE "MusicTrack" ADD CONSTRAINT "MusicTrack_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;
