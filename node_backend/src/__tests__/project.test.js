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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const project_routes_1 = __importDefault(require("../routes/project.routes"));
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use('/api/projects', project_routes_1.default);
describe('Project API', () => {
    it('should create, read, update and delete a project', () => __awaiter(void 0, void 0, void 0, function* () {
        const project = {
            name: 'Test Project',
            description: 'A test project for integration',
            status: 'Active',
            priority: 'High',
            budget: 50000,
            requiredHardSkills: ['JavaScript', 'Vue.js'],
            requiredSoftSkills: ['Communication', 'Teamwork']
        };
        // Create
        const createRes = yield (0, supertest_1.default)(app)
            .post('/api/projects')
            .send(project);
        expect(createRes.status).toBe(201);
        expect(createRes.body.name).toBe(project.name);
        expect(createRes.body.status).toBe(project.status);
        const projectId = createRes.body.id;
        // Read
        const getRes = yield (0, supertest_1.default)(app)
            .get(`/api/projects/${projectId}`);
        expect(getRes.status).toBe(200);
        expect(getRes.body.id).toBe(projectId);
        // Update
        const updateData = { status: 'Completed' };
        const updateRes = yield (0, supertest_1.default)(app)
            .put(`/api/projects/${projectId}`)
            .send(updateData);
        expect(updateRes.status).toBe(200);
        expect(updateRes.body.status).toBe(updateData.status);
        // Delete
        const deleteRes = yield (0, supertest_1.default)(app)
            .delete(`/api/projects/${projectId}`);
        expect(deleteRes.status).toBe(204);
        // Verify deletion
        const getAfterDeleteRes = yield (0, supertest_1.default)(app)
            .get(`/api/projects/${projectId}`);
        expect(getAfterDeleteRes.status).toBe(404);
    }));
    it('should get all projects', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/api/projects');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
});
