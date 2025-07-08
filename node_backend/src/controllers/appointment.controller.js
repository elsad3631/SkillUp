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
exports.appointmentController = void 0;
const appointment_service_1 = require("../services/appointment.service");
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
exports.appointmentController = {
    getAll: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const appointments = yield appointment_service_1.appointmentService.getAll();
        res.json(appointments);
    })),
    getById: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const appointment = yield appointment_service_1.appointmentService.getById(req.params.id);
        if (!appointment)
            return res.status(404).json({ message: 'Not found' });
        res.json(appointment);
    })),
    create: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const appointment = yield appointment_service_1.appointmentService.create(req.body);
        res.status(201).json(appointment);
    })),
    update: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const appointment = yield appointment_service_1.appointmentService.update(req.params.id, req.body);
        res.json(appointment);
    })),
    remove: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield appointment_service_1.appointmentService.remove(req.params.id);
        res.status(204).send();
    })),
};
