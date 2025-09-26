-- AlterTable
ALTER TABLE "ApplicationUser" ADD COLUMN "fiscalCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_fiscalCode_key" ON "ApplicationUser"("fiscalCode");
