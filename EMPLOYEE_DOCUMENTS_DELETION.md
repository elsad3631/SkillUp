# Employee Documents Deletion Implementation

## Overview

When an employee is deleted from the system, all their associated documents stored in Azure Blob Storage are now automatically deleted as well. This ensures data consistency and prevents orphaned files from accumulating in storage.

## Implementation Details

### Backend Changes

#### `azure_functions_backend/src/services/applicationuser.service.ts`

**Single Employee Deletion (`remove` method):**
- Added logic to find all employee documents using the prefix `employees/{employeeId}/documents/`
- Lists all files in the employee's document folder
- Adds document files to the deletion list along with avatar and CV files
- Deletes all files before removing the employee from the database

**Bulk Employee Deletion (`bulkRemove` method):**
- Added similar logic for bulk deletion operations
- Iterates through all employee IDs and collects their document files
- Deletes all employee documents along with other associated files

### Frontend Changes

#### `frontend/app/src/views/employee/List.vue`

Updated user-facing messages to include "documents" in the deletion warnings:
- Single employee deletion: "This will delete the employee and all their associated files (CV, avatar, documents, etc.)"
- Bulk employee deletion: "You are about to delete X employees and all their associated files (CVs, avatars, documents, etc.)"
- Success messages now mention documents as well

## File Structure

Employee documents are stored in Azure Blob Storage with the following structure:
```
employees/{employeeId}/documents/
├── folder1/
│   ├── file1.pdf
│   └── file2.docx
├── folder2/
│   └── subfolder/
│       └── file3.xlsx
└── root-file.pdf
```

## Deletion Process

1. **File Discovery**: The system lists all files with the prefix `employees/{employeeId}/documents/`
2. **File Collection**: All discovered files are added to the deletion list
3. **Safe Deletion**: Files are deleted one by one, with error handling to continue even if individual files fail to delete
4. **Database Cleanup**: After file deletion, all related database records are removed
5. **Employee Removal**: Finally, the employee record is deleted from the database

## Error Handling

- If blob storage service is unavailable, the system continues with database deletion
- Individual file deletion failures don't stop the overall process
- Comprehensive logging is provided for debugging purposes

## Benefits

1. **Data Consistency**: No orphaned files left in storage
2. **Storage Cost Optimization**: Automatic cleanup prevents unnecessary storage costs
3. **Privacy Compliance**: Ensures complete removal of employee data
4. **User Experience**: Clear messaging about what will be deleted

## Testing

To test this functionality:

1. Create an employee with documents
2. Upload some files to the employee's document folder
3. Delete the employee
4. Verify that all employee documents are removed from storage

## Logging

The system provides detailed logging:
- Number of employee documents found for each user
- File deletion progress
- Any errors encountered during the process

Example log output:
```
Found 5 employee documents to delete for user abc123
Added 5 employee documents to deletion list
Deleted file: employees/abc123/documents/folder1/file1.pdf
Deleted file: employees/abc123/documents/folder2/file2.docx
``` 