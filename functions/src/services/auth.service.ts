import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '8h';

export const authService = {
  async register({ 
    first_name, 
    last_name, 
    email, 
    password, 
    username,
    roles = ['employee'],
    currentRole,
    department,
    dateOfBirth,
    placeOfBirth,
    address,
    phone,
    isAvailable = true
  }: any) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate username from email if not provided
    const generatedUsername = username || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const user = await prisma.applicationUser.create({
      data: { 
        username: generatedUsername,
        email, 
        passwordHash, 
        roles,
        firstName: first_name,
        lastName: last_name,
        currentRole,
        department,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        placeOfBirth,
        address,
        phone,
        isAvailable
      },
    });
    return user;
  },

  async login({ email, password }: any) {
    const user = await prisma.applicationUser.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ 
      userId: user.id, 
      email: user.email, 
      roles: user.roles 
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    return { user, token };
  },

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await prisma.applicationUser.findUnique({ 
        where: { id: decoded.userId },
        include: {
          hardSkills: true,
          softSkills: true,
          experiences: true
        }
      });
      if (!user) {
        throw new Error('User not found');
      }
      return { user, decoded };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as any;
      const user = await prisma.applicationUser.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new Error('User not found');
      }
      const newToken = jwt.sign({ 
        userId: user.id, 
        email: user.email, 
        roles: user.roles 
      }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      
      return { user, token: newToken };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.applicationUser.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    
    const isValidOldPassword = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValidOldPassword) {
      throw new Error('Current password is incorrect');
    }
    
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.applicationUser.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });
    
    return { message: 'Password changed successfully' };
  },

  async requestPasswordReset(email: string) {
    const user = await prisma.applicationUser.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    
    // Generate reset token
    const resetToken = jwt.sign({ 
      userId: user.id, 
      type: 'password_reset' 
    }, JWT_SECRET, { expiresIn: '1h' });
    
    // In a real app, you would send this token via email
    return { resetToken, message: 'Password reset token generated' };
  },

  async resetPassword(resetToken: string, newPassword: string) {
    try {
      const decoded = jwt.verify(resetToken, JWT_SECRET) as any;
      
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid reset token type');
      }
      
      const user = await prisma.applicationUser.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new Error('User not found');
      }
      
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await prisma.applicationUser.update({
        where: { id: decoded.userId },
        data: { passwordHash: newPasswordHash }
      });
      
      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }
}; 