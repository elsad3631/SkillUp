import { Request, Response, NextFunction } from 'express';
import { applicationUserService } from '../services/applicationuser.service';

type ApplicationUser = {
  id: string;
  username: string;
  email: string;
  roles: string[];
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: Date | null;
  placeOfBirth?: string | null;
  address?: string | null;
  phone?: string | null;
  currentRole?: string | null;
  department?: string | null;
  isAvailable: boolean;
};

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const applicationUserController = {
  // Basic CRUD operations (from Employee controller)
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const users = await applicationUserService.getAll();
    console.log("APPLICATION USERS:", users); // DEBUG
    res.json(users);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await applicationUserService.getById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const user = await applicationUserService.create(req.body);
    res.status(201).json(user);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const user = await applicationUserService.update(req.params.id, req.body);
    res.json(user);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await applicationUserService.remove(req.params.id);
    res.status(204).send();
  }),

  // ApplicationUser-specific endpoints
  getByRole: asyncHandler(async (req: Request, res: Response) => {
    const { role } = req.params;
    const users = await applicationUserService.getByRole(role);
    res.json(users);
  }),

  getByUsername: asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    const user = await applicationUserService.getByUsername(username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  }),

  getByEmail: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params;
    const user = await applicationUserService.getByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  }),

  updateRoles: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { roles } = req.body;
    
    if (!Array.isArray(roles)) {
      return res.status(400).json({ message: 'Roles must be an array' });
    }

    const user = await applicationUserService.updateRoles(id, roles);
    res.json(user);
  }),

  getAvailableUsers: asyncHandler(async (req: Request, res: Response) => {
    const users = await applicationUserService.getAvailableUsers();
    res.json(users);
  }),

  // Employee-like endpoints (for backward compatibility if needed)
  getEmployees: asyncHandler(async (req: Request, res: Response) => {
    // Return users with 'employee' role
    const employees = await applicationUserService.getByRole('employee');
    res.json(employees);
  }),

  getAdmins: asyncHandler(async (req: Request, res: Response) => {
    // Return users with 'admin' role
    const admins = await applicationUserService.getByRole('admin');
    res.json(admins);
  }),

  // Bulk operations
  updateMultipleRoles: asyncHandler(async (req: Request, res: Response) => {
    const { userIds, roles } = req.body;
    
    if (!Array.isArray(userIds) || !Array.isArray(roles)) {
      return res.status(400).json({ message: 'userIds and roles must be arrays' });
    }

    const promises = userIds.map(id => applicationUserService.updateRoles(id, roles));
    await Promise.all(promises);
    
    res.json({ message: 'Roles updated successfully', count: userIds.length });
  }),

  // Search functionality
  search: asyncHandler(async (req: Request, res: Response) => {
    const { query, role, department, isAvailable } = req.query;
    
    // Basic search implementation - can be enhanced
    let users = await applicationUserService.getAll();
    
    if (role) {
      users = users.filter((user: ApplicationUser) => user.roles.includes(role as string));
    }
    
    if (department) {
      users = users.filter((user: ApplicationUser) => user.department === department);
    }
    
    if (isAvailable !== undefined) {
      const available = isAvailable === 'true';
      users = users.filter((user: ApplicationUser) => user.isAvailable === available);
    }
    
    if (query) {
      const searchTerm = (query as string).toLowerCase();
      users = users.filter((user: ApplicationUser) => 
        user.firstName?.toLowerCase().includes(searchTerm) ||
        user.lastName?.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.department?.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json(users);
  }),

  // Statistics endpoint
  getStats: asyncHandler(async (req: Request, res: Response) => {
    const allUsers = await applicationUserService.getAll();
    
    const stats = {
      total: allUsers.length,
      available: allUsers.filter((u: ApplicationUser) => u.isAvailable).length,
      roles: {} as Record<string, number>,
      departments: {} as Record<string, number>,
    };
    
    // Count by roles
    allUsers.forEach((user: ApplicationUser) => {
      user.roles.forEach((role: string) => {
        stats.roles[role] = (stats.roles[role] || 0) + 1;
      });
    });
    
    // Count by departments
    allUsers.forEach((user: ApplicationUser) => {
      if (user.department) {
        stats.departments[user.department] = (stats.departments[user.department] || 0) + 1;
      }
    });
    
    res.json(stats);
  }),
}; 