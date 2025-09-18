import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const systemUserService = {
  /**
   * Get or create the system user
   */
  async getOrCreateSystemUser() {
    try {
      // Try to find existing system user
      let systemUser = await prisma.applicationUser.findUnique({
        where: { username: 'system' }
      });

      if (!systemUser) {
        // Create system user if it doesn't exist
        const passwordHash = await bcrypt.hash('system_password_never_used', 10);
        
        systemUser = await prisma.applicationUser.create({
          data: {
            username: 'system',
            email: 'system@skillup.local',
            passwordHash: passwordHash,
            firstName: 'System',
            lastName: 'User',
            isAvailable: false, // System user is never available for login
            currentRole: 'System Administrator',
            department: 'System'
          }
        });
      }

      return systemUser;
    } catch (error) {
      console.error('❌ Error getting/creating system user:', error);
      throw error;
    }
  },

  /**
   * Get system user ID (creates if doesn't exist)
   */
  async getSystemUserId(): Promise<string> {
    const systemUser = await this.getOrCreateSystemUser();
    return systemUser.id;
  },

  /**
   * Check if a user ID is the system user
   */
  async isSystemUser(userId: string): Promise<boolean> {
    try {
      const user = await prisma.applicationUser.findUnique({
        where: { id: userId },
        select: { username: true }
      });
      
      if (user?.username === 'system') {
        return true;
      }
      
      // Check if user has system role through UserRole table
      const systemRole = await (prisma as any).userRole.findFirst({
        where: {
          userId: userId,
          role: {
            name: 'system'
          },
          isActive: true
        }
      });
      
      return !!systemRole;
    } catch (error) {
      return false;
    }
  }
}; 