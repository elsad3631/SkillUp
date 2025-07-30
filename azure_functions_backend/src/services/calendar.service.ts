import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateCalendarEventDto {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  eventType: string;
  status?: string;
  priority?: string;
  location?: string;
  attendees?: string[];
  createdBy: string;
  customerId?: string;
  projectId?: string;
  userId?: string;
  color?: string;
  recurrence?: string;
  recurrenceEndDate?: Date;
  isPrivate?: boolean;
}

export interface UpdateCalendarEventDto extends Partial<CreateCalendarEventDto> {}

export interface CalendarEventFilter {
  startDate?: Date;
  endDate?: Date;
  eventType?: string;
  status?: string;
  userId?: string;
  customerId?: string;
  projectId?: string;
  createdBy?: string;
}

export class CalendarService {
  async createEvent(data: CreateCalendarEventDto) {
    return await prisma.calendarEvent.create({
      data,
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
    });
  }

  async getAllEvents() {
    return await prisma.calendarEvent.findMany({
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getEventById(id: string) {
    return await prisma.calendarEvent.findUnique({
      where: { id },
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
    });
  }

  async updateEvent(id: string, data: UpdateCalendarEventDto) {
    return await prisma.calendarEvent.update({
      where: { id },
      data,
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
    });
  }

  async deleteEvent(id: string) {
    return await prisma.calendarEvent.delete({
      where: { id },
    });
  }

  async getEventsByDateRange(startDate: Date, endDate: Date) {
    return await prisma.calendarEvent.findMany({
      where: {
        OR: [
          {
            startDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            endDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: endDate } },
            ],
          },
        ],
      },
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getEventsByType(eventType: string) {
    return await prisma.calendarEvent.findMany({
      where: { eventType },
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getEventsByUser(userId: string) {
    return await prisma.calendarEvent.findMany({
      where: {
        OR: [
          { userId },
          { createdBy: userId },
          { attendees: { has: userId } },
        ],
      },
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getEventsByCustomer(customerId: string) {
    return await prisma.calendarEvent.findMany({
      where: { customerId },
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getEventsByProject(projectId: string) {
    return await prisma.calendarEvent.findMany({
      where: { projectId },
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getEventsByFilter(filter: CalendarEventFilter) {
    const where: any = {};

    if (filter.startDate && filter.endDate) {
      where.OR = [
        {
          startDate: {
            gte: filter.startDate,
            lte: filter.endDate,
          },
        },
        {
          endDate: {
            gte: filter.startDate,
            lte: filter.endDate,
          },
        },
        {
          AND: [
            { startDate: { lte: filter.startDate } },
            { endDate: { gte: filter.endDate } },
          ],
        },
      ];
    }

    if (filter.eventType) {
      where.eventType = filter.eventType;
    }

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.userId) {
      where.OR = [
        { userId: filter.userId },
        { createdBy: filter.userId },
        { attendees: { has: filter.userId } },
      ];
    }

    if (filter.customerId) {
      where.customerId = filter.customerId;
    }

    if (filter.projectId) {
      where.projectId = filter.projectId;
    }

    if (filter.createdBy) {
      where.createdBy = filter.createdBy;
    }

    return await prisma.calendarEvent.findMany({
      where,
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getUpcomingEvents(days: number = 7) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return await prisma.calendarEvent.findMany({
      where: {
        startDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getTodayEvents() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    return await prisma.calendarEvent.findMany({
      where: {
        OR: [
          {
            startDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          {
            endDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          {
            AND: [
              { startDate: { lte: startOfDay } },
              { endDate: { gte: endOfDay } },
            ],
          },
        ],
      },
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getEventsByStatus(status: string) {
    return await prisma.calendarEvent.findMany({
      where: { status },
      include: {
        customer: true,
        project: true,
        user: true,
        createdByUser: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }
} 