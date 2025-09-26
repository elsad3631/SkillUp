# Payslip Processing Feature

## Overview

This feature allows HR administrators to upload a PDF containing multiple payslips and automatically process them to:

1. **Split the PDF** into individual payslip documents
2. **Extract fiscal codes** from each payslip
3. **Match payslips** with employees in the database
4. **Save processed files** locally and optionally to blob storage
5. **Generate processing reports** with matched and unmatched payslips

## How It Works

### Frontend Component

- **Location**: `frontend/app/src/components/employee/UploadPayslipsModal.vue`
- **Trigger**: Button "Carica Buste Paga" in the employee list view
- **Features**:
  - Drag & drop PDF upload (max 50MB)
  - Processing options (auto-match, create folders, send email)
  - Real-time progress tracking
  - Detailed results display

### Backend Processing

- **Azure Function**: `processPayslips` (`/api/processPayslips`)
- **Service**: `payslipService` in `src/services/payslip.service.ts`

#### Processing Steps

1. **Authentication & Authorization**
   - Requires Bearer token
   - Only HR, Admin, or SuperAdmin roles can process payslips
   - SuperAdmin can process for any company, others only for their own

2. **PDF Splitting**
   - Uses `pdf-lib` to split PDF into individual pages
   - Currently assumes one payslip per page (can be enhanced)
   - Each page becomes a separate PDF file

3. **Fiscal Code Extraction**
   - Uses `pdf-parse` to extract text from each PDF
   - Applies Italian fiscal code regex: `/\b[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]\b/g`
   - Takes the first fiscal code found in each document

4. **Employee Matching**
   - Searches database for employees with matching fiscal codes
   - Only matches within the same company
   - Tracks matched and unmatched payslips

5. **File Storage**
   - Saves processed PDFs locally in `processed_payslips/{companyId}/`
   - Option to create separate folders per employee
   - Uploads to Azure Blob Storage with metadata
   - File naming includes employee info and date

## Database Changes

### New Field Added

```sql
-- Added to ApplicationUser table
ALTER TABLE "ApplicationUser" ADD COLUMN "fiscalCode" TEXT;
CREATE UNIQUE INDEX "ApplicationUser_fiscalCode_key" ON "ApplicationUser"("fiscalCode");
```

**Migration**: `20250924162324_add_fiscal_code_to_application_user`

## API Endpoints

### POST /api/processPayslips

**Authentication**: Required (Bearer token)
**Authorization**: HR, Admin, or SuperAdmin roles
**Content-Type**: multipart/form-data

**Request Body**:
- `payslipsPdf` (File): PDF file containing payslips
- `options` (JSON string): Processing options
- `companyId` (string, optional): Target company ID (SuperAdmin only)

**Options Object**:
```json
{
  "autoMatch": true,
  "createFolders": true,
  "sendEmail": false
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payslips processed successfully",
  "extractedCount": 5,
  "matchedCount": 4,
  "unmatched": [
    {
      "fileName": "payslip_page_3.pdf",
      "fiscalCode": "RSSMRA80A01H501Z",
      "reason": "Dipendente non trovato con questo codice fiscale"
    }
  ],
  "processedFiles": [
    {
      "fileName": "Mario_Rossi_RSSMRA80A01H501Z_2024-09-24.pdf",
      "employeeId": "uuid-here",
      "fiscalCode": "RSSMRA80A01H501Z",
      "filePath": "/path/to/file"
    }
  ]
}
```

## File Structure

### Local Storage

```
processed_payslips/
├── {companyId}/
│   ├── Mario_Rossi_{employeeId}/          # If createFolders = true
│   │   └── busta_paga_2024-09-24_RSSMRA80A01H501Z.pdf
│   └── Giulia_Bianchi_BNCGLI85M15F205X_2024-09-24.pdf  # If createFolders = false
```

### Blob Storage

```
payslips/
├── {companyId}/
│   └── {employeeId}/
│       └── busta_paga_2024-09-24_RSSMRA80A01H501Z.pdf
```

**Blob Metadata**:
- `employee_id`: Employee UUID
- `fiscal_code`: Employee fiscal code
- `company_id`: Company UUID
- `upload_date`: ISO timestamp
- `document_type`: "payslip"

## Error Handling

### Common Errors

1. **Authentication Errors** (401)
   - Missing or invalid Bearer token
   - User not found

2. **Authorization Errors** (403)
   - Insufficient permissions
   - Trying to process for other company (non-SuperAdmin)

3. **Validation Errors** (400)
   - Missing PDF file
   - Invalid file type (not PDF)
   - File too large (>50MB)
   - Missing company ID

4. **Processing Errors** (500)
   - PDF corruption or parsing errors
   - Database connection issues
   - File system errors

### Unmatched Payslips

Payslips may remain unmatched for several reasons:
- **No fiscal code found**: PDF text extraction failed or fiscal code not present
- **Employee not found**: No employee with that fiscal code in the company
- **Database errors**: Connection or query issues

## Future Enhancements

### Planned Features

1. **Smart PDF Splitting**
   - Detect payslip boundaries using headers, employee names, or dates
   - Handle multi-page payslips correctly
   - Support different payslip formats per company

2. **Company-Specific Rules**
   - Configurable fiscal code patterns
   - Custom header detection patterns
   - Different splitting strategies per company

3. **Email Integration**
   - Send processed payslips to employees via email
   - Email templates and customization
   - Delivery tracking and confirmations

4. **Enhanced Matching**
   - Fallback matching using employee names
   - Fuzzy matching for similar fiscal codes
   - Manual matching interface for unmatched payslips

5. **Processing History**
   - Track all processing sessions
   - Audit logs for compliance
   - Reprocessing capabilities

### Configuration Options

Future versions will support company-specific configuration:

```json
{
  "companyId": "uuid",
  "parsingRules": {
    "fiscalCodePattern": "custom-regex",
    "headerPatterns": ["BUSTA PAGA", "CEDOLINO"],
    "datePatterns": ["DD/MM/YYYY", "YYYY-MM-DD"],
    "splitStrategy": "header-detection" | "page-based" | "employee-name"
  },
  "emailSettings": {
    "enabled": true,
    "template": "default",
    "subject": "La tua busta paga è disponibile"
  }
}
```

## Security Considerations

1. **Data Privacy**
   - Payslips contain sensitive personal and financial data
   - Files are stored with restricted access
   - Audit logging for all operations

2. **Access Control**
   - Role-based access (HR/Admin/SuperAdmin only)
   - Company isolation (users can only process their company's payslips)
   - Token-based authentication

3. **File Security**
   - Local files stored in protected directory
   - Blob storage with proper access controls
   - Automatic cleanup options (future)

## Troubleshooting

### Common Issues

1. **PDF Not Splitting Correctly**
   - Check if PDF is password-protected
   - Verify PDF is not corrupted
   - Ensure PDF contains text (not just images)

2. **Fiscal Codes Not Detected**
   - Verify fiscal codes are in text format (not images)
   - Check if fiscal code format matches Italian standard
   - Review PDF text extraction quality

3. **Employees Not Matched**
   - Ensure employees have fiscal codes in database
   - Verify company assignment is correct
   - Check for typos in fiscal codes

4. **File Storage Issues**
   - Check disk space availability
   - Verify write permissions on processed_payslips directory
   - Check Azure Blob Storage connection

### Debug Mode

Enable debug logging by setting environment variable:
```
DEBUG_PAYSLIP_PROCESSING=true
```

This will provide detailed logs for:
- PDF splitting process
- Text extraction results
- Fiscal code detection
- Employee matching attempts
- File storage operations

## Dependencies

### Backend
- `pdf-lib`: PDF manipulation and splitting
- `pdf-parse`: Text extraction from PDFs
- `@azure/storage-blob`: Blob storage integration
- `@prisma/client`: Database operations

### Frontend
- Vue 3 composition API
- Bootstrap 5 modals
- File drag & drop functionality
- Progress tracking components

## Testing

### Manual Testing

1. Create test employees with fiscal codes in database
2. Generate test PDF with multiple payslips containing those fiscal codes
3. Upload via the frontend interface
4. Verify files are created in `processed_payslips/` directory
5. Check database logs for processing activity

### Test Data

Sample fiscal codes for testing:
- `RSSMRA80A01H501Z` (Mario Rossi)
- `BNCGLI85M15F205X` (Giulia Bianchi)
- `VRDLCA90T25L219Y` (Luca Verdi)

## Support

For issues or questions regarding payslip processing:

1. Check the troubleshooting section above
2. Review Azure Function logs for detailed error messages
3. Verify database schema includes fiscal code field
4. Ensure all required dependencies are installed
