import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '8h';

export const authService = {
  async register({ username, email, password, roles = ['Employee'] }: any) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.applicationUser.create({
      data: { username, email, passwordHash, roles },
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