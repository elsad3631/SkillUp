import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import employeeRoutes from './routes/employee.routes';
import projectRoutes from './routes/project.routes';
import appointmentRoutes from './routes/appointment.routes';
import userRoutes from './routes/user.routes';
import experienceRoutes from './routes/experience.routes';
import skillRoutes from './routes/skill.routes';
import skillRequirementRoutes from './routes/skill-requirement.routes';
import cvDataRoutes from './routes/cvdata.routes';
import skillTrainingRoutes from './routes/skill-training.routes';
import authRoutes from './routes/auth.routes';
import assetRoutes from './routes/asset.routes';
import { authenticateJWT, authorizeRoles } from './middlewares/auth.middleware';

const app = express();
app.use(json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Qui verranno importate e usate le route dei microservizi
// esempio: app.use('/api/employees', employeeRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/skill-requirements', skillRequirementRoutes);
app.use('/api/cvdata', cvDataRoutes);
app.use('/api/skill-trainings', skillTrainingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);

// Esempio di protezione route:
// app.use('/api/admin', authenticateJWT, authorizeRoles('Admin'), adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SkillUp API server running on port ${PORT}`);
}); 