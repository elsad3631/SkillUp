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
exports.projectController = void 0;
const project_service_1 = require("../services/project.service");
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
exports.projectController = {
    getAll: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const projects = yield project_service_1.projectService.getAll();
        res.json(projects);
    })),
    getById: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const project = yield project_service_1.projectService.getById(req.params.id);
        if (!project)
            return res.status(404).json({ message: 'Not found' });
        res.json(project);
    })),
    create: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const project = yield project_service_1.projectService.create(req.body);
        res.status(201).json(project);
    })),
    update: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const project = yield project_service_1.projectService.update(req.params.id, req.body);
        res.json(project);
    })),
    remove: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield project_service_1.projectService.remove(req.params.id);
        res.status(204).send();
    })),
    createSkillRequirement: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const skill = yield project_service_1.projectService.createSkillRequirement(req.body);
        res.status(201).json(skill);
    })),
    updateSkillRequirement: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const skill = yield project_service_1.projectService.updateSkillRequirement(req.params.id, req.body);
        res.json(skill);
    })),
    deleteSkillRequirement: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield project_service_1.projectService.deleteSkillRequirement(req.params.id);
        res.status(204).send();
    })),
};
