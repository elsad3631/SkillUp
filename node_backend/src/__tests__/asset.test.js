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
const asset_routes_1 = __importDefault(require("../routes/asset.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/assets', asset_routes_1.default);
describe('Asset API', () => {
    it('dovrebbe inserire un asset nel database', () => __awaiter(void 0, void 0, void 0, function* () {
        const assetData = { name: 'Laptop', type: 'Hardware', enable: true };
        const response = yield (0, supertest_1.default)(app)
            .post('/api/assets')
            .send(assetData)
            .expect(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(assetData.name);
        expect(response.body.type).toBe(assetData.type);
        expect(response.body.enable).toBe(assetData.enable);
    }));
});
