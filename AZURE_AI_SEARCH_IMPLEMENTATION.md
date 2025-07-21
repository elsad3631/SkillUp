# Azure AI Search Implementation

## Overview
This implementation adds Azure AI Search functionality to the SkillUp application, allowing users to ask questions about their project documents and receive AI-powered answers based on the document content.

## Features

### 1. AI Document Search
- Users can ask natural language questions about project documents
- AI generates contextual answers based on document content
- Shows confidence scores and source documents
- Provides suggested questions for common queries

### 2. Document Insights
- Analyzes document types and sizes
- Tracks document updates and modifications
- Provides project-specific document statistics

### 3. Search History
- Maintains history of previous searches
- Allows users to review past questions and answers
- Supports clearing search history

## Implementation Details

### Frontend Components

#### 1. Azure AI Search Service (`frontend/app/src/core/services/businessServices/AzureAISearch.ts`)
- Handles communication with Azure AI Search backend
- Manages search queries and responses
- Provides error handling and user feedback

#### 2. AI Search Modal (`frontend/app/src/components/project/AISearchModal.vue`)
- User interface for asking questions
- Displays AI answers with confidence scores
- Shows source documents in expandable accordion
- Provides suggested questions

#### 3. Documents Page Integration (`frontend/app/src/views/project/Documents.vue`)
- Added "Ask AI" button to the documents toolbar
- Integrates AI search modal into the documents interface
- Maintains existing document management functionality

### Backend Services

#### 1. Azure Search Service (`azure_functions_backend/src/services/azureSearch.service.ts`)
- Handles Azure AI Search queries
- Integrates with OpenAI for answer generation
- Provides document insights and suggestions
- Includes health check functionality

#### 2. Azure Functions Endpoints (`azure_functions_backend/src/functions/azureSearch.ts`)
- `POST /api/azure-search/ask` - Ask questions about documents
- `GET /api/azure-search/health` - Check service availability
- `GET /api/azure-search/insights/{projectId}` - Get document insights
- `GET /api/azure-search/suggestions/{projectId}` - Get suggested questions

## Configuration

### Environment Variables
```bash
# Azure Search Configuration
AZURE_SEARCH_ENDPOINT=https://your-search-service.search.windows.net
AZURE_SEARCH_API_KEY=your-search-api-key
AZURE_SEARCH_INDEX_NAME=project-documents

# OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://intentopenaisrv.openai.azure.com/
AZURE_OPENAI_API_KEY=your-openai-api-key
AZURE_OPENAI_DEPLOYMENT=GPT4O
```

### Azure Search Index Schema
The Azure Search index should include the following fields:
```json
{
  "fileName": "string",
  "filePath": "string", 
  "content": "string",
  "projectId": "string",
  "contentType": "string",
  "size": "number",
  "lastModified": "datetime",
  "metadata_storage_name": "string"
}
```

## Usage

### 1. Asking Questions
1. Navigate to a project's Documents page
2. Click the "Ask AI" button in the toolbar
3. Type your question in the search input
4. Click "Ask" or press Enter
5. Review the AI-generated answer and source documents

### 2. Suggested Questions
- The system provides context-aware suggested questions
- Click any suggestion to automatically populate and submit the question
- Suggestions are based on document types and project content

### 3. Source Documents
- Each answer includes relevant source documents
- Click to expand document content
- View relevance scores for each source
- Access original file paths

## Current Implementation Status

### ✅ Completed
- Frontend UI components and integration
- Backend service structure and endpoints
- Mock data for testing and demonstration
- OpenAI integration for answer generation
- Error handling and user feedback

### 🔄 In Progress
- Azure Search service integration (currently using mock data)
- Document indexing and search functionality
- Real-time document analysis

### 📋 Planned
- Advanced search filters and options
- Search result ranking improvements
- Document content extraction and processing
- Search analytics and insights

## Testing

### Frontend Testing
```bash
# Navigate to the frontend directory
cd frontend/app

# Start the development server
npm run dev

# Test the AI search functionality
# 1. Go to a project's Documents page
# 2. Click "Ask AI" button
# 3. Try asking questions about project documents
```

### Backend Testing
```bash
# Navigate to the backend directory
cd azure_functions_backend

# Install dependencies
npm install

# Start the Azure Functions runtime
npm start

# Test the endpoints
curl -X POST http://localhost:7071/api/azure-search/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the main deliverables?", "projectId": "test-project"}'
```

## Future Enhancements

### 1. Advanced Search Features
- Semantic search capabilities
- Multi-language support
- Advanced filtering options
- Search result highlighting

### 2. Document Processing
- Automatic document content extraction
- OCR for scanned documents
- Document classification and tagging
- Real-time document indexing

### 3. AI Improvements
- Custom AI models for specific domains
- Learning from user feedback
- Improved answer quality and relevance
- Multi-turn conversations

### 4. Analytics and Insights
- Search analytics dashboard
- Popular questions and trends
- Document usage statistics
- User behavior analysis

## Troubleshooting

### Common Issues

1. **Azure Search Connection Errors**
   - Verify environment variables are set correctly
   - Check Azure Search service availability
   - Ensure API keys are valid

2. **OpenAI Integration Issues**
   - Verify OpenAI endpoint and API key
   - Check deployment name and configuration
   - Monitor API usage and limits

3. **Frontend Integration Problems**
   - Check API endpoint configuration
   - Verify CORS settings
   - Review browser console for errors

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=azure-search:*
```

## Security Considerations

1. **API Key Management**
   - Store API keys securely in environment variables
   - Rotate keys regularly
   - Use Azure Key Vault for production

2. **Data Privacy**
   - Ensure document content is properly secured
   - Implement user access controls
   - Audit search queries and responses

3. **Rate Limiting**
   - Implement request throttling
   - Monitor API usage
   - Set appropriate limits per user

## Support

For issues or questions about the Azure AI Search implementation:
1. Check the troubleshooting section
2. Review the configuration settings
3. Test with the provided examples
4. Contact the development team 