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
    return prisma.applicationUser.findUnique({ where: { id: userId } });
  },
  verifyToken(token: string) {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === 'string') throw new Error('Invalid token');
    return payload;
  },
}; 