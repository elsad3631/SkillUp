import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { azureSearchService } from '../services/azureSearch.service';

// POST /api/azure-search/ask - Ask a question about project documents
app.http('askQuestion', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'azure-search/ask',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log('HTTP trigger function processed a request.');

    try {
      if (request.method !== 'POST') {
        return {
          status: 405,
          jsonBody: { error: 'Method not allowed' }
        };
      }

      const body = await request.json() as any;
      const { question, projectId, documentPath, maxResults } = body;

      if (!question) {
        return {
          status: 400,
          jsonBody: { error: 'Question is required' }
        };
      }

      const result = await azureSearchService.askQuestion({
        question,
        projectId,
        documentPath,
        maxResults
      });

      return {
        status: 200,
        jsonBody: result
      };

    } catch (error: any) {
      context.log('Ask question error:', error);
      return {
        status: 500,
        jsonBody: { error: error.message || 'Failed to process question' }
      };
    }
  }
});