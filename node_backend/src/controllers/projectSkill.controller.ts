import { Request, Response, NextFunction } from 'express';
import { projectSkillService } from '../services/projectSkill.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const projectSkillController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const skills = await projectSkillService.getAll();
    res.json(skills);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const skill = await projectSkillService.getById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Not found' });
    res.json(skill);
  }),
  getHardSkillsByProjectId: asyncHandler(async (req: Request, res: Response) => {
    const skills = await projectSkillService.getHardSkillsByProjectId(req.params.projectId);
    res.json(skills);
  }),
  getSoftSkillsByProjectId: asyncHandler(async (req: Request, res: Response) => {
    const skills = await projectSkillService.getSoftSkillsByProjectId(req.params.projectId);
    res.json(skills);
  }),
  createHardSkill: asyncHandler(async (req: Request, res: Response) => {
    const skill = await projectSkillService.createHardSkill(req.body);
    res.status(201).json(skill);
  }),
  createSoftSkill: asyncHandler(async (req: Request, res: Response) => {
    const skill = await projectSkillService.createSoftSkill(req.body);
    res.status(201).json(skill);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const skill = await projectSkillService.update(req.params.id, req.body);
    res.json(skill);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await projectSkillService.remove(req.params.id);
    res.status(204).send();
  }),
}; 