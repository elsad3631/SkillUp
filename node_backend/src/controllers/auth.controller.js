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
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
exports.authController = {
    register: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const user = yield auth_service_1.authService.register(req.body);
            res.status(201).json(user);
        }
        catch (err) {
            console.error('Register error:', err);
            if (err.code === 'P2002') {
                res.status(400).json({ error: 'Email or username already exists' });
            }
            else {
                res.status(500).json({ error: 'Registration failed' });
            }
        }
    })),
    login: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token, user } = yield auth_service_1.authService.login(req.body);
        res.json({ token, user });
    })),
    resetPassword: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield auth_service_1.authService.resetPassword(req.body);
        res.status(204).send();
    })),
    verifyToken: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { api_token } = req.body;
        try {
            const payload = auth_service_1.authService.verifyToken(api_token);
            // Recupera l'utente dal DB
            const user = yield auth_service_1.authService.getUserById(payload.userId);
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            res.json(user);
        }
        catch (err) {
            res.status(401).json({ error: 'Invalid token' });
        }
    })),
};
