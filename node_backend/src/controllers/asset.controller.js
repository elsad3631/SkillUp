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
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const asset_service_1 = require("../services/asset.service");
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assets = yield asset_service_1.assetService.getAll();
        res.json(assets);
    }
    catch (error) {
        res.status(500).json({ error: 'Errore nel recupero degli asset' });
    }
});
exports.getAll = getAll;
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const asset = yield asset_service_1.assetService.getById(id);
        if (!asset) {
            res.status(404).json({ error: 'Asset non trovato' });
            return;
        }
        res.json(asset);
    }
    catch (error) {
        res.status(500).json({ error: 'Errore nel recupero dell\'asset' });
    }
});
exports.getById = getById;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, type, enable } = req.body;
        if (!name || !type) {
            res.status(400).json({ error: 'name e type sono obbligatori' });
            return;
        }
        const asset = yield asset_service_1.assetService.create({ name, type, enable });
        res.status(201).json(asset);
    }
    catch (error) {
        res.status(500).json({ error: 'Errore nella creazione dell\'asset' });
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { name, type, enable } = req.body;
        const asset = yield asset_service_1.assetService.update(id, { name, type, enable });
        res.json(asset);
    }
    catch (error) {
        res.status(500).json({ error: 'Errore nell\'aggiornamento dell\'asset' });
    }
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield asset_service_1.assetService.remove(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Errore nella cancellazione dell\'asset' });
    }
});
exports.remove = remove;
