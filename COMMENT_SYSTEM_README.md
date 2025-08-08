# Comment System Implementation

## Overview

The comment system provides a generic, reusable commenting functionality that can be attached to any entity in the application (projects, tasks, experiences, etc.). It supports nested comments (replies), private/public comments, and real-time updates.

## Features

### ✅ Core Features
- **Create, Read, Update, Delete** comments
- **Nested comments** (replies to comments)
- **Private and public comments** with visibility control
- **Real-time updates** with immediate UI feedback
- **User authentication** and authorization
- **Rich text support** with markdown-like formatting

### ✅ Entity Support
- **Projects** - Comments on project pages
- **Tasks** - Comments on task management
- **Experiences** - Comments on user experiences
- **Generic entities** - Any custom entity type

### ✅ User Experience
- **Intuitive interface** with clear visual hierarchy
- **Responsive design** that works on all devices
- **Keyboard shortcuts** (Ctrl+Enter to submit)
- **Loading states** and error handling
- **Confirmation dialogs** for destructive actions

## Database Schema

### Comment Model
```sql
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);
```

### Key Fields
- `entityType`: Type of entity (PROJECT, TASK, EXPERIENCE, etc.)
- `entityId`: ID of the specific entity
- `parentCommentId`: For nested comments (replies)
- `isPrivate`: Controls comment visibility
- `authorId`: Links to ApplicationUser

## Backend Implementation

### Service Layer (`comment.service.ts`)
```typescript
export const commentService = {
  async getAll() // Get all comments
  async getById(id: string) // Get specific comment
  async getByEntity(entityType: string, entityId: string) // Get comments for entity
  async create(data: any) // Create new comment
  async update(id: string, data: any) // Update comment
  async remove(id: string) // Delete comment
  async replyToComment(parentId: string, data: any) // Create reply
  async getReplies(parentCommentId: string) // Get replies
  async getCommentStats() // Get statistics
}
```

### API Endpoints
- `GET /api/comment` - Get all comments
- `GET /api/comment/{id}` - Get comment by ID
- `GET /api/comment/entity/{entityType}/{entityId}` - Get comments for entity
- `POST /api/comment` - Create new comment
- `PUT /api/comment/{id}` - Update comment
- `DELETE /api/comment/{id}` - Delete comment
- `POST /api/comment/{id}/reply` - Reply to comment
- `GET /api/comment/stats` - Get comment statistics

## Frontend Implementation

### Components

#### CommentSection.vue
Main component for displaying and managing comments for an entity.

**Props:**
- `entityType`: Type of entity (string)
- `entityId`: ID of the entity (string)

**Events:**
- `comment-added`: Emitted when a new comment is created
- `comment-updated`: Emitted when a comment is updated
- `comment-deleted`: Emitted when a comment is deleted

**Usage:**
```vue
<CommentSection 
  entity-type="PROJECT"
  :entity-id="projectId"
  @comment-added="onCommentAdded"
  @comment-updated="onCommentUpdated"
  @comment-deleted="onCommentDeleted"
/>
```

#### CommentItem.vue
Individual comment component with edit, delete, and reply functionality.

**Features:**
- Display comment content and author
- Edit comment (author only)
- Delete comment (author only)
- Reply to comment
- Nested replies display
- Private comment indicators

### Service Layer (`Comment.ts`)
```typescript
// Core functions
getComments()
getCommentById(id: string)
getCommentsByEntity(entityType: string, entityId: string)
createComment(comment: Partial<Comment>)
updateComment(id: string, comment: Partial<Comment>)
deleteComment(id: string)

// Advanced functions
replyToComment(commentId: string, replyData: Partial<Comment>)
getCommentStats()
getEntityCommentStats(entityType: string, entityId: string)
```

## Usage Examples

### 1. Adding Comments to Projects
```vue
<template>
  <div class="project-page">
    <!-- Project content -->
    
    <!-- Comments section -->
    <CommentSection 
      entity-type="PROJECT"
      :entity-id="project.id"
      @comment-added="handleCommentAdded"
    />
  </div>
</template>

<script>
import CommentSection from "@/components/comment/CommentSection.vue";

export default {
  components: { CommentSection },
  setup() {
    const handleCommentAdded = (comment) => {
      console.log('New comment:', comment);
      // Handle comment added event
    };
    
    return { handleCommentAdded };
  }
};
</script>
```

### 2. Adding Comments to Tasks
```vue
<template>
  <div class="task-page">
    <!-- Task content -->
    
    <!-- Comments section -->
    <CommentSection 
      entity-type="TASK"
      :entity-id="task.id"
    />
  </div>
</template>
```

### 3. Adding Comments to Any Entity
```vue
<template>
  <div class="entity-page">
    <!-- Entity content -->
    
    <!-- Comments section -->
    <CommentSection 
      entity-type="CUSTOM_ENTITY"
      :entity-id="entity.id"
    />
  </div>
</template>
```

## Integration Points

### Project Overview Page
Comments are integrated into the project overview page at `/projects/{id}/overview`.

### Task Management Page
Comments are integrated into the task management page at `/projects/{id}/tasks`.

### Demo Page
A comprehensive demo page is available at `/comments-demo` showcasing:
- Project comments
- Task comments
- Experience comments
- Generic entity comments

## Security & Permissions

### Authentication
- All comment operations require user authentication
- User ID is automatically captured from JWT token

### Authorization
- Users can only edit/delete their own comments
- Private comments are only visible to the author
- Public comments are visible to all users

### Data Validation
- Comment content is validated on both frontend and backend
- Entity type and ID are validated
- XSS protection through content sanitization

## Performance Considerations

### Database Optimization
- Indexed fields: `entityType`, `entityId`, `authorId`, `parentCommentId`
- Efficient queries with proper joins
- Pagination support for large comment lists

### Frontend Optimization
- Lazy loading of comment components
- Debounced search and filtering
- Efficient re-rendering with Vue reactivity

## Future Enhancements

### Planned Features
- **Comment reactions** (like, dislike, etc.)
- **Comment mentions** (@username)
- **File attachments** in comments
- **Comment notifications** via email/push
- **Comment moderation** tools
- **Comment search** functionality
- **Comment export** capabilities

### Technical Improvements
- **Real-time updates** with WebSocket
- **Comment threading** improvements
- **Rich text editor** integration
- **Comment analytics** and reporting
- **Comment backup** and recovery

## Troubleshooting

### Common Issues

1. **Comments not loading**
   - Check entity type and ID are correct
   - Verify user authentication
   - Check network connectivity

2. **Cannot create comments**
   - Ensure user is logged in
   - Check comment content is not empty
   - Verify entity exists

3. **Private comments not working**
   - Check `isPrivate` flag is set correctly
   - Verify user permissions
   - Check database constraints

### Debug Information
- All comment operations are logged
- Error messages are user-friendly
- Console logs provide detailed debugging info

## API Documentation

### Comment Object Structure
```typescript
interface Comment {
  id: string;
  content: string;
  entityType: string;
  entityId: string;
  authorId: string;
  parentCommentId?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    currentRole?: string;
    department?: string;
  };
  parentComment?: Comment;
  replies?: Comment[];
}
```

### Error Responses
```typescript
{
  error: string;
  status: number;
  message?: string;
}
```

## Conclusion

The comment system provides a robust, scalable solution for adding commenting functionality to any entity in the application. It follows best practices for security, performance, and user experience, while maintaining flexibility for future enhancements.

The implementation is production-ready and can be easily extended to support additional features and entity types as needed.
