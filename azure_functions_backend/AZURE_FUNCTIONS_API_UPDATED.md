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