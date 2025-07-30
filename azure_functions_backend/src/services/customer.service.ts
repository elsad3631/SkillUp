import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateCustomerDto {
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  vatNumber?: string;
  fiscalCode?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  status?: string;
  industry?: string;
  website?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export class CustomerService {
  async createCustomer(data: CreateCustomerDto) {
    return await prisma.customer.create({
      data,
      include: {
        projects: true,
        calendarEvents: true,
      },
    });
  }

  async getAllCustomers() {
    return await prisma.customer.findMany({
      include: {
        projects: {
          include: {
            assignments: true,
            requiredHardSkills: true,
            requiredSoftSkills: true,
          },
        },
        calendarEvents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getCustomerById(id: string) {
    return await prisma.customer.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            assignments: {
              include: {
                applicationUser: true,
              },
            },
            requiredHardSkills: true,
            requiredSoftSkills: true,
          },
        },
        calendarEvents: {
          include: {
            customer: true,
            project: true,
            user: true,
            createdByUser: true,
          },
        },
      },
    });
  }

  async updateCustomer(id: string, data: UpdateCustomerDto) {
    return await prisma.customer.update({
      where: { id },
      data,
      include: {
        projects: true,
        calendarEvents: true,
      },
    });
  }

  async deleteCustomer(id: string) {
    return await prisma.customer.delete({
      where: { id },
    });
  }

  async getCustomersByStatus(status: string) {
    return await prisma.customer.findMany({
      where: { status },
      include: {
        projects: true,
        calendarEvents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async searchCustomers(query: string) {
    return await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { companyName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { contactPerson: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        projects: true,
        calendarEvents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getCustomersWithProjects() {
    return await prisma.customer.findMany({
      where: {
        projects: {
          some: {},
        },
      },
      include: {
        projects: {
          include: {
            assignments: true,
            requiredHardSkills: true,
            requiredSoftSkills: true,
          },
        },
        calendarEvents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
} 