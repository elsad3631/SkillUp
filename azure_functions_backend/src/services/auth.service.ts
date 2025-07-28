import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RoleService } from './role.service';

const prisma = new PrismaClient();
const roleService = new RoleService();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '8h';

export const authService = {
  async register({ 
    first_name, 
    last_name, 
    email, 
    password, 
    username,
    roles = ['admin'], // Default to admin role instead of employee
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

    // Automatically assign admin role through the role system
    try {
      const allRoles = await roleService.getAllRoles();
      const adminRole = allRoles.find(role => role.name === 'admin');
      
      if (adminRole) {
        await roleService.assignRoleToUser({
          userId: user.id,
          roleId: adminRole.id,
          assignedBy: null // Use null for system assignment
        });
        console.log(`✅ Admin role assigned to user ${user.email}`);
      } else {
        console.warn(`⚠️ Admin role not found in database for user ${user.email}`);
      }
    } catch (error) {
      console.error(`❌ Error assigning admin role to user ${user.email}:`, error);
      // Don't fail registration if role assignment fails
    }

    return user;
  },
  async login({ email, password }: any) {
    const user = await prisma.applicationUser.findUnique({ 
      where: { email }
    });
    
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');
    
    // Get roles and permissions from the UserRole table
    const userRoles = await (prisma as any).userRole.findMany({
      where: { userId: user.id, isActive: true },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });
    
    const roles = userRoles.map((ur: any) => ur.role.name);
    const permissions = new Set<string>();
    
    // Collect all permissions from user's roles
    userRoles.forEach((userRole: any) => {
      userRole.role.rolePermissions?.forEach((rp: any) => {
        if (rp.isActive && rp.permission) {
          permissions.add(rp.permission.name);
        }
      });
    });
    
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        email: user.email,
        roles: roles,
        permissions: Array.from(permissions)
      },
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