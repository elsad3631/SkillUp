import { Router } from 'express';
import { applicationUserController } from '../controllers/applicationuser.controller';

const router = Router();

// Basic CRUD routes (from Employee routes)
router.get('/', applicationUserController.getAll);
router.get('/:id', applicationUserController.getById);
router.post('/', applicationUserController.create);
router.put('/:id', applicationUserController.update);
router.delete('/:id', applicationUserController.remove);

// ApplicationUser-specific routes
router.get('/role/:role', applicationUserController.getByRole);
router.get('/username/:username', applicationUserController.getByUsername);
router.get('/email/:email', applicationUserController.getByEmail);
router.patch('/:id/roles', applicationUserController.updateRoles);

// Specialized endpoints
router.get('/filter/available', applicationUserController.getAvailableUsers);
router.get('/filter/employees', applicationUserController.getEmployees);
router.get('/filter/admins', applicationUserController.getAdmins);

// Project-related endpoints
router.get('/:id/projects', applicationUserController.getUserProjects);

// Advanced operations
router.get('/admin/stats', applicationUserController.getStats);
router.get('/admin/search', applicationUserController.search);
router.patch('/admin/bulk-roles', applicationUserController.updateMultipleRoles);

export default router; 