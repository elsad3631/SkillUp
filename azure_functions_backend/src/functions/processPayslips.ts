import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { payslipService, PayslipProcessingOptions } from '../services/payslip.service';
import { userActivityLogService } from '../services/userActivityLog.service';
import { verifyToken } from '../middlewares/auth';
import { applicationUserService } from '../services/applicationuser.service';

// POST /api/processPayslips - Process payslips PDF
export async function processPayslips(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Processing payslips PDF request');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Authorization header required' }
      };
    }

    const token = authHeader.substring(7);
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return {
        status: 401,
        jsonBody: { error: 'Invalid or expired token' }
      };
    }

    // Get current user details
    const currentUser = await applicationUserService.getById(decodedToken.userId);
    if (!currentUser) {
      return {
        status: 401,
        jsonBody: { error: 'User not found' }
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
    const payslipsPdf = formData.get('payslipsPdf') as unknown as File;
    const optionsStr = formData.get('options') as string;
    const companyId = formData.get('companyId') as string;

    if (!payslipsPdf) {
      return {
        status: 400,
        jsonBody: { error: 'Payslips PDF file is required' }
      };
    }

    // Validate file type
    if (payslipsPdf.type !== 'application/pdf') {
      return {
        status: 400,
        jsonBody: { error: 'Only PDF files are allowed' }
      };
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (payslipsPdf.size > maxSize) {
      return {
        status: 400,
        jsonBody: { error: 'File size exceeds 50MB limit' }
      };
    }

    // Parse options
    let options: PayslipProcessingOptions;
    try {
      options = optionsStr ? JSON.parse(optionsStr) : {
        autoMatch: true,
        createFolders: true,
        sendEmail: false
      };
    } catch (error) {
      options = {
        autoMatch: true,
        createFolders: true,
        sendEmail: false
      };
    }

    // Determine company ID
    let targetCompanyId = companyId;
    if (!targetCompanyId) {
      // Use current user's company
      targetCompanyId = currentUser.company || '';
    }

    if (!targetCompanyId) {
      return {
        status: 400,
        jsonBody: { error: 'Company ID is required' }
      };
    }

    // Check permissions
    const userRoles = currentUser.userRoles || [];
    const isSuperAdmin = userRoles.some((role: any) => role.name === 'superadmin');
    const isHR = userRoles.some((role: any) => role.name === 'hr');
    const isAdmin = userRoles.some((role: any) => role.name === 'admin');

    if (!isSuperAdmin && !isHR && !isAdmin) {
      return {
        status: 403,
        jsonBody: { error: 'Insufficient permissions to process payslips' }
      };
    }

    // If not super admin, ensure they can only process for their own company
    if (!isSuperAdmin && currentUser.company !== targetCompanyId) {
      return {
        status: 403,
        jsonBody: { error: 'Cannot process payslips for other companies' }
      };
    }

    context.log(`Processing payslips for company: ${targetCompanyId}`);
    context.log(`Options:`, options);

    // Convert File to Buffer
    const fileBuffer = await payslipsPdf.arrayBuffer();
    const pdfBuffer = Buffer.from(fileBuffer);

    // Process the payslips
    const result = await payslipService.processPayslipsPDF(
      pdfBuffer,
      payslipsPdf.name,
      targetCompanyId,
      options
    );

    // Log the activity
    try {
      await userActivityLogService.create({
        userId: currentUser.id,
        action: 'PROCESS_PAYSLIPS',
        entityType: 'payslips',
        description: `Processed ${result.extractedCount} payslips, ${result.matchedCount} matched successfully`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        status: 'SUCCESS'
      });
    } catch (logError) {
      context.log('Error logging activity:', logError);
      // Don't fail the request if logging fails
    }

    context.log('Payslips processing completed successfully');

    return {
      status: 200,
      jsonBody: {
        success: true,
        message: 'Payslips processed successfully',
        ...result
      }
    };

  } catch (error) {
    context.log('Error processing payslips:', error);
    
    // Log the error activity
    try {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decodedToken = verifyToken(token);
        if (decodedToken) {
          const currentUser = await applicationUserService.getById(decodedToken.userId);
          if (currentUser) {
            await userActivityLogService.create({
              userId: currentUser.id,
              action: 'PROCESS_PAYSLIPS_ERROR',
              entityType: 'payslips',
              description: `Error processing payslips: ${(error as Error).message}`,
              ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              status: 'ERROR',
              errorMessage: (error as Error).message
            });
          }
        }
      }
    } catch (logError) {
      context.log('Error logging error activity:', logError);
    }

    return {
      status: 500,
      jsonBody: { 
        error: 'Internal server error processing payslips',
        details: (error as Error).message 
      }
    };
  }
}

// Register the function
app.http('processPayslips', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: processPayslips
});
