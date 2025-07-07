import { Router } from 'express';
import { skillController } from '../controllers/skill.controller';

const router = Router();

router.get('/', skillController.getAll);
router.get('/:id', skillController.getById);
router.post('/', skillController.create);
router.put('/:id', skillController.update);
router.delete('/:id', skillController.remove);

export default router; 