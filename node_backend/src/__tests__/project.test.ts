import request from 'supertest';
import express from 'express';
import { json } from 'body-parser';
import projectRoutes from '../routes/project.routes';

const app = express();
app.use(json());
app.use('/api/projects', projectRoutes);

describe('Project API', () => {
  it('should create, read, update and delete a project', async () => {
    const project = {
      name: 'Test Project',
      description: 'A test project for integration',
      status: 'Active',
      priority: 'High',
      budget: 50000,
      requiredHardSkills: ['JavaScript', 'Vue.js'],
      requiredSoftSkills: ['Communication', 'Teamwork']
    };

    // Create
    const createRes = await request(app)
      .post('/api/projects')
      .send(project);
    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe(project.name);
    expect(createRes.body.status).toBe(project.status);

    const projectId = createRes.body.id;

    // Read
    const getRes = await request(app)
      .get(`/api/projects/${projectId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(projectId);

    // Update
    const updateData = { status: 'Completed' };
    const updateRes = await request(app)
      .put(`/api/projects/${projectId}`)
      .send(updateData);
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe(updateData.status);

    // Delete
    const deleteRes = await request(app)
      .delete(`/api/projects/${projectId}`);
    expect(deleteRes.status).toBe(204);

    // Verify deletion
    const getAfterDeleteRes = await request(app)
      .get(`/api/projects/${projectId}`);
    expect(getAfterDeleteRes.status).toBe(404);
  });

  it('should get all projects', async () => {
    const res = await request(app)
      .get('/api/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
}); 