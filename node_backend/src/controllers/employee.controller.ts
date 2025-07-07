import { Request, Response, NextFunction } from 'express';
import { employeeService } from '../services/employee.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const employeeController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const employees = await employeeService.getAll();
    console.log("EMPLOYEES:", employees); // DEBUG
    res.json(employees);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const employee = await employeeService.getById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Not found' });
    res.json(employee);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const employee = await employeeService.create(req.body);
    res.status(201).json(employee);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const employee = await employeeService.update(req.params.id, req.body);
    res.json(employee);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await employeeService.remove(req.params.id);
    res.status(204).send();
  }),
}; 