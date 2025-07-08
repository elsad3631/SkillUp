"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicationuser_controller_1 = require("../controllers/applicationuser.controller");
const router = (0, express_1.Router)();
// Basic CRUD routes (from Employee routes)
router.get('/', applicationuser_controller_1.applicationUserController.getAll);
router.get('/:id', applicationuser_controller_1.applicationUserController.getById);
router.post('/', applicationuser_controller_1.applicationUserController.create);
router.put('/:id', applicationuser_controller_1.applicationUserController.update);
router.delete('/:id', applicationuser_controller_1.applicationUserController.remove);
// ApplicationUser-specific routes
router.get('/role/:role', applicationuser_controller_1.applicationUserController.getByRole);
router.get('/username/:username', applicationuser_controller_1.applicationUserController.getByUsername);
router.get('/email/:email', applicationuser_controller_1.applicationUserController.getByEmail);
router.patch('/:id/roles', applicationuser_controller_1.applicationUserController.updateRoles);
// Specialized endpoints
router.get('/filter/available', applicationuser_controller_1.applicationUserController.getAvailableUsers);
router.get('/filter/employees', applicationuser_controller_1.applicationUserController.getEmployees);
router.get('/filter/admins', applicationuser_controller_1.applicationUserController.getAdmins);
// Advanced operations
router.get('/admin/stats', applicationuser_controller_1.applicationUserController.getStats);
router.get('/admin/search', applicationuser_controller_1.applicationUserController.search);
router.patch('/admin/bulk-roles', applicationuser_controller_1.applicationUserController.updateMultipleRoles);
exports.default = router;
