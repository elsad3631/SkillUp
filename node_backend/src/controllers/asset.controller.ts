import { Request, Response, RequestHandler } from 'express';
import { assetService } from '../services/asset.service';

export const getAll: RequestHandler = async (req, res) => {
  try {
    const assets = await assetService.getAll();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero degli asset' });
  }
};

export const getById: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const asset = await assetService.getById(id);
    if (!asset) {
      res.status(404).json({ error: 'Asset non trovato' });
      return;
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dell\'asset' });
  }
};

export const create: RequestHandler = async (req, res) => {
  try {
    const { name, type, enable } = req.body;
    if (!name || !type) {
      res.status(400).json({ error: 'name e type sono obbligatori' });
      return;
    }
    const asset = await assetService.create({ name, type, enable });
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Errore nella creazione dell\'asset' });
  }
};

export const update: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, type, enable } = req.body;
    const asset = await assetService.update(id, { name, type, enable });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento dell\'asset' });
  }
};

export const remove: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await assetService.remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Errore nella cancellazione dell\'asset' });
  }
}; 