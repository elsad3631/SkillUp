# SkillUp Azure Functions

This project contains Azure Functions for the SkillUp application.

## Functions

### CVExtractorFunction
Extracts data from uploaded CV files (PDF or DOCX) and creates user accounts automatically.

**Endpoint:** `POST /api/CVExtractorFunction`
**Content-Type:** `multipart/form-data`
**Field name:** `cv`

**Supported formats:** 
- PDF files
- DOCX files

**Maximum file size:** 10MB

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create a local.settings.json file):
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DATABASE_URL": "postgresql://username:password@localhost:5432/skillup",
    "AZURE_OPENAI_ENDPOINT": "https://intentopenaisrv.openai.azure.com/",
    "AZURE_OPENAI_API_KEY": "your-api-key-here",
    "AZURE_OPENAI_DEPLOYMENT": "GPT4O"
  }
}
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Build the project:
```bash
npm run build
```

5. Start the Azure Functions runtime:
```bash
npm start
```

### Avviare Azurite eseguendo il comando seguente

```sh
azurite --silent --location c:\azurite --debug c:\azurite\debug.log
```

## Testing

Use tools like Postman or curl to test the CV extraction:

```bash
curl -X POST http://localhost:7071/api/CVExtractorFunction \
  -F "cv=@path/to/your/cv.pdf"
```

## Dependencies

- @azure/functions: Azure Functions runtime
- @prisma/client: Database ORM
- pdf-parse: PDF text extraction
- mammoth: DOCX text extraction
- axios: HTTP client for OpenAI calls
- bcrypt: Password hashing

## Project Structure

```
src/
├── index.ts                    # Main entry point
├── CVExtractorFunction/        # CV extraction function
│   └── index.ts             # Test function
│   └── index.ts
└── services/                  # Business logic services
    ├── applicationuser.service.ts
    └── cvdata.service.ts
prisma/                        # Database schema
skills-list.json              # Available skills list
``` 