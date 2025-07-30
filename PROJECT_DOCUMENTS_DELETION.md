# Project Documents Deletion Implementation

## Overview

When a project is deleted from the system, all its associated documents stored in Azure Blob Storage are now automatically deleted as well. This ensures data consistency and prevents orphaned files from accumulating in storage.

## Implementation Details

### Backend Changes

#### `azure_functions_backend/src/services/project.service.ts`

**Project Deletion (`remove` method):**
- Added logic to find all project documents using the prefix `projects/{projectId}/documents/`
- Lists all files in the project's document folder
- Deletes all project documents before removing the project from the database
- Deletes related project assignments first, then the project itself

### Frontend Changes

#### `frontend/app/src/views/project/List.vue`

Updated user-facing messages to include "documents" in the deletion warnings:
- Single project deletion: "This will delete the project and all its associated documents. This action cannot be undone!"
- Bulk project deletion: "You are about to delete X projects and all their associated documents. This action cannot be undone!"
- Success messages now mention documents as well

## File Structure

Project documents are stored in Azure Blob Storage with the following structure:
```
projects/{projectId}/documents/
├── folder1/
│   ├── file1.pdf
│   └── file2.docx
├── folder2/
│   └── subfolder/
│       └── file3.xlsx
└── root-file.pdf
```

## Deletion Process

1. **File Discovery**: The system lists all files with the prefix `projects/{projectId}/documents/`
2. **File Deletion**: All discovered files are deleted one by one with error handling
3. **Database Cleanup**: Project assignments are deleted first
4. **Project Removal**: Finally, the project record is deleted from the database

## Error Handling

- If blob storage service is unavailable, the system continues with database deletion
- Individual file deletion failures don't stop the overall process
- Comprehensive logging is provided for debugging purposes

## Benefits

1. **Data Consistency**: No orphaned files left in storage
2. **Storage Cost Optimization**: Automatic cleanup prevents unnecessary storage costs
3. **Project Management**: Ensures complete removal of project data
4. **User Experience**: Clear messaging about what will be deleted

## Testing

To test this functionality:

1. Create a project with documents
2. Upload some files to the project's document folder
3. Delete the project
4. Verify that all project documents are removed from storage

## Logging

The system provides detailed logging:
- Number of project documents found for each project
- File deletion progress
- Any errors encountered during the process

Example log output:
```
Found 3 project documents to delete for project abc123
Deleted project document: projects/abc123/documents/folder1/file1.pdf
Deleted project document: projects/abc123/documents/folder2/file2.docx
Deleted 3 project documents for project abc123
```

## Comparison with Employee Documents Deletion

This implementation follows the same pattern as employee documents deletion:
- Same error handling approach
- Same logging structure
- Same user messaging strategy
- Same file discovery and deletion process

The main difference is the prefix used:
- Employee documents: `employees/{employeeId}/documents/`
- Project documents: `projects/{projectId}/documents/` 