import { Request, Response, NextFunction } from 'express';
import { appointmentService } from '../services/appointment.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const appointmentController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const appointments = await appointmentService.getAll();
    res.json(appointments);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const appointment = await appointmentService.getById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    res.json(appointment);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const appointment = await appointmentService.create(req.body);
    res.status(201).json(appointment);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const appointment = await appointmentService.update(req.params.id, req.body);
    res.json(appointment);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await appointmentService.remove(req.params.id);
    res.status(204).send();
  }),
}; 