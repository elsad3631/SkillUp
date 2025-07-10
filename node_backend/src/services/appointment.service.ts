import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const appointmentService = {
  async getAll() {
    return prisma.projectAssignment.findMany();
  },
  async getById(id: string) {
    return prisma.projectAssignment.findUnique({ where: { id } });
  },
  async create(data: any) {
    // Trasforma i dati per Prisma
    const transformedData = {
      applicationUserId: data.applicationUserId?.trim(),
      projectId: data.projectId?.trim(),
      roleOnProject: data.roleOnProject?.trim(),
      assignmentStartDate: data.assignmentStartDate 
        ? new Date(data.assignmentStartDate.trim() + 'T00:00:00.000Z')
        : new Date(),
      assignmentEndDate: data.assignmentEndDate 
        ? new Date(data.assignmentEndDate.trim() + 'T23:59:59.999Z')
        : undefined,
      allocationPercentage: parseInt(data.allocationPercentage),
      status: data.status?.trim(),
      feedbackReceived: data.feedbackReceived?.trim() || null,
    };

    return prisma.projectAssignment.create({ data: transformedData });
  },
  async update(id: string, data: any) {
    // Trasforma i dati per Prisma (simile al create)
    const transformedData: any = {};
    
    if (data.applicationUserId) transformedData.applicationUserId = data.applicationUserId.trim();
    if (data.projectId) transformedData.projectId = data.projectId.trim();
    if (data.roleOnProject) transformedData.roleOnProject = data.roleOnProject.trim();
    if (data.assignmentStartDate) {
      transformedData.assignmentStartDate = new Date(data.assignmentStartDate.trim() + 'T00:00:00.000Z');
    }
    if (data.assignmentEndDate) {
      transformedData.assignmentEndDate = new Date(data.assignmentEndDate.trim() + 'T23:59:59.999Z');
    }
    if (data.allocationPercentage !== undefined) {
      transformedData.allocationPercentage = parseInt(data.allocationPercentage);
    }
    if (data.status) transformedData.status = data.status.trim();
    if (data.feedbackReceived) transformedData.feedbackReceived = data.feedbackReceived.trim();

    return prisma.projectAssignment.update({ where: { id }, data: transformedData });
  },
  async remove(id: string) {
    return prisma.projectAssignment.delete({ where: { id } });
  },
}; 