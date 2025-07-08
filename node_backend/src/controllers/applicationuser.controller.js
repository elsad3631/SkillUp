"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationUserController = void 0;
const applicationuser_service_1 = require("../services/applicationuser.service");
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
exports.applicationUserController = {
    // Basic CRUD operations (from Employee controller)
    getAll: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield applicationuser_service_1.applicationUserService.getAll();
        console.log("APPLICATION USERS:", users); // DEBUG
        res.json(users);
    })),
    getById: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield applicationuser_service_1.applicationUserService.getById(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    })),
    create: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield applicationuser_service_1.applicationUserService.create(req.body);
        res.status(201).json(user);
    })),
    update: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield applicationuser_service_1.applicationUserService.update(req.params.id, req.body);
        res.json(user);
    })),
    remove: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield applicationuser_service_1.applicationUserService.remove(req.params.id);
        res.status(204).send();
    })),
    // ApplicationUser-specific endpoints
    getByRole: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { role } = req.params;
        const users = yield applicationuser_service_1.applicationUserService.getByRole(role);
        res.json(users);
    })),
    getByUsername: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = req.params;
        const user = yield applicationuser_service_1.applicationUserService.getByUsername(username);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    })),
    getByEmail: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.params;
        const user = yield applicationuser_service_1.applicationUserService.getByEmail(email);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    })),
    updateRoles: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { roles } = req.body;
        if (!Array.isArray(roles)) {
            return res.status(400).json({ message: 'Roles must be an array' });
        }
        const user = yield applicationuser_service_1.applicationUserService.updateRoles(id, roles);
        res.json(user);
    })),
    getAvailableUsers: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield applicationuser_service_1.applicationUserService.getAvailableUsers();
        res.json(users);
    })),
    // Employee-like endpoints (for backward compatibility if needed)
    getEmployees: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Return users with 'employee' role
        const employees = yield applicationuser_service_1.applicationUserService.getByRole('employee');
        res.json(employees);
    })),
    getAdmins: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Return users with 'admin' role
        const admins = yield applicationuser_service_1.applicationUserService.getByRole('admin');
        res.json(admins);
    })),
    // Bulk operations
    updateMultipleRoles: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userIds, roles } = req.body;
        if (!Array.isArray(userIds) || !Array.isArray(roles)) {
            return res.status(400).json({ message: 'userIds and roles must be arrays' });
        }
        const promises = userIds.map(id => applicationuser_service_1.applicationUserService.updateRoles(id, roles));
        yield Promise.all(promises);
        res.json({ message: 'Roles updated successfully', count: userIds.length });
    })),
    // Search functionality
    search: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { query, role, department, isAvailable } = req.query;
        // Basic search implementation - can be enhanced
        let users = yield applicationuser_service_1.applicationUserService.getAll();
        if (role) {
            users = users.filter(user => user.roles.includes(role));
        }
        if (department) {
            users = users.filter(user => user.department === department);
        }
        if (isAvailable !== undefined) {
            const available = isAvailable === 'true';
            users = users.filter(user => user.isAvailable === available);
        }
        if (query) {
            const searchTerm = query.toLowerCase();
            users = users.filter(user => {
                var _a, _b, _c;
                return ((_a = user.firstName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm)) ||
                    ((_b = user.lastName) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchTerm)) ||
                    user.email.toLowerCase().includes(searchTerm) ||
                    user.username.toLowerCase().includes(searchTerm) ||
                    ((_c = user.department) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchTerm));
            });
        }
        res.json(users);
    })),
    // Statistics endpoint
    getStats: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const allUsers = yield applicationuser_service_1.applicationUserService.getAll();
        const stats = {
            total: allUsers.length,
            available: allUsers.filter(u => u.isAvailable).length,
            roles: {},
            departments: {},
        };
        // Count by roles
        allUsers.forEach(user => {
            user.roles.forEach(role => {
                stats.roles[role] = (stats.roles[role] || 0) + 1;
            });
        });
        // Count by departments
        allUsers.forEach(user => {
            if (user.department) {
                stats.departments[user.department] = (stats.departments[user.department] || 0) + 1;
            }
        });
        res.json(stats);
    })),
};
