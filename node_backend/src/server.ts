require('dotenv').config();
import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
// import employeeRoutes from './routes/employee.routes'; // Removed - replaced by ApplicationUser
import applicationUserRoutes from './routes/applicationuser.routes';
import projectRoutes from './routes/project.routes';
import appointmentRoutes from './routes/appointment.routes';
import userRoutes from './routes/user.routes';
import experienceRoutes from './routes/experience.routes';
import skillRoutes from './routes/skill.routes';
import projectSkillRoutes from './routes/projectSkill.routes';
import cvDataRoutes from './routes/cvdata.routes';
import skillTrainingRoutes from './routes/skill-training.routes';
import authRoutes from './routes/auth.routes';
import assetRoutes from './routes/asset.routes';
import blobStorageRoutes from './routes/blobstorage.routes';
import { authenticateJWT, authorizeRoles } from './middlewares/auth.middleware';
import { blobStorageService } from './services/blobstorage.service';

const app = express();
app.use(json());
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:8080'
  ], 
  credentials: true 
}));

// Qui verranno importate e usate le route dei microservizi
// esempio: app.use('/api/employees', employeeRoutes);
// app.use('/api/employees', employeeRoutes); // Removed - replaced by ApplicationUser
app.use('/api/applicationusers', applicationUserRoutes); // New unified route
app.use('/api/projects', projectRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/project-skills', projectSkillRoutes);
app.use('/api/cvdata', cvDataRoutes);
app.use('/api/skill-trainings', skillTrainingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/blob-storage', blobStorageRoutes);

// Esempio di protezione route:
// app.use('/api/admin', authenticateJWT, authorizeRoles('Admin'), adminRoutes);

// Initialize blob storage container at startup
async function initializeServices() {
  try {
    console.log('🔄 Initializing Azure Blob Storage container...');
    await blobStorageService.initializeContainer();
    console.log('✅ Azure Blob Storage container initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Azure Blob Storage container:', error);
    console.warn('⚠️  Server will continue but blob storage might not work properly');
  }
}

const PORT = process.env.PORT || 3000;

// Start server and initialize services
async function startServer() {
  try {
    await initializeServices();
    
    app.listen(PORT, () => {
      console.log(`🚀 SkillUp API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 