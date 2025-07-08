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
exports.cvDataController = void 0;
const cvdata_service_1 = require("../services/cvdata.service");
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
exports.cvDataController = {
    getAll: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const cvData = yield cvdata_service_1.cvDataService.getAll();
        res.json(cvData);
    })),
    getById: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const cv = yield cvdata_service_1.cvDataService.getById(req.params.id);
        if (!cv)
            return res.status(404).json({ message: 'Not found' });
        res.json(cv);
    })),
    create: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const cv = yield cvdata_service_1.cvDataService.create(req.body);
        res.status(201).json(cv);
    })),
    update: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const cv = yield cvdata_service_1.cvDataService.update(req.params.id, req.body);
        res.json(cv);
    })),
    remove: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield cvdata_service_1.cvDataService.remove(req.params.id);
        res.status(204).send();
    })),
};
