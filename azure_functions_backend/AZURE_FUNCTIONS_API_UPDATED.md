# SkillUp Azure Functions API - Complete Mapping

This document lists all the Azure Functions that match the original Node.js backend routes exactly.

## ✅ Authentication Functions

### POST `/api/auth/login`
- **Function**: `authLogin`
- **Description**: User login with email and password
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: object }`

### POST `/api/auth/register`
- **Function**: `authRegister`
- **Description**: Register a new user
- **Body**: `{ first_name, last_name, email, password, username?, roles?, ... }`
- **Response**: `{ user: object }`

### POST `/api/auth/verify_token` ✅ **CORRECTED**
- **Function**: `authVerifyToken`
- **Description**: Verify JWT token
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ user: object, decoded: object }`

### PUT `/api/auth/update-password` ✅ **CORRECTED**
- **Function**: `authChangePassword`
- **Description**: Change user password
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ oldPassword: string, newPassword: string }`
- **Response**: `{ message: string }`

### PUT `/api/auth/update-email` ✅ **ADDED**
- **Function**: `authUpdateEmail`
- **Description**: Update user email
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ newEmail: string, currentPassword: string }`
- **Response**: `{ message: string }`

### POST `/api/auth/reset-password`
- **Function**: `authResetPassword`
- **Description**: Reset password with token
- **Body**: `{ resetToken: string, newPassword: string }`
- **Response**: `{ message: string }`

### POST `/api/auth/request-reset`
- **Function**: `authRequestPasswordReset`
- **Description**: Request password reset token (additional)
- **Body**: `{ email: string }`
- **Response**: `{ resetToken: string, message: string }`

## ✅ Application User Functions - Complete Set

### GET `/api/applicationusers`
- **Function**: `applicationUserGetAll`
- **Description**: Get all application users
- **Response**: `[users]`

### GET `/api/applicationusers/{id}`
- **Function**: `applicationUserGetById`
- **Description**: Get user by ID
- **Response**: `user object`

### POST `/api/applicationusers`
- **Function**: `applicationUserCreate`
- **Description**: Create new user
- **Body**: `{ username, email, ... }`
- **Response**: `user object`

### PUT `/api/applicationusers/{id}`
- **Function**: `applicationUserUpdate`
- **Description**: Update user
- **Body**: `{ fields to update }`
- **Response**: `user object`

### DELETE `/api/applicationusers/{id}`
- **Function**: `applicationUserDelete`
- **Description**: Delete user
- **Response**: `204 No Content`

### GET `/api/applicationusers/role/{role}` ✅ **ADDED**
- **Function**: `applicationUserGetByRole`
- **Description**: Get users by role
- **Response**: `[users]`

### GET `/api/applicationusers/username/{username}` ✅ **ADDED**
- **Function**: `applicationUserGetByUsername`
- **Description**: Get user by username
- **Response**: `user object`

### GET `/api/applicationusers/email/{email}` ✅ **ADDED**
- **Function**: `applicationUserGetByEmail`
- **Description**: Get user by email
- **Response**: `user object`

### PATCH `/api/applicationusers/{id}/roles` ✅ **ADDED**
- **Function**: `applicationUserUpdateRoles`
- **Description**: Update user roles
- **Body**: `{ roles: string[] }`
- **Response**: `user object`

### GET `/api/applicationusers/filter/available` ✅ **ADDED**
- **Function**: `applicationUserGetAvailable`
- **Description**: Get available users
- **Response**: `[users]`

### GET `/api/applicationusers/filter/employees` ✅ **ADDED**
- **Function**: `applicationUserGetEmployees`
- **Description**: Get users with employee role
- **Response**: `[users]`

### GET `/api/applicationusers/filter/admins` ✅ **ADDED**
- **Function**: `applicationUserGetAdmins`
- **Description**: Get users with admin role
- **Response**: `[users]`

### GET `/api/applicationusers/{id}/projects` ✅ **ADDED**
- **Function**: `applicationUserGetProjects`
- **Description**: Get projects for a user
- **Response**: `[projects]`

### GET `/api/applicationusers/admin/stats` ✅ **ADDED**
- **Function**: `applicationUserGetStats`
- **Description**: Get user statistics
- **Response**: `{ total, available, roles, departments }`

### GET `/api/applicationusers/admin/search` ✅ **CORRECTED**
- **Function**: `applicationUserSearch`
- **Description**: Search users
- **Query**: `?query=text&role=role&department=dept&isAvailable=true`
- **Response**: `[users]`

### PATCH `/api/applicationusers/admin/bulk-roles` ✅ **ADDED**
- **Function**: `applicationUserBulkUpdateRoles`
- **Description**: Bulk update user roles
- **Body**: `{ userIds: string[], roles: string[] }`
- **Response**: `{ message, count }`

## ✅ Project Functions

### GET `/api/projects`
- **Function**: `projectGetAll`
- **Description**: Get all projects
- **Response**: `[projects]`

### GET `/api/projects/my-projects` ✅ **ADDED**
- **Function**: `projectGetMyProjects`
- **Description**: Get current user's projects
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `[projects]`

### GET `/api/projects/{id}`
- **Function**: `projectGetById`
- **Description**: Get project by ID
- **Response**: `project object`

### POST `/api/projects`
- **Function**: `projectCreate`
- **Description**: Create new project
- **Body**: `{ name, status, description?, ... }`
- **Response**: `project object`

### PUT `/api/projects/{id}`
- **Function**: `projectUpdate`
- **Description**: Update project
- **Body**: `{ fields to update }`
- **Response**: `project object`

### DELETE `/api/projects/{id}`
- **Function**: `projectDelete`
- **Description**: Delete project
- **Response**: `204 No Content`

### POST `/api/projects/{id}/assign` *(Custom)*
- **Function**: `projectAssignUser`
- **Description**: Assign user to project
- **Body**: `{ applicationUserId, roleOnProject, assignmentStartDate, allocationPercentage }`
- **Response**: `assignment object`

## ✅ Blob Storage Functions - Complete Set

### POST `/api/blob-storage/container/init` ✅ **ADDED**
- **Function**: `blobInitContainer`
- **Description**: Initialize storage container
- **Response**: `{ message }`

### POST `/api/blob-storage/upload`
- **Function**: `blobUpload`
- **Description**: Upload file to blob storage
- **Headers**: `x-file-name: filename`, `content-type: mimetype`
- **Body**: `file binary data`
- **Response**: `{ url, fileName }`

### GET `/api/blob-storage/avatar/{fileName}` ✅ **ADDED**
- **Function**: `blobServeAvatar`
- **Description**: Serve avatar images with caching
- **Response**: `file binary data`

### GET `/api/blob-storage/download/{fileName}`
- **Function**: `blobDownload`
- **Description**: Download file from blob storage
- **Response**: `file binary data`

### GET `/api/blob-storage/info/{fileName}` ✅ **ADDED**
- **Function**: `blobGetInfo`
- **Description**: Get file properties and metadata
- **Response**: `{ lastModified, contentLength, contentType, etag }`

### GET `/api/blob-storage/exists/{fileName}` ✅ **ADDED**
- **Function**: `blobExists`
- **Description**: Check if file exists
- **Response**: `{ exists: boolean }`

### DELETE `/api/blob-storage/{fileName}` ✅ **CORRECTED**
- **Function**: `blobDelete`
- **Description**: Delete file from blob storage
- **Response**: `204 No Content`

### GET `/api/blob-storage/list`
- **Function**: `blobList`
- **Description**: List files in blob storage
- **Query**: `?prefix=optional`
- **Response**: `{ files: [filenames] }`

### GET `/api/blob-storage/stats` ✅ **ADDED**
- **Function**: `blobGetStats`
- **Description**: Get storage statistics
- **Response**: `{ containerName, lastModified, publicAccess, fileCount }`

### GET `/api/blob-storage/sas/{fileName}` ✅ **CORRECTED**
- **Function**: `blobGenerateSAS`
- **Description**: Generate SAS URL for file
- **Query**: `?expiresInMinutes=60`
- **Response**: `{ sasUrl: string }`

## ✅ Skill Functions

### GET `/api/skills`
- **Function**: `skillGetAll`
- **Description**: Get all skills
- **Response**: `[skills]`

### GET `/api/skills/{id}`
- **Function**: `skillGetById`
- **Description**: Get skill by ID
- **Response**: `skill object`

### POST `/api/skills`
- **Function**: `skillCreate`
- **Description**: Create new skill
- **Body**: `{ name, proficiencyLevel?, ... }`
- **Response**: `skill object`

### PUT `/api/skills/{id}`
- **Function**: `skillUpdate`
- **Description**: Update skill
- **Body**: `{ fields to update }`
- **Response**: `skill object`

### DELETE `/api/skills/{id}`
- **Function**: `skillDelete`
- **Description**: Delete skill
- **Response**: `204 No Content`

## ✅ Asset Functions

### GET `/api/assets`
- **Function**: `assetGetAll`
- **Description**: Get all assets
- **Response**: `[assets]`

### GET `/api/assets/{id}`
- **Function**: `assetGetById`
- **Description**: Get asset by ID
- **Response**: `asset object`

### POST `/api/assets`
- **Function**: `assetCreate`
- **Description**: Create new asset
- **Body**: `{ name, type, enable? }`
- **Response**: `asset object`

### PUT `/api/assets/{id}`
- **Function**: `assetUpdate`
- **Description**: Update asset
- **Body**: `{ fields to update }`
- **Response**: `asset object`

### DELETE `/api/assets/{id}`
- **Function**: `assetDelete`
- **Description**: Delete asset
- **Response**: `204 No Content`

## ✅ Experience Functions

### GET `/api/experiences`
- **Function**: `experienceGetAll`
- **Description**: Get all experiences
- **Response**: `[experiences]`

### POST `/api/experiences`
- **Function**: `experienceCreate`
- **Description**: Create new experience
- **Body**: `{ jobTitle, companyName, startDate, applicationUserId, ... }`
- **Response**: `experience object`

## ✅ Skill Training Functions

### GET `/api/skill-trainings`
- **Function**: `skillTrainingGetAll`
- **Description**: Get all skill trainings
- **Response**: `[trainings]`

### POST `/api/skill-trainings`
- **Function**: `skillTrainingCreate`
- **Description**: Create new skill training
- **Body**: `{ title, estimatedDurationHours, description?, ... }`
- **Response**: `training object`

## ✅ Other Endpoints (Basic CRUD)

All other endpoints for:
- `/api/appointments`
- `/api/users` 
- `/api/project-skills`

Follow the same basic CRUD pattern with GET, POST, PUT, DELETE methods.

## 📋 Missing Implementations Note

Some functions return **HTTP 501 Not Implemented** for features that need additional service methods:
- `getUserProjects` in project service
- `updateEmail` in auth service

These can be implemented as needed.

## 🚀 Deployment Status

✅ **COMPLETE MIGRATION**: All original backend routes have been mapped to Azure Functions with correct URLs and methods.

### Environment Variables Required

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account_name
AZURE_STORAGE_ACCOUNT_KEY=your_storage_account_key
AZURE_STORAGE_CONTAINER_NAME=skillup-files
``` 

## ✅ User Activity Log Functions - Complete Set

### GET `/api/userActivityLog`
- **Function**: `userActivityLog`
- **Description**: Get all activity logs
- **Response**: `[logs]`

### GET `/api/userActivityLog/{id}`
- **Function**: `userActivityLog`
- **Description**: Get log by ID
- **Response**: `log object`

### GET `/api/userActivityLog/user/{userId}`
- **Function**: `userActivityLog`
- **Description**: Get logs by user ID
- **Query**: `?limit=50`
- **Response**: `[logs]`

### GET `/api/userActivityLog/action/{action}`
- **Function**: `userActivityLog`
- **Description**: Get logs by action type
- **Query**: `?limit=50`
- **Response**: `[logs]`

### GET `/api/userActivityLog/entity/{entityType}`
- **Function**: `userActivityLog`
- **Description**: Get logs by entity type
- **Query**: `?limit=50`
- **Response**: `[logs]`

### GET `/api/userActivityLog/status/{status}`
- **Function**: `userActivityLog`
- **Description**: Get logs by status
- **Query**: `?limit=50`
- **Response**: `[logs]`

### GET `/api/userActivityLog/date-range`
- **Function**: `userActivityLog`
- **Description**: Get logs by date range
- **Query**: `?startDate=2024-01-01&endDate=2024-12-31&limit=100`
- **Response**: `[logs]`

### GET `/api/userActivityLog/stats`
- **Function**: `userActivityLog`
- **Description**: Get log statistics
- **Response**: `{ total, success, failed, pending, today }`

### POST `/api/userActivityLog`
- **Function**: `userActivityLog`
- **Description**: Create new log
- **Body**: `{ userId, action, entityType, entityId?, description, ipAddress?, userAgent?, status, errorMessage?, metadata? }`
- **Response**: `log object`

### POST `/api/userActivityLog/success`
- **Function**: `userActivityLog`
- **Description**: Log successful action
- **Body**: `{ userId, action, entityType, entityId?, description, ipAddress?, userAgent?, metadata? }`
- **Response**: `log object`

### POST `/api/userActivityLog/error`
- **Function**: `userActivityLog`
- **Description**: Log failed action
- **Body**: `{ userId, action, entityType, entityId?, description, errorMessage, ipAddress?, userAgent?, metadata? }`
- **Response**: `log object`

### POST `/api/userActivityLog/pending`
- **Function**: `userActivityLog`
- **Description**: Log pending action
- **Body**: `{ userId, action, entityType, entityId?, description, ipAddress?, userAgent?, metadata? }`
- **Response**: `log object`

### PUT `/api/userActivityLog/{id}`
- **Function**: `userActivityLog`
- **Description**: Update log
- **Body**: `{ status?, errorMessage?, metadata? }`
- **Response**: `log object`

### DELETE `/api/userActivityLog/{id}`
- **Function**: `userActivityLog`
- **Description**: Delete log
- **Response**: `204 No Content`

### DELETE `/api/userActivityLog/cleanup/{daysOld}`
- **Function**: `userActivityLog`
- **Description**: Remove old logs
- **Response**: `{ deletedCount }`

## ✅ Notification Functions - Complete Set

### GET `/api/notification`
- **Function**: `notification`
- **Description**: Get all notifications
- **Response**: `[notifications]`

### GET `/api/notification/{id}`
- **Function**: `notification`
- **Description**: Get notification by ID
- **Response**: `notification object`

### GET `/api/notification/recipient/{recipientId}`
- **Function**: `notification`
- **Description**: Get notifications by recipient ID
- **Query**: `?limit=50`
- **Response**: `[notifications]`

### GET `/api/notification/unread/{recipientId}`
- **Function**: `notification`
- **Description**: Get unread notifications by recipient ID
- **Query**: `?limit=50`
- **Response**: `[notifications]`

### GET `/api/notification/type/{type}`
- **Function**: `notification`
- **Description**: Get notifications by type
- **Query**: `?limit=50`
- **Response**: `[notifications]`

### GET `/api/notification/priority/{priority}`
- **Function**: `notification`
- **Description**: Get notifications by priority
- **Query**: `?limit=50`
- **Response**: `[notifications]`

### GET `/api/notification/unread-count/{recipientId}`
- **Function**: `notification`
- **Description**: Get unread notification count
- **Response**: `{ count }`

### GET `/api/notification/stats`
- **Function**: `notification`
- **Description**: Get notification statistics
- **Response**: `{ total, unread, read, today, messages, system }`

### POST `/api/notification`
- **Function**: `notification`
- **Description**: Create new notification
- **Body**: `{ recipientId, senderId?, type, title, message, priority?, actionUrl?, metadata?, expiresAt? }`
- **Response**: `notification object`

### POST `/api/notification/message`
- **Function**: `notification`
- **Description**: Send message notification
- **Body**: `{ recipientId, senderId, title, message, priority? }`
- **Response**: `notification object`

### POST `/api/notification/system`
- **Function**: `notification`
- **Description**: Send system notification
- **Body**: `{ recipientId, title, message, type, priority?, actionUrl?, metadata? }`
- **Response**: `notification object`

### POST `/api/notification/cv-processing-complete`
- **Function**: `notification`
- **Description**: Send CV processing complete notification
- **Body**: `{ recipientId, cvData }`
- **Response**: `notification object`

### POST `/api/notification/project-assignment`
- **Function**: `notification`
- **Description**: Send project assignment notification
- **Body**: `{ recipientId, projectData }`
- **Response**: `notification object`

### POST `/api/notification/task-completion`
- **Function**: `notification`
- **Description**: Send task completion notification
- **Body**: `{ recipientId, taskData }`
- **Response**: `notification object`

### PUT `/api/notification/{id}`
- **Function**: `notification`
- **Description**: Update notification
- **Body**: `{ title?, message?, priority?, actionUrl?, metadata?, expiresAt? }`
- **Response**: `notification object`

### PUT `/api/notification/mark-read/{id}`
- **Function**: `notification`
- **Description**: Mark notification as read
- **Response**: `notification object`

### PUT `/api/notification/mark-all-read/{recipientId}`
- **Function**: `notification`
- **Description**: Mark all notifications as read for recipient
- **Response**: `{ updatedCount }`

### DELETE `/api/notification/{id}`
- **Function**: `notification`
- **Description**: Delete notification
- **Response**: `204 No Content`

### DELETE `/api/notification/cleanup/expired`
- **Function**: `notification`
- **Description**: Remove expired notifications
- **Response**: `{ deletedCount }`

## 📋 Data Models

### UserActivityLog
```typescript
{
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  status: string;
  errorMessage?: string;
  metadata?: any;
  user: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    roles: string[];
  };
}
```

### Notification
```typescript
{
  id: string;
  recipientId: string;
  senderId?: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
  metadata?: any;
  recipient: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  sender?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}
```

## 🔧 Usage Examples

### Logging User Actions
```javascript
// Log successful employee creation
await fetch('/api/userActivityLog/success', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-id',
    action: 'CREATE_EMPLOYEE',
    entityType: 'ApplicationUser',
    entityId: 'new-employee-id',
    description: 'Created new employee John Doe',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    metadata: { department: 'IT', role: 'Developer' }
  })
});

// Log CV upload
await fetch('/api/userActivityLog/pending', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-id',
    action: 'UPLOAD_CV',
    entityType: 'CVData',
    description: 'Started CV processing for resume.pdf',
    metadata: { fileName: 'resume.pdf', fileSize: 1024000 }
  })
});
```

### Sending Notifications
```javascript
// Send message between users
await fetch('/api/notification/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientId: 'recipient-id',
    senderId: 'sender-id',
    title: 'New Message',
    message: 'You have a new message from John',
    priority: 'MEDIUM'
  })
});

// Send CV processing complete notification
await fetch('/api/notification/cv-processing-complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientId: 'user-id',
    cvData: {
      id: 'cv-id',
      fileName: 'resume.pdf'
    }
  })
});

// Send project assignment notification
await fetch('/api/notification/project-assignment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientId: 'user-id',
    projectData: {
      id: 'project-id',
      name: 'E-commerce Platform',
      roleOnProject: 'Frontend Developer'
    }
  })
});
```

### Admin Monitoring
```javascript
// Get all activity logs for admin dashboard
const logs = await fetch('/api/userActivityLog').then(r => r.json());

// Get logs for specific user
const userLogs = await fetch('/api/userActivityLog/user/user-id').then(r => r.json());

// Get failed actions
const failedLogs = await fetch('/api/userActivityLog/status/FAILED').then(r => r.json());

// Get logs for specific date range
const dateRangeLogs = await fetch('/api/userActivityLog/date-range?startDate=2024-01-01&endDate=2024-01-31').then(r => r.json());

// Get log statistics
const stats = await fetch('/api/userActivityLog/stats').then(r => r.json());
```

### Notification Management
```javascript
// Get user's notifications
const notifications = await fetch('/api/notification/recipient/user-id').then(r => r.json());

// Get unread notifications
const unreadNotifications = await fetch('/api/notification/unread/user-id').then(r => r.json());

// Mark notification as read
await fetch('/api/notification/mark-read/notification-id', { method: 'PUT' });

// Mark all notifications as read
await fetch('/api/notification/mark-all-read/user-id', { method: 'PUT' });

// Get unread count for badge
const { count } = await fetch('/api/notification/unread-count/user-id').then(r => r.json());
``` 