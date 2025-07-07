import request from 'supertest';
import express from 'express';
import assetRoutes from '../routes/asset.routes';

const app = express();
app.use(express.json());
app.use('/api/assets', assetRoutes);

describe('Asset API', () => {
  it('dovrebbe inserire un asset nel database', async () => {
    const assetData = { name: 'Laptop', type: 'Hardware', enable: true };
    const response = await request(app)
      .post('/api/assets')
      .send(assetData)
      .expect(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(assetData.name);
    expect(response.body.type).toBe(assetData.type);
    expect(response.body.enable).toBe(assetData.enable);
  });
}); 