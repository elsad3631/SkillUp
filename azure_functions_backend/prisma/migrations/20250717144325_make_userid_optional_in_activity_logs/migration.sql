-- DropForeignKey
ALTER TABLE "UserActivityLog" DROP CONSTRAINT "UserActivityLog_userId_fkey";

-- AlterTable
ALTER TABLE "UserActivityLog" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserActivityLog" ADD CONSTRAINT "UserActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ApplicationUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
