import request from 'supertest';
import express from 'express';
import { json } from 'body-parser';
import authRoutes from '../routes/auth.routes';

const app = express();
app.use(json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  it('should register and login a user', async () => {
    const user = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Test1234!',
      roles: ['Employee']
    };
    // Register
    const regRes = await request(app)
      .post('/api/auth/register')
      .send(user);
    expect(regRes.status).toBe(201);
    expect(regRes.body.email).toBe(user.email);
    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user.email).toBe(user.email);
  });
}); 