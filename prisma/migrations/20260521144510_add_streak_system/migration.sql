-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "refresh_token_expires_in" INTEGER;

-- AlterTable
ALTER TABLE "ClickCountTable" ADD COLUMN     "lastStackDate" TIMESTAMP(3),
ADD COLUMN     "ownerLastClick" TIMESTAMP(3),
ADD COLUMN     "partnerLastClick" TIMESTAMP(3),
ADD COLUMN     "stackCount" INTEGER NOT NULL DEFAULT 0;
