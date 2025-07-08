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
exports.experienceController = void 0;
const experience_service_1 = require("../services/experience.service");
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
exports.experienceController = {
    getAll: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const experiences = yield experience_service_1.experienceService.getAll();
        res.json(experiences);
    })),
    getById: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const experience = yield experience_service_1.experienceService.getById(req.params.id);
        if (!experience)
            return res.status(404).json({ message: 'Not found' });
        res.json(experience);
    })),
    create: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const experience = yield experience_service_1.experienceService.create(req.body);
        res.status(201).json(experience);
    })),
    update: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const experience = yield experience_service_1.experienceService.update(req.params.id, req.body);
        res.json(experience);
    })),
    remove: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield experience_service_1.experienceService.remove(req.params.id);
        res.status(204).send();
    })),
};
