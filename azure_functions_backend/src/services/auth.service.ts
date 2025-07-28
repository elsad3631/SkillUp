import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RoleService } from './role.service';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const roleService = new RoleService();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '8h';

// Funzione per caricare le skills dal file JSON
function loadSkillsList() {
  try {
    const skillsPath = path.join(__dirname, '../../skills-list.json');
    const skillsData = fs.readFileSync(skillsPath, 'utf8');
    return JSON.parse(skillsData);
  } catch (error) {
    console.error('❌ Errore nel caricamento del file skills-list.json:', error);
    return {};
  }
}

// Funzione per creare le skills per un utente basate sul settore
async function createSkillsForUser(userId: string, sector: string) {
  try {
    console.log(`🔍 Iniziando creazione skills per utente ${userId} con settore: ${sector}`);
    
    const skillsList = loadSkillsList();
    console.log(`📋 Skills list caricata, settori disponibili:`, Object.keys(skillsList));
    
    const sectorData = skillsList[sector];
    
    if (!sectorData) {
      console.warn(`⚠️ Settore ${sector} non trovato nella lista delle skills`);
      return;
    }

    console.log(`✅ Settore ${sector} trovato, dati:`, {
      hardSkillsCount: sectorData.hard_skills?.length || 0,
      softSkillsCount: sectorData.soft_skills?.length || 0
    });

    // Crea le hard skills nella tabella Asset
    if (sectorData.hard_skills && Array.isArray(sectorData.hard_skills)) {
      const hardSkillsData = sectorData.hard_skills.map((skillName: string) => ({
        name: skillName,
        type: 'hard skill',
        enable: true,
        applicationUserId: userId
      }));

      console.log(`🔧 Preparando ${hardSkillsData.length} hard skills:`, hardSkillsData.slice(0, 3));

      if (hardSkillsData.length > 0) {
        const result = await prisma.asset.createMany({
          data: hardSkillsData
        });
        console.log(`✅ Create ${result.count} hard skills per l'utente ${userId}`);
      }
    }

    // Crea le soft skills nella tabella Asset
    if (sectorData.soft_skills && Array.isArray(sectorData.soft_skills)) {
      const softSkillsData = sectorData.soft_skills.map((skillName: string) => ({
        name: skillName,
        type: 'soft skill',
        enable: true,
        applicationUserId: userId
      }));

      console.log(`🔧 Preparando ${softSkillsData.length} soft skills:`, softSkillsData.slice(0, 3));

      if (softSkillsData.length > 0) {
        const result = await prisma.asset.createMany({
          data: softSkillsData
        });
        console.log(`✅ Create ${result.count} soft skills per l'utente ${userId}`);
      }
    }

    console.log(`🎉 Creazione skills completata per utente ${userId}`);
  } catch (error: any) {
    console.error(`❌ Errore nella creazione delle skills per l'utente ${userId}:`, error);
    console.error(`❌ Stack trace:`, error.stack);
    // Non fallire la registrazione se la creazione delle skills fallisce
  }
}

export const authService = {
  async register({ 
    first_name, 
    last_name, 
    email, 
    password, 
    username,
    sector, // Nuovo campo per il settore
    roles = ['superadmin'], // Cambiato da admin a superadmin
    currentRole,
    department,
    dateOfBirth,
    placeOfBirth,
    address,
    phone,
    isAvailable = true
  }: any) {
    console.log(`🔍 Registrazione utente con dati:`, { 
      email, 
      sector, 
      first_name, 
      last_name,
      hasSector: !!sector 
    });
    
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

    // Automatically assign superadmin role through the role system
    try {
      const allRoles = await roleService.getAllRoles();
      const superadminRole = allRoles.find(role => role.name === 'superadmin');
      
      if (superadminRole) {
        await roleService.assignRoleToUser({
          userId: user.id,
          roleId: superadminRole.id,
          assignedBy: null // Use null for system assignment
        });
        console.log(`✅ Superadmin role assigned to user ${user.email}`);
      } else {
        console.warn(`⚠️ Superadmin role not found in database for user ${user.email}`);
      }
    } catch (error) {
      console.error(`❌ Error assigning superadmin role to user ${user.email}:`, error);
      // Don't fail registration if role assignment fails
    }

    // Crea le skills basate sul settore selezionato
    if (sector) {
      console.log(`🎯 Creazione skills per settore: ${sector}`);
      await createSkillsForUser(user.id, sector);
    } else {
      console.warn(`⚠️ Nessun settore specificato per l'utente ${user.email}`);
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