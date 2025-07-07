import request from 'supertest';
import express from 'express';
import { json } from 'body-parser';
import employeeRoutes from '../routes/employee.routes';

const app = express();
app.use(json());
app.use('/api/employees', employeeRoutes);

describe('Employee API', () => {
  it('should create, read, update and delete an employee', async () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      currentRole: 'Software Developer',
      department: 'Engineering',
      isAvailable: true
    };

    // Create
    const createRes = await request(app)
      .post('/api/employees')
      .send(employee);
    expect(createRes.status).toBe(201);
    expect(createRes.body.firstName).toBe(employee.firstName);
    expect(createRes.body.email).toBe(employee.email);

    const employeeId = createRes.body.id;

    // Read
    const getRes = await request(app)
      .get(`/api/employees/${employeeId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(employeeId);

    // Update
    const updateData = { currentRole: 'Senior Developer' };
    const updateRes = await request(app)
      .put(`/api/employees/${employeeId}`)
      .send(updateData);
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.currentRole).toBe(updateData.currentRole);

    // Delete
    const deleteRes = await request(app)
      .delete(`/api/employees/${employeeId}`);
    expect(deleteRes.status).toBe(204);

    // Verify deletion
    const getAfterDeleteRes = await request(app)
      .get(`/api/employees/${employeeId}`);
    expect(getAfterDeleteRes.status).toBe(404);
  });

  it('should get all employees', async () => {
    const res = await request(app)
      .get('/api/employees');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
}); 