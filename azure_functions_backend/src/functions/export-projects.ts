import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { exportService, type ProjectExportOptions } from "../services/export.service";

app.http('export-projects', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        try {
            if (request.method !== 'POST') {
                return {
                    status: 405,
                    jsonBody: { error: 'Method not allowed' }
                };
            }

            const body = await request.json();
            const { format, filters, companyId } = body as ProjectExportOptions;

            // Validate required fields
            if (!format || !['excel', 'csv'].includes(format)) {
                return {
                    status: 400,
                    jsonBody: { error: 'Invalid format. Must be "excel" or "csv"' }
                };
            }

            if (!filters) {
                return {
                    status: 400,
                    jsonBody: { error: 'Filters are required' }
                };
            }

            // Generate export
            const exportResult = await exportService.exportProjects({
                format,
                filters,
                companyId
            });

            // Return the file as a download
            return {
                status: 200,
                headers: {
                    'Content-Type': exportResult.contentType,
                    'Content-Disposition': `attachment; filename="${exportResult.filename}"`,
                    'Content-Length': exportResult.buffer.length.toString(),
                    'Cache-Control': 'no-cache',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                },
                body: exportResult.buffer
            };
        } catch (error: any) {
            context.error('Export projects error:', error);
            return {
                status: 500,
                jsonBody: { error: error.message || 'Failed to export projects' }
            };
        }
    }
});

app.http('export-projects-filters', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        try {
            if (request.method !== 'GET') {
                return {
                    status: 405,
                    jsonBody: { error: 'Method not allowed' }
                };
            }

            const filters = await exportService.getProjectExportFilters();
            
            return {
                status: 200,
                jsonBody: filters
            };
        } catch (error: any) {
            context.error('Get project export filters error:', error);
            return {
                status: 500,
                jsonBody: { error: error.message || 'Failed to get project export filters' }
            };
        }
    }
}); 