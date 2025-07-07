import { Request, Response, NextFunction } from 'express';
import { skillTrainingService } from '../services/skill-training.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const skillTrainingController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const trainings = await skillTrainingService.getAll();
    res.json(trainings);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const training = await skillTrainingService.getById(req.params.id);
    if (!training) return res.status(404).json({ message: 'Not found' });
    res.json(training);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const training = await skillTrainingService.create(req.body);
    res.status(201).json(training);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const training = await skillTrainingService.update(req.params.id, req.body);
    res.json(training);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await skillTrainingService.remove(req.params.id);
    res.status(204).send();
  }),
}; 