import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { cvDataService } from '../services/cvdata.services';

// POST /api/ExtractCVData - Extract data from CV and create user
export async function extractCVData(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // Check if the request has multipart form data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return {
        status: 400,
        jsonBody: { error: 'Request must be multipart/form-data' }
      };
    }

    // Parse the form data
    const formData = await request.formData();
    const cvFile = formData.get('cv') as unknown as File;

    if (!cvFile) {
      return {
        status: 400,
        jsonBody: { error: 'CV file is required' }
      };
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(cvFile.type)) {
      return {
        status: 400,
        jsonBody: { error: 'Only PDF and DOCX files are allowed' }
      };
    }

    // Convert File to Express.Multer.File format expected by cvDataService
    const fileBuffer = await cvFile.arrayBuffer();
    const multerFile = {
      originalname: cvFile.name,
      buffer: Buffer.from(fileBuffer),
      mimetype: cvFile.type,
      size: cvFile.size
    } as Express.Multer.File;

    // Use cvDataService to extract data and create user
    const result = await cvDataService.extractFromCV(multerFile);

    return {
      status: 201,
      jsonBody: result
    };

  } catch (error: any) {
    context.log('Extract CV data error:', error);
    return {
      status: 500,
      jsonBody: { 
        success: false,
        error: error.message || 'Failed to extract CV data and create user' 
      }
    };
  }
}

// Register the route
app.http('extractCVData', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'ExtractCVData',
  handler: extractCVData
}); 