# Blob Storage Metadata Implementation

## Overview
This implementation adds metadata support to Azure Blob Storage uploads for employee and project documents. When documents are uploaded, the following metadata is automatically added:

### Required Metadata Fields
- `metadata_storage_name`: String - The filename in blob storage
- `metadata_creation_date`: DateTimeOffset - ISO string of when the file was uploaded
- `entity_type`: String - Type of entity ('employee' or 'project')
- `entity_id`: String - The ID of the employee or project
- `document_type`: String - Type of document (employee_document, project_document, employee_folder_placeholder, project_folder_placeholder)

## Implementation Details

### Backend Changes

#### 1. Blob Storage Service (`azure_functions_backend/src/services/blobstorage.service.ts`)
- Modified `uploadFile()` method to accept optional metadata parameter
- Modified `uploadStream()` method to accept optional metadata parameter
- Metadata is included in the upload options when provided

#### 2. Blob Storage Functions (`azure_functions_backend/src/functions/blobstorage.ts`)
- Updated `blobstorageUploadFile()` to extract metadata from form data or JSON body
- Updated `blobstorageUploadMultipleFiles()` to handle metadata for multiple files
- Updated `blobstorageListFiles()` to include metadata in the response

### Frontend Changes

#### 1. Blob Storage Service (`frontend/app/src/core/services/businessServices/BlobStorage.ts`)
- Updated `uploadFile()` function to accept and send metadata
- Updated `uploadMultipleFiles()` function to accept and send metadata
- Updated `FileListResponse` interface to include metadata

#### 2. Employee Documents Service (`frontend/app/src/core/services/businessServices/EmployeeDocuments.ts`)
- Modified `uploadEmployeeFile()` to automatically generate employee metadata
- Modified `createEmployeeFolder()` to include metadata for folder placeholders
- Uses `entity_type: 'employee'` and `entity_id: employeeId` in metadata

#### 3. Project Documents Service (`frontend/app/src/core/services/businessServices/ProjectDocuments.ts`)
- Modified `uploadProjectFile()` to automatically generate project metadata
- Modified `createProjectFolder()` to include metadata for folder placeholders
- Uses `entity_type: 'project'` and `entity_id: projectId` in metadata

#### 4. View Updates
- Updated `frontend/app/src/views/employee/Documents.vue` to pass employee information
- Updated `frontend/app/src/views/project/Documents.vue` to pass project information

## Usage

### Employee Document Upload
When uploading employee documents, the system automatically:
1. Extracts employee information from the injected employee data
2. Generates metadata with entity type 'employee', entity ID, and document type
3. Uploads the file with metadata attached

### Project Document Upload
When uploading project documents, the system automatically:
1. Extracts project information from the injected project data
2. Generates metadata with entity type 'project', entity ID, and document type
3. Uploads the file with metadata attached

### Metadata Retrieval
Metadata can be retrieved using:
- `GET /api/blobstorage/info/{fileName}` - Returns file properties including metadata
- `GET /api/blobstorage/list` - Returns file list including metadata for each file

## Example Metadata

### Employee Document
```json
{
  "metadata_storage_name": "document.pdf",
  "metadata_creation_date": "2024-01-15T10:30:00.000Z",
  "entity_type": "employee",
  "entity_id": "emp-123",
  "document_type": "employee_document"
}
```

### Project Document
```json
{
  "metadata_storage_name": "project-plan.pdf",
  "metadata_creation_date": "2024-01-15T10:30:00.000Z",
  "entity_type": "project",
  "entity_id": "proj-456",
  "document_type": "project_document"
}
```

### Employee Folder Placeholder
```json
{
  "metadata_storage_name": ".folder_placeholder",
  "metadata_creation_date": "2024-01-15T10:30:00.000Z",
  "entity_type": "employee",
  "entity_id": "emp-123",
  "document_type": "employee_folder_placeholder"
}
```

### Project Folder Placeholder
```json
{
  "metadata_storage_name": ".folder_placeholder",
  "metadata_creation_date": "2024-01-15T10:30:00.000Z",
  "entity_type": "project",
  "entity_id": "proj-456",
  "document_type": "project_folder_placeholder"
}
```

## Benefits of New Metadata Structure

1. **Unified Structure**: Both employee and project documents use the same metadata fields
2. **Scalability**: Easy to extend for other entity types in the future
3. **Consistency**: Standardized approach across all document types
4. **Querying**: Simplified filtering and searching by entity type and ID
5. **Maintenance**: Reduced code duplication and easier maintenance 