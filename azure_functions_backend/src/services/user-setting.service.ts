import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const userSettingService = {
  async getAll() {
    return prisma.userSetting.findMany({
      include: {
        user: {
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
        updatedAt: 'desc'
      }
    });
  },

  async getById(id: string) {
    return prisma.userSetting.findUnique({
      where: { id },
      include: {
        user: {
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

  async getByUserId(userId: string) {
    return prisma.userSetting.findUnique({
      where: { userId },
      include: {
        user: {
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

  async create(data: any) {
    return prisma.userSetting.create({
      data: {
        userId: data.userId,
        theme: data.theme || 'LIGHT',
        language: data.language || 'IT',
        timezone: data.timezone || 'Europe/Rome',
        dateFormat: data.dateFormat || 'DD/MM/YYYY',
        timeFormat: data.timeFormat || '24H',
        notificationPreferences: data.notificationPreferences,
        dashboardLayout: data.dashboardLayout,
        emailNotifications: data.emailNotifications !== undefined ? data.emailNotifications : true,
        pushNotifications: data.pushNotifications !== undefined ? data.pushNotifications : true,
      },
      include: {
        user: {
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

  async update(userId: string, data: any) {
    return prisma.userSetting.update({
      where: { userId },
      data: {
        theme: data.theme,
        language: data.language,
        timezone: data.timezone,
        dateFormat: data.dateFormat,
        timeFormat: data.timeFormat,
        notificationPreferences: data.notificationPreferences,
        dashboardLayout: data.dashboardLayout,
        emailNotifications: data.emailNotifications,
        pushNotifications: data.pushNotifications,
      },
      include: {
        user: {
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

  async updateTheme(userId: string, theme: string) {
    return prisma.userSetting.update({
      where: { userId },
      data: { theme },
      include: {
        user: {
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

  async updateLanguage(userId: string, language: string) {
    return prisma.userSetting.update({
      where: { userId },
      data: { language },
      include: {
        user: {
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

  async updateTimezone(userId: string, timezone: string) {
    return prisma.userSetting.update({
      where: { userId },
      data: { timezone },
      include: {
        user: {
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

  async updateNotificationPreferences(userId: string, preferences: any) {
    return prisma.userSetting.update({
      where: { userId },
      data: { notificationPreferences: preferences },
      include: {
        user: {
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

  async updateDashboardLayout(userId: string, layout: any) {
    return prisma.userSetting.update({
      where: { userId },
      data: { dashboardLayout: layout },
      include: {
        user: {
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

  async toggleEmailNotifications(userId: string) {
    const currentSettings = await prisma.userSetting.findUnique({
      where: { userId }
    });

    if (!currentSettings) {
      throw new Error('User settings not found');
    }

    return prisma.userSetting.update({
      where: { userId },
      data: { emailNotifications: !currentSettings.emailNotifications },
      include: {
        user: {
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

  async togglePushNotifications(userId: string) {
    const currentSettings = await prisma.userSetting.findUnique({
      where: { userId }
    });

    if (!currentSettings) {
      throw new Error('User settings not found');
    }

    return prisma.userSetting.update({
      where: { userId },
      data: { pushNotifications: !currentSettings.pushNotifications },
      include: {
        user: {
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

  async remove(userId: string) {
    return prisma.userSetting.delete({
      where: { userId }
    });
  },

  async getSettingsStats() {
    const totalSettings = await prisma.userSetting.count();
    const lightThemeUsers = await prisma.userSetting.count({
      where: { theme: 'LIGHT' }
    });
    const darkThemeUsers = await prisma.userSetting.count({
      where: { theme: 'DARK' }
    });
    const autoThemeUsers = await prisma.userSetting.count({
      where: { theme: 'AUTO' }
    });
    const emailNotificationsEnabled = await prisma.userSetting.count({
      where: { emailNotifications: true }
    });
    const pushNotificationsEnabled = await prisma.userSetting.count({
      where: { pushNotifications: true }
    });

    return {
      total: totalSettings,
      lightTheme: lightThemeUsers,
      darkTheme: darkThemeUsers,
      autoTheme: autoThemeUsers,
      emailNotifications: emailNotificationsEnabled,
      pushNotifications: pushNotificationsEnabled
    };
  },

  async getSettingsByTheme(theme: string) {
    return prisma.userSetting.findMany({
      where: { theme },
      include: {
        user: {
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
        updatedAt: 'desc'
      }
    });
  },

  async getSettingsByLanguage(language: string) {
    return prisma.userSetting.findMany({
      where: { language },
      include: {
        user: {
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
        updatedAt: 'desc'
      }
    });
  },

  async resetToDefaults(userId: string) {
    return prisma.userSetting.update({
      where: { userId },
      data: {
        theme: 'LIGHT',
        language: 'IT',
        timezone: 'Europe/Rome',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24H',
        notificationPreferences: Prisma.JsonNull,
        dashboardLayout: Prisma.JsonNull,
        emailNotifications: true,
        pushNotifications: true,
      },
      include: {
        user: {
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
  }
}; 