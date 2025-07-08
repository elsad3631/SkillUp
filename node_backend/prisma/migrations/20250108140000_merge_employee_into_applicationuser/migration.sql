-- AlterTable: Add Employee fields to ApplicationUser
ALTER TABLE "ApplicationUser" ADD COLUMN "firstName" TEXT;
ALTER TABLE "ApplicationUser" ADD COLUMN "lastName" TEXT;
ALTER TABLE "ApplicationUser" ADD COLUMN "dateOfBirth" TIMESTAMP(3);
ALTER TABLE "ApplicationUser" ADD COLUMN "placeOfBirth" TEXT;
ALTER TABLE "ApplicationUser" ADD COLUMN "address" TEXT;
ALTER TABLE "ApplicationUser" ADD COLUMN "phone" TEXT;
ALTER TABLE "ApplicationUser" ADD COLUMN "currentRole" TEXT;
ALTER TABLE "ApplicationUser" ADD COLUMN "department" TEXT;
ALTER TABLE "ApplicationUser" ADD COLUMN "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- Step 1: For ApplicationUsers that have a linked Employee, merge the data
UPDATE "ApplicationUser" 
SET 
    "firstName" = e."firstName",
    "lastName" = e."lastName", 
    "dateOfBirth" = e."dateOfBirth",
    "placeOfBirth" = e."placeOfBirth",
    "address" = e."address",
    "phone" = e."phone",
    "currentRole" = e."currentRole",
    "department" = e."department",
    "isAvailable" = e."isAvailable"
FROM "Employee" e
WHERE "ApplicationUser"."employeeId" = e."id";

-- Step 2: For Employees without ApplicationUser, create new ApplicationUser records
INSERT INTO "ApplicationUser" ("id", "username", "email", "passwordHash", "roles", "firstName", "lastName", "dateOfBirth", "placeOfBirth", "address", "phone", "currentRole", "department", "isAvailable")
SELECT 
    e."id",
    COALESCE(LOWER(REPLACE(e."email", '@', '_at_')), 'user_' || e."id"),  -- Generate username from email
    e."email",
    'temp_password_hash_' || e."id",  -- Temporary password hash - should be updated
    ARRAY['employee']::TEXT[],  -- Default role as employee
    e."firstName",
    e."lastName",
    e."dateOfBirth", 
    e."placeOfBirth",
    e."address",
    e."phone",
    e."currentRole",
    e."department",
    e."isAvailable"
FROM "Employee" e
WHERE e."id" NOT IN (SELECT "employeeId" FROM "ApplicationUser" WHERE "employeeId" IS NOT NULL);

-- Step 3: Add new columns to related tables for ApplicationUser relationships
ALTER TABLE "CVData" ADD COLUMN "applicationUserId" TEXT;
ALTER TABLE "Experience" ADD COLUMN "applicationUserId" TEXT;
ALTER TABLE "EmployeeSkill" ADD COLUMN "applicationUserHardId" TEXT;
ALTER TABLE "EmployeeSkill" ADD COLUMN "applicationUserSoftId" TEXT;
ALTER TABLE "ProjectAssignment" ADD COLUMN "applicationUserId" TEXT;

-- Step 4: Copy existing relationships to point to ApplicationUser
-- Update CVData
UPDATE "CVData" 
SET "applicationUserId" = "employeeId"
WHERE "employeeId" IS NOT NULL;

-- Update Experience
UPDATE "Experience" 
SET "applicationUserId" = "employeeId"
WHERE "employeeId" IS NOT NULL;

-- Update EmployeeSkill hard skills
UPDATE "EmployeeSkill" 
SET "applicationUserHardId" = "employeeHardId"
WHERE "employeeHardId" IS NOT NULL;

-- Update EmployeeSkill soft skills
UPDATE "EmployeeSkill" 
SET "applicationUserSoftId" = "employeeSoftId"
WHERE "employeeSoftId" IS NOT NULL;

-- Update ProjectAssignment
UPDATE "ProjectAssignment" 
SET "applicationUserId" = "employeeId"
WHERE "employeeId" IS NOT NULL;

-- Step 5: Make new columns NOT NULL where required and add constraints
ALTER TABLE "Experience" ALTER COLUMN "applicationUserId" SET NOT NULL;
ALTER TABLE "ProjectAssignment" ALTER COLUMN "applicationUserId" SET NOT NULL;

-- Step 6: Add foreign key constraints
ALTER TABLE "CVData" ADD CONSTRAINT "CVData_applicationUserId_fkey" 
    FOREIGN KEY ("applicationUserId") REFERENCES "ApplicationUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Experience" ADD CONSTRAINT "Experience_applicationUserId_fkey" 
    FOREIGN KEY ("applicationUserId") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "EmployeeSkill" ADD CONSTRAINT "EmployeeSkill_applicationUserHardId_fkey" 
    FOREIGN KEY ("applicationUserHardId") REFERENCES "ApplicationUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EmployeeSkill" ADD CONSTRAINT "EmployeeSkill_applicationUserSoftId_fkey" 
    FOREIGN KEY ("applicationUserSoftId") REFERENCES "ApplicationUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_applicationUserId_fkey" 
    FOREIGN KEY ("applicationUserId") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 7: Add unique constraint for CVData
ALTER TABLE "CVData" ADD CONSTRAINT "CVData_applicationUserId_key" UNIQUE ("applicationUserId");

-- Step 8: Drop old foreign key constraints and columns
ALTER TABLE "ApplicationUser" DROP CONSTRAINT IF EXISTS "ApplicationUser_employeeId_fkey";
ALTER TABLE "CVData" DROP CONSTRAINT IF EXISTS "CVData_employeeId_fkey";
ALTER TABLE "Experience" DROP CONSTRAINT IF EXISTS "Experience_employeeId_fkey";
ALTER TABLE "EmployeeSkill" DROP CONSTRAINT IF EXISTS "EmployeeSkill_employeeHardId_fkey";
ALTER TABLE "EmployeeSkill" DROP CONSTRAINT IF EXISTS "EmployeeSkill_employeeSoftId_fkey";
ALTER TABLE "ProjectAssignment" DROP CONSTRAINT IF EXISTS "ProjectAssignment_employeeId_fkey";

-- Step 9: Drop old columns
ALTER TABLE "ApplicationUser" DROP COLUMN "employeeId";
ALTER TABLE "CVData" DROP COLUMN "employeeId";
ALTER TABLE "Experience" DROP COLUMN "employeeId";
ALTER TABLE "EmployeeSkill" DROP COLUMN "employeeHardId";
ALTER TABLE "EmployeeSkill" DROP COLUMN "employeySoftId";
ALTER TABLE "ProjectAssignment" DROP COLUMN "employeeId";

-- Step 10: Drop the Employee table
DROP TABLE "Employee"; 