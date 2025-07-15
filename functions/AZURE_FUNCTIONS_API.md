# SkillUp Azure Functions API

This document lists all the Azure Functions that have been migrated from the Node.js backend to Azure Functions.

## Authentication Functions

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

### POST `/api/auth/verify`
- **Function**: `authVerifyToken`
- **Description**: Verify JWT token
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ user: object, decoded: object }`

### POST `/api/auth/change-password`
- **Function**: `authChangePassword`
- **Description**: Change user password
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ oldPassword: string, newPassword: string }`
- **Response**: `{ message: string }`

### POST `/api/auth/reset-password`
- **Function**: `authResetPassword`
- **Description**: Reset password with token
- **Body**: `{ resetToken: string, newPassword: string }`
- **Response**: `{ message: string }`

### POST `/api/auth/request-reset`
- **Function**: `authRequestPasswordReset`
- **Description**: Request password reset token
- **Body**: `{ email: string }`
- **Response**: `{ resetToken: string, message: string }`

## Application User Functions

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

### GET `/api/applicationusers/search`
- **Function**: `applicationUserSearch`
- **Description**: Search users
- **Query**: `?query=text&role=role&department=dept&isAvailable=true`
- **Response**: `[users]`

## Project Functions

### GET `/api/projects`
- **Function**: `projectGetAll`
- **Description**: Get all projects
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

### POST `/api/projects/{id}/assign`
- **Function**: `projectAssignUser`
- **Description**: Assign user to project
- **Body**: `{ applicationUserId, roleOnProject, assignmentStartDate, allocationPercentage }`
- **Response**: `assignment object`

## Skill Functions

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

## Asset Functions

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

## Blob Storage Functions

### POST `/api/blob-storage/upload`
- **Function**: `blobUpload`
- **Description**: Upload file to blob storage
- **Headers**: `x-file-name: filename`, `content-type: mimetype`
- **Body**: `file binary data`
- **Response**: `{ url, fileName }`

### GET `/api/blob-storage/download/{fileName}`
- **Function**: `blobDownload`
- **Description**: Download file from blob storage
- **Response**: `file binary data`

### DELETE `/api/blob-storage/delete/{fileName}`
- **Function**: `blobDelete`
- **Description**: Delete file from blob storage
- **Response**: `204 No Content`

### GET `/api/blob-storage/list`
- **Function**: `blobList`
- **Description**: List files in blob storage
- **Query**: `?prefix=optional`
- **Response**: `{ files: [filenames] }`

### POST `/api/blob-storage/sas/{fileName}`
- **Function**: `blobGenerateSAS`
- **Description**: Generate SAS URL for file
- **Body**: `{ expiresInMinutes?: number }`
- **Response**: `{ sasUrl: string }`

## Experience Functions

### GET `/api/experiences`
- **Function**: `experienceGetAll`
- **Description**: Get all experiences
- **Response**: `[experiences]`

### POST `/api/experiences`
- **Function**: `experienceCreate`
- **Description**: Create new experience
- **Body**: `{ jobTitle, companyName, startDate, applicationUserId, ... }`
- **Response**: `experience object`

## Skill Training Functions

### GET `/api/skill-trainings`
- **Function**: `skillTrainingGetAll`
- **Description**: Get all skill trainings
- **Response**: `[trainings]`

### POST `/api/skill-trainings`
- **Function**: `skillTrainingCreate`
- **Description**: Create new skill training
- **Body**: `{ title, estimatedDurationHours, description?, ... }`
- **Response**: `training object`

## Existing Functions (Already Present)

### POST `/api/cv-extractor`
- **Function**: `CVExtractorFunction`
- **Description**: Extract data from CV files

### GET `/api/test`
- **Function**: `TestFunction`
- **Description**: Test function

## Environment Variables Required

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account_name
AZURE_STORAGE_ACCOUNT_KEY=your_storage_account_key
AZURE_STORAGE_CONTAINER_NAME=skillup-files
```

## Deployment

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Deploy: `func azure functionapp publish <function-app-name>`

## Notes

- All functions use `authLevel: 'anonymous'` - implement proper authentication in production
- Error handling is implemented for all functions
- All services use Prisma for database operations
- Blob storage operations require Azure Storage configuration 