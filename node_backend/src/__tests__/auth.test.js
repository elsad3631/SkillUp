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
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use('/api/auth', auth_routes_1.default);
describe('Auth API', () => {
    it('should register and login a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'Test1234!',
            roles: ['Employee']
        };
        // Register
        const regRes = yield (0, supertest_1.default)(app)
            .post('/api/auth/register')
            .send(user);
        expect(regRes.status).toBe(201);
        expect(regRes.body.email).toBe(user.email);
        // Login
        const loginRes = yield (0, supertest_1.default)(app)
            .post('/api/auth/login')
            .send({ email: user.email, password: user.password });
        expect(loginRes.status).toBe(200);
        expect(loginRes.body.token).toBeDefined();
        expect(loginRes.body.user.email).toBe(user.email);
    }));
});
