-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "company" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_company_fkey" FOREIGN KEY ("company") REFERENCES "ApplicationUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
