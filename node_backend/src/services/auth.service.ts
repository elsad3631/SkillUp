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
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwt.sign(
      { userId: user.id, roles: user.roles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return { token, user };
  },
  async resetPassword({ email, newPassword }: any) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    return prisma.applicationUser.update({
      where: { email },
      data: { passwordHash },
    });
  },
  async getUserById(userId: string) {
    return prisma.applicationUser.findUnique({ 
      where: { id: userId },
      include: {
        hardSkills: true,
        softSkills: true,
        experiences: true,
        cvData: true,
      },
    });
  },
  verifyToken(token: string) {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === 'string') throw new Error('Invalid token');
    return payload;
  },
  
  async updateEmail(userId: string, newEmail: string, currentPassword: string) {
    // Verify current password
    const user = await prisma.applicationUser.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    
    const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!validPassword) throw new Error('Current password is incorrect');
    
    // Check if email already exists
    const existingUser = await prisma.applicationUser.findUnique({ where: { email: newEmail } });
    if (existingUser && existingUser.id !== userId) {
      throw new Error('Email already in use');
    }
    
    // Update email
    return prisma.applicationUser.update({
      where: { id: userId },
      data: { email: newEmail },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        roles: true,
        avatar: true,
        dateOfBirth: true,
        placeOfBirth: true,
        address: true,
        phone: true,
        currentRole: true,
        department: true,
        isAvailable: true,
      },
    });
  },
  
  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    // Verify current password
    const user = await prisma.applicationUser.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    
    const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!validPassword) throw new Error('Current password is incorrect');
    
    // Validate new password (minimum 8 characters)
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    return prisma.applicationUser.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
      },
    });
  },
}; 