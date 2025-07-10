import { Router } from 'express';
import { projectSkillController } from '../controllers/projectSkill.controller';

const router = Router();

router.get('/', projectSkillController.getAll);
router.get('/:id', projectSkillController.getById);
router.get('/hard/:projectId', projectSkillController.getHardSkillsByProjectId);
router.get('/soft/:projectId', projectSkillController.getSoftSkillsByProjectId);
router.post('/hard', projectSkillController.createHardSkill);
router.post('/soft', projectSkillController.createSoftSkill);
router.put('/:id', projectSkillController.update);
router.delete('/:id', projectSkillController.remove);

export default router; 