import { Router } from 'express';
import { projectController } from '../controllers/project.controller';

const router = Router();

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.remove);
router.post('/skill-requirements', projectController.createSkillRequirement);
router.put('/skill-requirements/:id', projectController.updateSkillRequirement);
router.delete('/skill-requirements/:id', projectController.deleteSkillRequirement);

export default router; 