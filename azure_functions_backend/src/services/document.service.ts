import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const documentService = {
  async getAll() {
    return prisma.document.findMany({
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
  },

  async getById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async getByUserId(userId: string) {
    return prisma.document.findMany({
      where: { userId },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
  },

  async getByUploaderId(uploaderId: string) {
    return prisma.document.findMany({
      where: { uploadedBy: uploaderId },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
  },

  async getByProjectId(projectId: string) {
    return prisma.document.findMany({
      where: { projectId },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
  },

  async getByCategory(category: string) {
    return prisma.document.findMany({
      where: { category },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
  },

  async getPublicDocuments() {
    return prisma.document.findMany({
      where: { isPublic: true },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
  },

  async getByMimeType(mimeType: string) {
    return prisma.document.findMany({
      where: { mimeType },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
  },

  async getByType(type: string) {
    return prisma.document.findMany({
      where: { 
        OR: [
          { mimeType: { contains: type, mode: 'insensitive' } },
          { category: { contains: type, mode: 'insensitive' } }
        ]
      },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
  },

  async getRecentDocuments(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return prisma.document.findMany({
      where: {
        uploadedAt: {
          gte: cutoffDate
        }
      },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
  },

  async getLargeDocuments(sizeMB: number = 10) {
    const sizeBytes = sizeMB * 1024 * 1024;
    
    return prisma.document.findMany({
      where: {
        fileSize: {
          gte: sizeBytes
        }
      },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        fileSize: 'desc'
      }
    });
  },

  async create(data: any) {
    return prisma.document.create({
      data: {
        fileName: data.fileName,
        originalFileName: data.originalFileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        uploadedBy: data.uploadedBy,
        userId: data.userId,
        projectId: data.projectId,
        category: data.category,
        tags: data.tags || [],
        isPublic: data.isPublic || false,
        description: data.description,
      },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async generateDownloadUrl(id: string) {
    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // In a real implementation, this would generate a signed URL
    // For now, return the file URL with a timestamp
    const timestamp = Date.now();
    return `${document.fileUrl}?t=${timestamp}`;
  },

  async generateShareUrl(id: string, expiryHours: number = 24) {
    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // In a real implementation, this would generate a signed URL with expiry
    // For now, return the file URL with expiry timestamp
    const expiryTime = Date.now() + (expiryHours * 60 * 60 * 1000);
    return `${document.fileUrl}?share=true&expires=${expiryTime}`;
  },

  async createVersion(id: string, data: any) {
    const originalDocument = await prisma.document.findUnique({
      where: { id }
    });

    if (!originalDocument) {
      throw new Error('Original document not found');
    }

    // Create a new version by copying the original with new data
    return prisma.document.create({
      data: {
        fileName: data.fileName || originalDocument.fileName,
        originalFileName: data.originalFileName || originalDocument.originalFileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        mimeType: data.mimeType || originalDocument.mimeType,
        uploadedBy: data.uploadedBy || originalDocument.uploadedBy,
        userId: data.userId || originalDocument.userId,
        projectId: data.projectId || originalDocument.projectId,
        category: data.category || originalDocument.category,
        tags: data.tags || originalDocument.tags,
        isPublic: data.isPublic || originalDocument.isPublic,
        description: data.description || originalDocument.description,
      },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async getVersions(id: string) {
    // In a real implementation, you might have a separate versions table
    // For now, return the current document as the only version
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });

    return document ? [document] : [];
  },

  async update(id: string, data: any) {
    return prisma.document.update({
      where: { id },
      data: {
        fileName: data.fileName,
        originalFileName: data.originalFileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        userId: data.userId,
        projectId: data.projectId,
        category: data.category,
        tags: data.tags,
        isPublic: data.isPublic,
        description: data.description,
      },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async remove(id: string) {
    return prisma.document.delete({
      where: { id }
    });
  },

  async removeByUser(userId: string) {
    return prisma.document.deleteMany({
      where: { userId }
    });
  },

  async removeByProject(projectId: string) {
    return prisma.document.deleteMany({
      where: { projectId }
    });
  },

  async getDocumentStats() {
    const totalDocuments = await prisma.document.count();
    const publicDocuments = await prisma.document.count({
      where: { isPublic: true }
    });
    const privateDocuments = await prisma.document.count({
      where: { isPublic: false }
    });
    const totalSize = await prisma.document.aggregate({
      _sum: {
        fileSize: true
      }
    });

    return {
      total: totalDocuments,
      public: publicDocuments,
      private: privateDocuments,
      totalSize: totalSize._sum.fileSize || 0
    };
  },

  async getDocumentStatsByUser(userId: string) {
    const userDocuments = await prisma.document.findMany({
      where: { userId }
    });

    const total = userDocuments.length;
    const publicDocs = userDocuments.filter(d => d.isPublic).length;
    const privateDocs = userDocuments.filter(d => !d.isPublic).length;
    const totalSize = userDocuments.reduce((sum, doc) => sum + doc.fileSize, 0);

    return {
      total,
      public: publicDocs,
      private: privateDocs,
      totalSize
    };
  },

  async getDocumentStatsByProject(projectId: string) {
    const projectDocuments = await prisma.document.findMany({
      where: { projectId }
    });

    const total = projectDocuments.length;
    const publicDocs = projectDocuments.filter(d => d.isPublic).length;
    const privateDocs = projectDocuments.filter(d => !d.isPublic).length;
    const totalSize = projectDocuments.reduce((sum, doc) => sum + doc.fileSize, 0);

    return {
      total,
      public: publicDocs,
      private: privateDocs,
      totalSize
    };
  },

  async searchDocuments(searchTerm: string) {
    return prisma.document.findMany({
      where: {
        OR: [
          { fileName: { contains: searchTerm, mode: 'insensitive' } },
          { originalFileName: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
  }
}; 