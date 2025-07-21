# Blob Storage Metadata Implementation

## Overview
This implementation adds metadata support to Azure Blob Storage uploads for employee and project documents. When documents are uploaded, the following metadata is automatically added:

### Required Metadata Fields
- `metadata_storage_name`: String - The filename in blob storage
- `metadata_creation_date`: DateTimeOffset - ISO string of when the file was uploaded
- `document_type`: String - Type of document (employee_document, project_document, employee_folder_placeholder, project_folder_placeholder)

### Conditional Metadata Fields

#### For Employee Documents:
- `employee_id`: String - The employee ID
- `employee_name`: String - Full name of the employee (if available)

#### For Project Documents:
- `project_id`: String - The project ID  
- `project_name`: String - Name of the project (if available)

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
- Added employee information parameter to both methods

#### 3. Project Documents Service (`frontend/app/src/core/services/businessServices/ProjectDocuments.ts`)
- Modified `uploadProjectFile()` to automatically generate project metadata
- Modified `createProjectFolder()` to include metadata for folder placeholders
- Added project information parameter to both methods

#### 4. View Updates
- Updated `frontend/app/src/views/employee/Documents.vue` to pass employee information
- Updated `frontend/app/src/views/project/Documents.vue` to pass project information

## Usage

### Employee Document Upload
When uploading employee documents, the system automatically:
1. Extracts employee information from the injected employee data
2. Generates metadata with employee ID, name, and document type
3. Uploads the file with metadata attached

### Project Document Upload
When uploading project documents, the system automatically:
1. Extracts project information from the injected project data
2. Generates metadata with project ID, name, and document type
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
  "employee_id": "emp-123",
  "employee_name": "John Doe",
  "document_type": "employee_document"
}
```

### Project Document
```json
{
  "metadata_storage_name": "project-plan.pdf",
  "metadata_creation_date": "2024-01-15T10:30:00.000Z",
  "project_id": "proj-456",
  "project_name": "Website Redesign",
  "document_type": "project_document"
}
```

## Benefits
1. **Searchability**: Files can be searched and filtered by metadata
2. **Audit Trail**: Creation dates and ownership information is preserved
3. **Organization**: Clear categorization of document types
4. **Compliance**: Metadata supports regulatory and compliance requirements
5. **Integration**: Metadata enables better integration with other systems

## Testing
To verify metadata is working correctly:
1. Upload a document to an employee or project
2. Use `GET /api/blobstorage/info/{fileName}` to check the metadata
3. Use `GET /api/blobstorage/list?prefix=employees/{id}/` or `projects/{id}/` to see metadata for all files 