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
exports.skillTrainingController = void 0;
const skill_training_service_1 = require("../services/skill-training.service");
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
exports.skillTrainingController = {
    getAll: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const trainings = yield skill_training_service_1.skillTrainingService.getAll();
        res.json(trainings);
    })),
    getById: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const training = yield skill_training_service_1.skillTrainingService.getById(req.params.id);
        if (!training)
            return res.status(404).json({ message: 'Not found' });
        res.json(training);
    })),
    create: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const training = yield skill_training_service_1.skillTrainingService.create(req.body);
        res.status(201).json(training);
    })),
    update: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const training = yield skill_training_service_1.skillTrainingService.update(req.params.id, req.body);
        res.json(training);
    })),
    remove: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield skill_training_service_1.skillTrainingService.remove(req.params.id);
        res.status(204).send();
    })),
};
