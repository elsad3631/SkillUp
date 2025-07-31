import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const mentorshipService = {
  async getAll() {
    return prisma.mentorship.findMany({
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  },

  async getById(id: string) {
    return prisma.mentorship.findUnique({
      where: { id },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      }
    });
  },

  async getByMentorId(mentorId: string) {
    return prisma.mentorship.findMany({
      where: { mentorId },
      include: {
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  },

  async getByMenteeId(menteeId: string) {
    return prisma.mentorship.findMany({
      where: { menteeId },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  },

  async getByStatus(status: string) {
    return prisma.mentorship.findMany({
      where: { status },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  },

  async getActiveMentorships() {
    return prisma.mentorship.findMany({
      where: { status: 'ACTIVE' },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  },

  async create(data: any) {
    return prisma.mentorship.create({
      data: {
        mentorId: data.mentorId,
        menteeId: data.menteeId,
        startDate: data.startDate || new Date(),
        endDate: data.endDate,
        status: data.status || 'ACTIVE',
        goals: data.goals,
        notes: data.notes,
        meetingFrequency: data.meetingFrequency,
        lastMeetingDate: data.lastMeetingDate,
        nextMeetingDate: data.nextMeetingDate,
      },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      }
    });
  },

  async update(id: string, data: any) {
    return prisma.mentorship.update({
      where: { id },
      data: {
        endDate: data.endDate,
        status: data.status,
        goals: data.goals,
        notes: data.notes,
        meetingFrequency: data.meetingFrequency,
        lastMeetingDate: data.lastMeetingDate,
        nextMeetingDate: data.nextMeetingDate,
      },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      }
    });
  },

  async remove(id: string) {
    return prisma.mentorship.delete({
      where: { id }
    });
  },

  async completeMentorship(id: string, completionNotes?: string) {
    return prisma.mentorship.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endDate: new Date(),
        notes: completionNotes // Use existing notes field
      },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      }
    });
  },

  async getCompletedMentorships() {
    return prisma.mentorship.findMany({
      where: { status: 'COMPLETED' },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      },
      orderBy: {
        endDate: 'desc'
      }
    });
  },

  async startMentorship(id: string) {
    return prisma.mentorship.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        startDate: new Date()
      },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      }
    });
  },

  async pauseMentorship(id: string, pauseReason?: string) {
    return prisma.mentorship.update({
      where: { id },
      data: {
        status: 'CANCELLED', // Use CANCELLED since PAUSED doesn't exist
        notes: pauseReason // Use existing notes field
      },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      }
    });
  },

  async resumeMentorship(id: string) {
    return prisma.mentorship.update({
      where: { id },
      data: {
        status: 'ACTIVE'
      },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      }
    });
  },

  async cancelMentorship(id: string) {
    return prisma.mentorship.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        endDate: new Date()
      },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      }
    });
  },

  async updateMeetingSchedule(id: string, lastMeetingDate: Date, nextMeetingDate: Date) {
    return prisma.mentorship.update({
      where: { id },
      data: {
        lastMeetingDate,
        nextMeetingDate
      },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      }
    });
  },

  async getMentorshipStats() {
    const totalMentorships = await prisma.mentorship.count();
    const activeMentorships = await prisma.mentorship.count({
      where: { status: 'ACTIVE' }
    });
    const completedMentorships = await prisma.mentorship.count({
      where: { status: 'COMPLETED' }
    });
    const cancelledMentorships = await prisma.mentorship.count({
      where: { status: 'CANCELLED' }
    });

    return {
      total: totalMentorships,
      active: activeMentorships,
      completed: completedMentorships,
      cancelled: cancelledMentorships,
      successRate: totalMentorships > 0 ? (completedMentorships / totalMentorships) * 100 : 0
    };
  },

  async getMentorshipStatsByMentor(mentorId: string) {
    const mentorMentorships = await prisma.mentorship.findMany({
      where: { mentorId }
    });

    const active = mentorMentorships.filter(m => m.status === 'ACTIVE').length;
    const completed = mentorMentorships.filter(m => m.status === 'COMPLETED').length;
    const cancelled = mentorMentorships.filter(m => m.status === 'CANCELLED').length;
    const total = mentorMentorships.length;

    return {
      total,
      active,
      completed,
      cancelled,
      successRate: total > 0 ? (completed / total) * 100 : 0
    };
  },

  async getMentorshipStatsByMentee(menteeId: string) {
    const menteeMentorships = await prisma.mentorship.findMany({
      where: { menteeId }
    });

    const active = menteeMentorships.filter(m => m.status === 'ACTIVE').length;
    const completed = menteeMentorships.filter(m => m.status === 'COMPLETED').length;
    const cancelled = menteeMentorships.filter(m => m.status === 'CANCELLED').length;
    const total = menteeMentorships.length;

    return {
      total,
      active,
      completed,
      cancelled,
      successRate: total > 0 ? (completed / total) * 100 : 0
    };
  },

  async getUpcomingMeetings() {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return prisma.mentorship.findMany({
      where: {
        status: 'ACTIVE',
        nextMeetingDate: {
          gte: today,
          lte: thirtyDaysFromNow
        }
      },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      },
      orderBy: {
        nextMeetingDate: 'asc'
      }
    });
  },

  async searchMentorships(searchTerm: string) {
    return prisma.mentorship.findMany({
      where: {
        OR: [
          {
            mentor: {
              OR: [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { username: { contains: searchTerm, mode: 'insensitive' } },
              ]
            }
          },
          {
            mentee: {
              OR: [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { username: { contains: searchTerm, mode: 'insensitive' } },
              ]
            }
          },
          { goals: { contains: searchTerm, mode: 'insensitive' } },
          { notes: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        mentee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }
}; 