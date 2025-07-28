-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "applicationUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_applicationUserId_fkey" FOREIGN KEY ("applicationUserId") REFERENCES "ApplicationUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
