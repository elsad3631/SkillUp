import { Router } from 'express';
import { skillRequirementController } from '../controllers/skill-requirement.controller';

const router = Router();

router.get('/', skillRequirementController.getAll);
router.get('/:id', skillRequirementController.getById);
router.post('/', skillRequirementController.create);
router.put('/:id', skillRequirementController.update);
router.delete('/:id', skillRequirementController.remove);

export default router; 