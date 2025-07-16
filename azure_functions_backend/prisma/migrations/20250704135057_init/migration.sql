-- CreateTable
CREATE TABLE "ApplicationUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "roles" TEXT[],
    "employeeId" TEXT,

    CONSTRAINT "ApplicationUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "currentRole" TEXT,
    "department" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CVData" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL,
    "parsedVersion" INTEGER,
    "employeeId" TEXT,

    CONSTRAINT "CVData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "technologiesUsed" TEXT[],
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSkill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "proficiencyLevel" INTEGER,
    "lastUsed" TIMESTAMP(3),
    "certification" TEXT,
    "employeeHardId" TEXT,
    "employeeSoftId" TEXT,

    CONSTRAINT "EmployeeSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "requiredSoftSkills" TEXT[],
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "managerId" TEXT,
    "budget" DOUBLE PRECISION,
    "priority" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillRequirement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minProficiencyLevel" INTEGER NOT NULL,
    "isMandatory" BOOLEAN NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "SkillRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAssignment" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "roleOnProject" TEXT NOT NULL,
    "assignmentStartDate" TIMESTAMP(3) NOT NULL,
    "assignmentEndDate" TIMESTAMP(3),
    "allocationPercentage" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "feedbackReceived" TEXT,

    CONSTRAINT "ProjectAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillTraining" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "provider" TEXT,
    "url" TEXT,
    "estimatedDurationHours" INTEGER NOT NULL,
    "skillsDeveloped" TEXT[],
    "level" TEXT,
    "cost" DOUBLE PRECISION,

    CONSTRAINT "SkillTraining_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_username_key" ON "ApplicationUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_email_key" ON "ApplicationUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_employeeId_key" ON "ApplicationUser"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CVData_employeeId_key" ON "CVData"("employeeId");

-- AddForeignKey
ALTER TABLE "ApplicationUser" ADD CONSTRAINT "ApplicationUser_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CVData" ADD CONSTRAINT "CVData_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSkill" ADD CONSTRAINT "EmployeeSkill_employeeHardId_fkey" FOREIGN KEY ("employeeHardId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSkill" ADD CONSTRAINT "EmployeeSkill_employeeSoftId_fkey" FOREIGN KEY ("employeeSoftId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRequirement" ADD CONSTRAINT "SkillRequirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
