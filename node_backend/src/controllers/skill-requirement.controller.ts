import { Request, Response, NextFunction } from 'express';
import { skillRequirementService } from '../services/skill-requirement.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const skillRequirementController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const skills = await skillRequirementService.getAll();
    res.json(skills);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const skill = await skillRequirementService.getById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Not found' });
    res.json(skill);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const skill = await skillRequirementService.create(req.body);
    res.status(201).json(skill);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const skill = await skillRequirementService.update(req.params.id, req.body);
    res.json(skill);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await skillRequirementService.remove(req.params.id);
    res.status(204).send();
  }),
}; 