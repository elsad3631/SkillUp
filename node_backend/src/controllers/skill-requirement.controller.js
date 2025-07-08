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
exports.skillRequirementController = void 0;
const skill_requirement_service_1 = require("../services/skill-requirement.service");
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
exports.skillRequirementController = {
    getAll: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const skills = yield skill_requirement_service_1.skillRequirementService.getAll();
        res.json(skills);
    })),
    getById: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const skill = yield skill_requirement_service_1.skillRequirementService.getById(req.params.id);
        if (!skill)
            return res.status(404).json({ message: 'Not found' });
        res.json(skill);
    })),
    create: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const skill = yield skill_requirement_service_1.skillRequirementService.create(req.body);
        res.status(201).json(skill);
    })),
    update: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const skill = yield skill_requirement_service_1.skillRequirementService.update(req.params.id, req.body);
        res.json(skill);
    })),
    remove: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield skill_requirement_service_1.skillRequirementService.remove(req.params.id);
        res.status(204).send();
    })),
};
