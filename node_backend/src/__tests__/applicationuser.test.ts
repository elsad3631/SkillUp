import request from 'supertest';
import express from 'express';
import { json } from 'body-parser';
import applicationUserRoutes from '../routes/applicationuser.routes';

const app = express();
app.use(json());
app.use('/api/applicationusers', applicationUserRoutes);

describe('ApplicationUser API', () => {
  it('should create, read, update and delete an application user', async () => {
    const applicationUser = {
      username: 'johndoe',
      email: 'john.doe@example.com',
      passwordHash: 'hashed_password_123',
      roles: ['employee'],
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      currentRole: 'Software Developer',
      department: 'Engineering',
      isAvailable: true
    };

    // Create
    const createRes = await request(app)
      .post('/api/applicationusers')
      .send(applicationUser);
    expect(createRes.status).toBe(201);
    expect(createRes.body.firstName).toBe(applicationUser.firstName);
    expect(createRes.body.email).toBe(applicationUser.email);
    expect(createRes.body.username).toBe(applicationUser.username);
    expect(Array.isArray(createRes.body.roles)).toBe(true);
    expect(createRes.body.roles).toContain('employee');

    const userId = createRes.body.id;

    // Read
    const getRes = await request(app)
      .get(`/api/applicationusers/${userId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(userId);

    // Update
    const updateData = { 
      currentRole: 'Senior Developer',
      department: 'Advanced Engineering'
    };
    const updateRes = await request(app)
      .put(`/api/applicationusers/${userId}`)
      .send(updateData);
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.currentRole).toBe(updateData.currentRole);
    expect(updateRes.body.department).toBe(updateData.department);

    // Delete
    const deleteRes = await request(app)
      .delete(`/api/applicationusers/${userId}`);
    expect(deleteRes.status).toBe(204);

    // Verify deletion
    const getAfterDeleteRes = await request(app)
      .get(`/api/applicationusers/${userId}`);
    expect(getAfterDeleteRes.status).toBe(404);
  });

  it('should get all application users', async () => {
    const res = await request(app)
      .get('/api/applicationusers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should handle roles management', async () => {
    const user = {
      username: 'adminuser',
      email: 'admin@example.com',
      passwordHash: 'admin_password_hash',
      roles: ['admin', 'employee'],
      firstName: 'Admin',
      lastName: 'User'
    };

    // Create user with multiple roles
    const createRes = await request(app)
      .post('/api/applicationusers')
      .send(user);
    expect(createRes.status).toBe(201);
    expect(createRes.body.roles).toContain('admin');
    expect(createRes.body.roles).toContain('employee');

    const userId = createRes.body.id;

    // Update roles
    const newRoles = ['admin', 'manager'];
    const updateRolesRes = await request(app)
      .patch(`/api/applicationusers/${userId}/roles`)
      .send({ roles: newRoles });
    expect(updateRolesRes.status).toBe(200);
    expect(updateRolesRes.body.roles).toEqual(expect.arrayContaining(newRoles));

    // Clean up
    await request(app).delete(`/api/applicationusers/${userId}`);
  });

  it('should filter users by role', async () => {
    // Test getting employees
    const employeesRes = await request(app)
      .get('/api/applicationusers/filter/employees');
    expect(employeesRes.status).toBe(200);
    expect(Array.isArray(employeesRes.body)).toBe(true);

    // Test getting admins
    const adminsRes = await request(app)
      .get('/api/applicationusers/filter/admins');
    expect(adminsRes.status).toBe(200);
    expect(Array.isArray(adminsRes.body)).toBe(true);

    // Test getting available users
    const availableRes = await request(app)
      .get('/api/applicationusers/filter/available');
    expect(availableRes.status).toBe(200);
    expect(Array.isArray(availableRes.body)).toBe(true);
  });

  it('should search users by username and email', async () => {
    const user1 = {
      username: 'searchuser1',
      email: 'search1@example.com',
      passwordHash: 'hash1',
      roles: ['employee']
    };

    const user2 = {
      username: 'searchuser2', 
      email: 'search2@example.com',
      passwordHash: 'hash2',
      roles: ['employee']
    };

    // Create test users
    const user1Res = await request(app)
      .post('/api/applicationusers')
      .send(user1);
    const user2Res = await request(app)
      .post('/api/applicationusers')
      .send(user2);

    expect(user1Res.status).toBe(201);
    expect(user2Res.status).toBe(201);

    // Search by username
    const searchByUsernameRes = await request(app)
      .get(`/api/applicationusers/username/${user1.username}`);
    expect(searchByUsernameRes.status).toBe(200);
    expect(searchByUsernameRes.body.username).toBe(user1.username);

    // Search by email
    const searchByEmailRes = await request(app)
      .get(`/api/applicationusers/email/${user2.email}`);
    expect(searchByEmailRes.status).toBe(200);
    expect(searchByEmailRes.body.email).toBe(user2.email);

    // Clean up
    await request(app).delete(`/api/applicationusers/${user1Res.body.id}`);
    await request(app).delete(`/api/applicationusers/${user2Res.body.id}`);
  });

  it('should provide user statistics', async () => {
    const statsRes = await request(app)
      .get('/api/applicationusers/admin/stats');
    expect(statsRes.status).toBe(200);
    expect(typeof statsRes.body.total).toBe('number');
    expect(typeof statsRes.body.available).toBe('number');
    expect(typeof statsRes.body.roles).toBe('object');
    expect(typeof statsRes.body.departments).toBe('object');
  });

  it('should handle advanced search with filters', async () => {
    const searchRes = await request(app)
      .get('/api/applicationusers/admin/search')
      .query({ 
        role: 'employee',
        isAvailable: 'true'
      });
    expect(searchRes.status).toBe(200);
    expect(Array.isArray(searchRes.body)).toBe(true);
  });

  it('should handle bulk role updates', async () => {
    const user1 = {
      username: 'bulk1',
      email: 'bulk1@example.com',
      passwordHash: 'hash1',
      roles: ['employee']
    };

    const user2 = {
      username: 'bulk2',
      email: 'bulk2@example.com', 
      passwordHash: 'hash2',
      roles: ['employee']
    };

    // Create test users
    const user1Res = await request(app).post('/api/applicationusers').send(user1);
    const user2Res = await request(app).post('/api/applicationusers').send(user2);

    const userIds = [user1Res.body.id, user2Res.body.id];
    const newRoles = ['manager'];

    // Bulk update roles
    const bulkUpdateRes = await request(app)
      .patch('/api/applicationusers/admin/bulk-roles')
      .send({ userIds, roles: newRoles });
    
    expect(bulkUpdateRes.status).toBe(200);
    expect(bulkUpdateRes.body.count).toBe(2);

    // Clean up
    await request(app).delete(`/api/applicationusers/${user1Res.body.id}`);
    await request(app).delete(`/api/applicationusers/${user2Res.body.id}`);
  });
}); 