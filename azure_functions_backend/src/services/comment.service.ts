import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const commentService = {
  async getAll() {
    return prisma.comment.findMany({
      include: {
        author: {
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
        parentComment: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  async getById(id: string) {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
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
        parentComment: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      }
    });
  },

  async getByEntity(entityType: string, entityId: string) {
    return prisma.comment.findMany({
      where: {
        entityType,
        entityId
      },
      include: {
        author: {
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
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  },

  async getByAuthor(authorId: string) {
    return prisma.comment.findMany({
      where: { authorId },
      include: {
        parentComment: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  async getByAuthorId(authorId: string) {
    return this.getByAuthor(authorId);
  },

  async getRootComments() {
    return prisma.comment.findMany({
      where: { parentCommentId: null },
      include: {
        author: {
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
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  async likeComment(id: string, userId: string) {
    // Likes functionality not implemented in schema
    throw new Error('Likes functionality not available');
  },

  async unlikeComment(id: string, userId: string) {
    // Likes functionality not implemented in schema
    throw new Error('Likes functionality not available');
  },

  async replyToComment(parentId: string, data: any) {
    return prisma.comment.create({
      data: {
        content: data.content,
        authorId: data.authorId,
        entityType: data.entityType,
        entityId: data.entityId,
        parentCommentId: parentId,
        isPrivate: data.isPrivate || false,
      },
      include: {
        author: {
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
        parentComment: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      }
    });
  },

  async getReplies(parentCommentId: string) {
    return prisma.comment.findMany({
      where: { parentCommentId },
      include: {
        author: {
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
        createdAt: 'asc'
      }
    });
  },

  async getPublicComments() {
    return prisma.comment.findMany({
      where: { isPrivate: false },
      include: {
        author: {
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
        parentComment: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  async create(data: any) {
    return prisma.comment.create({
      data: {
        content: data.content,
        entityType: data.entityType,
        entityId: data.entityId,
        authorId: data.authorId,
        parentCommentId: data.parentCommentId,
        isPrivate: data.isPrivate || false,
      },
      include: {
        author: {
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
        parentComment: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      }
    });
  },

  async update(id: string, data: any) {
    return prisma.comment.update({
      where: { id },
      data: {
        content: data.content,
        isPrivate: data.isPrivate,
      },
      include: {
        author: {
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
        parentComment: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      }
    });
  },

  async remove(id: string) {
    return prisma.comment.delete({
      where: { id }
    });
  },

  async removeByEntity(entityType: string, entityId: string) {
    return prisma.comment.deleteMany({
      where: {
        entityType,
        entityId
      }
    });
  },

  async getCommentStats() {
    const totalComments = await prisma.comment.count();
    const publicComments = await prisma.comment.count({
      where: { isPrivate: false }
    });
    const privateComments = await prisma.comment.count({
      where: { isPrivate: true }
    });
    const replies = await prisma.comment.count({
      where: {
        parentCommentId: {
          not: null
        }
      }
    });

    return {
      total: totalComments,
      public: publicComments,
      private: privateComments,
      replies: replies,
      topLevel: totalComments - replies
    };
  },

  async getCommentStatsByEntity(entityType: string, entityId: string) {
    const entityComments = await prisma.comment.findMany({
      where: {
        entityType,
        entityId
      }
    });

    const total = entityComments.length;
    const publicComments = entityComments.filter(c => !c.isPrivate).length;
    const privateComments = entityComments.filter(c => c.isPrivate).length;
    const replies = entityComments.filter(c => c.parentCommentId !== null).length;

    return {
      total,
      public: publicComments,
      private: privateComments,
      replies: replies,
      topLevel: total - replies
    };
  },

  async getCommentStatsByAuthor(authorId: string) {
    const authorComments = await prisma.comment.findMany({
      where: { authorId }
    });

    const total = authorComments.length;
    const publicComments = authorComments.filter(c => !c.isPrivate).length;
    const privateComments = authorComments.filter(c => c.isPrivate).length;
    const replies = authorComments.filter(c => c.parentCommentId !== null).length;

    return {
      total,
      public: publicComments,
      private: privateComments,
      replies: replies,
      topLevel: total - replies
    };
  },

  async searchComments(searchTerm: string) {
    return prisma.comment.findMany({
      where: {
        content: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      include: {
        author: {
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
        parentComment: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}; 