import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      console.error('Register error:', err);
      if (err.code === 'P2002') {
        res.status(400).json({ error: 'Email or username already exists' });
      } else {
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  }),
  login: asyncHandler(async (req: Request, res: Response) => {
    const { token, user } = await authService.login(req.body);
    res.json({ token, user });
  }),
  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body);
    res.status(204).send();
  }),
  verifyToken: asyncHandler(async (req: Request, res: Response) => {
    const { api_token } = req.body;
    try {
      const payload = authService.verifyToken(api_token);
      // Recupera l'utente dal DB
      const user = await authService.getUserById(payload.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }),
  
  updateEmail: asyncHandler(async (req: Request, res: Response) => {
    const { newEmail, currentPassword } = req.body;
    const userId = (req as any).user?.userId; // From JWT middleware
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!newEmail || !currentPassword) {
      return res.status(400).json({ error: 'New email and current password are required' });
    }
    
    try {
      const updatedUser = await authService.updateEmail(userId, newEmail, currentPassword);
      res.json({ message: 'Email updated successfully', user: updatedUser });
    } catch (error: any) {
      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      if (error.message === 'Email already in use') {
        return res.status(400).json({ error: 'Email already in use' });
      }
      res.status(500).json({ error: 'Failed to update email' });
    }
  }),
  
  updatePassword: asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = (req as any).user?.userId; // From JWT middleware
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All password fields are required' });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }
    
    try {
      await authService.updatePassword(userId, currentPassword, newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      if (error.message === 'New password must be at least 8 characters long') {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
      }
      res.status(500).json({ error: 'Failed to update password' });
    }
  }),
}; 