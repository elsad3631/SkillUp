import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export interface DecodedToken {
  userId: string;
  username: string;
  email: string;
  roles: string[];
  permissions?: string[];
  iat: number;
  exp: number;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function generateToken(payload: {
  userId: string;
  username: string;
  email: string;
  roles: string[];
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
} 