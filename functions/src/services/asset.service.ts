import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const assetService = {
  async createAsset(data: any) {
    return await prisma.asset.create({
      data
    });
  },

  async getAllAssets() {
    return await prisma.asset.findMany({
      orderBy: { name: 'asc' }
    });
  },

  async getAssetById(id: number) {
    const asset = await prisma.asset.findUnique({
      where: { id }
    });

    if (!asset) {
      throw new Error('Asset not found');
    }

    return asset;
  },

  async updateAsset(id: number, data: any) {
    return await prisma.asset.update({
      where: { id },
      data
    });
  },

  async deleteAsset(id: number) {
    return await prisma.asset.delete({
      where: { id }
    });
  }
}; 