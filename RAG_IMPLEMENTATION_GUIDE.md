# RAG Implementation Guide - Azure AI Search + OpenAI

## Overview
This implementation provides a complete RAG (Retrieval-Augmented Generation) system using Azure AI Search for document retrieval and Azure OpenAI for answer generation.

## 🎯 RAG Process Flow

### 1. **INDEXING STEP** (Document Processing)
When documents are uploaded to the system:
```
Document Upload → Content Extraction → Azure AI Search Index
```

### 2. **RETRIEVAL STEP** (Search)
When user asks a question:
```
User Question → Azure AI Search Query → Relevant Documents Retrieved
```

### 3. **AUGMENTED GENERATION STEP** (Answer Generation)
Using retrieved documents as context:
```
Retrieved Documents + User Question → OpenAI → Contextual Answer
```

## 🔧 Implementation Details

### Backend Architecture

#### 1. **Azure Search Service** (`azure_functions_backend/src/services/azureSearch.service.ts`)

**INDEXING STEP:**
```typescript
async indexDocument(document: {
  fileName: string;
  filePath: string;
  content: string;
  entityType: string;
  entityId: string;
  contentType: string;
  size: number;
  lastModified: Date;
}): Promise<boolean>
```

**RETRIEVAL STEP:**
```typescript
async searchDocuments(query: SearchQuery): Promise<SearchSource[]>
```

**AUGMENTED GENERATION STEP:**
```typescript
async generateAnswer(question: string, sources: SearchSource[]): Promise<string>
```

#### 2. **Azure Functions Endpoints**

- `POST /api/azure-search/ask` - Main RAG endpoint
- `POST /api/azure-search/index` - Index documents
- `DELETE /api/azure-search/delete` - Remove documents from index
- `GET /api/azure-search/health` - Service health check
- `GET /api/azure-search/insights/{entityType}/{entityId}` - Document insights
- `GET /api/azure-search/suggestions/{entityType}/{entityId}` - Suggested questions

### Frontend Integration

#### 1. **AI Search Service** (`frontend/app/src/core/services/businessServices/AzureAISearch.ts`)
Handles communication with backend RAG endpoints.

#### 2. **AI Search Modal** (`frontend/app/src/components/project/AISearchModal.vue`)
User interface for asking questions and viewing RAG results.

## 🚀 Configuration

### Environment Variables
```bash
# Azure AI Search Configuration
AZURE_SEARCH_ENDPOINT=https://your-search-service.search.windows.net
AZURE_SEARCH_API_KEY=your-search-api-key
AZURE_SEARCH_INDEX_NAME=project-documents

# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://intentopenaisrv.openai.azure.com/
AZURE_OPENAI_API_KEY=your-openai-api-key
AZURE_OPENAI_DEPLOYMENT=GPT4O
```

### Azure AI Search Index Schema
```json
{
  "name": "project-documents",
  "fields": [
    { "name": "id", "type": "Edm.String", "key": true },
    { "name": "fileName", "type": "Edm.String", "searchable": true },
    { "name": "filePath", "type": "Edm.String", "searchable": true },
    { "name": "content", "type": "Edm.String", "searchable": true },
    { "name": "entity_type", "type": "Edm.String", "filterable": true },
    { "name": "entity_id", "type": "Edm.String", "filterable": true },
    { "name": "contentType", "type": "Edm.String" },
    { "name": "size", "type": "Edm.Int64" },
    { "name": "lastModified", "type": "Edm.DateTimeOffset" },
    { "name": "metadata_storage_name", "type": "Edm.String" }
  ],
  "suggesters": [
    {
      "name": "sg",
      "searchMode": "analyzingInfixMatching",
      "sourceFields": ["fileName", "content"]
    }
  ],
  "semantic": {
    "configurations": [
      {
        "name": "default",
        "prioritizedFields": {
          "titleField": { "fieldName": "fileName" },
          "contentFields": [{ "fieldName": "content" }],
          "keywordsFields": [{ "fieldName": "fileName" }]
        }
      }
    ]
  }
}
```

## 📋 Usage Examples

### 1. **Indexing a Document**
```typescript
// When a document is uploaded
const success = await azureAISearchService.indexDocument({
  fileName: 'project-plan.pdf',
  filePath: 'projects/123/documents/project-plan.pdf',
  content: 'Extracted text content from the document...',
  entityType: 'project',
  entityId: '123',
  contentType: 'application/pdf',
  size: 1024000,
  lastModified: new Date()
});
```

### 2. **Asking a Question (RAG Process)**
```typescript
// User asks a question for a project
const result = await azureAISearchService.askQuestion({
  question: 'What are the main deliverables?',
  entityType: 'project',
  entityId: '123',
  maxResults: 5
});

// User asks a question for an employee
const result = await azureAISearchService.askQuestion({
  question: 'What documents are available?',
  entityType: 'employee',
  entityId: 'emp-456',
  maxResults: 5
});

// Result contains:
// - answer: AI-generated response
// - sources: Retrieved documents with relevance scores
// - confidence: Overall confidence score
// - queryTime: Processing time
```

### 3. **Deleting a Document**
```typescript
// When a document is deleted
const success = await azureAISearchService.deleteDocument(
  'projects/123/documents/old-file.pdf',
  'project',
  '123'
);
```

## 🔍 RAG Process Deep Dive

### Step 1: Document Indexing
1. **Content Extraction**: Extract text from uploaded documents (PDF, DOCX, etc.)
2. **Chunking**: Split large documents into manageable chunks
3. **Metadata Addition**: Add project ID, file path, timestamps
4. **Azure Search Indexing**: Store in Azure AI Search with semantic capabilities

### Step 2: Retrieval (Search)
1. **Query Processing**: Process user question for search
2. **Semantic Search**: Use Azure AI Search semantic capabilities
3. **Relevance Scoring**: Rank documents by relevance
4. **Context Selection**: Select top N most relevant documents

### Step 3: Augmented Generation
1. **Context Preparation**: Format retrieved documents as context
2. **Prompt Engineering**: Create structured prompt with context
3. **OpenAI Generation**: Generate answer using GPT-4
4. **Response Formatting**: Format answer with citations

## 🎯 Benefits of This RAG Implementation

### 1. **Accuracy**
- Answers based on actual document content
- Reduces hallucinations
- Provides source citations

### 2. **Relevance**
- Semantic search finds most relevant documents
- Project-specific filtering
- Real-time document updates

### 3. **Scalability**
- Azure AI Search handles large document collections
- Efficient indexing and retrieval
- Supports multiple projects

### 4. **User Experience**
- Natural language questions
- Instant responses
- Source document transparency

## 🔧 Advanced Features

### 1. **Semantic Search**
- Uses Azure AI Search semantic capabilities
- Better understanding of user intent
- Improved relevance scoring

### 2. **Project Isolation**
- Documents filtered by project ID
- Secure access control
- Project-specific insights

### 3. **Fallback Mechanism**
- Mock data when Azure Search unavailable
- Graceful degradation
- Development-friendly

### 4. **Performance Optimization**
- Configurable result limits
- Caching strategies
- Async processing

## 🚨 Error Handling

### 1. **Azure Search Unavailable**
- Falls back to mock data
- Logs errors for debugging
- User-friendly error messages

### 2. **OpenAI Errors**
- Retry mechanisms
- Alternative response generation
- Error logging

### 3. **Document Processing Errors**
- Graceful failure handling
- Partial indexing support
- Error recovery

## 📊 Monitoring and Analytics

### 1. **Search Analytics**
- Query performance metrics
- Document relevance scores
- User interaction patterns

### 2. **System Health**
- Azure Search availability
- OpenAI response times
- Error rates

### 3. **Usage Insights**
- Popular questions
- Document access patterns
- Project activity metrics

## 🔮 Future Enhancements

### 1. **Advanced RAG Features**
- Multi-turn conversations
- Document summarization
- Cross-project search

### 2. **AI Improvements**
- Custom fine-tuned models
- Domain-specific prompts
- Learning from feedback

### 3. **Integration Enhancements**
- Real-time document processing
- Advanced content extraction
- Multi-format support

## 🧪 Testing

### 1. **Unit Tests**
```typescript
// Test RAG process
describe('RAG Process', () => {
  test('should retrieve relevant documents', async () => {
    const results = await searchDocuments(query);
    expect(results.length).toBeGreaterThan(0);
  });

  test('should generate contextual answers', async () => {
    const answer = await generateAnswer(question, sources);
    expect(answer).toContain('based on the documents');
  });
});
```

### 2. **Integration Tests**
```typescript
// Test complete RAG flow
test('complete RAG flow', async () => {
  // 1. Index document
  await indexDocument(testDocument);
  
  // 2. Ask question
  const result = await askQuestion({
    question: 'What is the project timeline?',
    projectId: 'test-project'
  });
  
  // 3. Verify response
  expect(result.answer).toBeTruthy();
  expect(result.sources.length).toBeGreaterThan(0);
});
```

## 📚 Best Practices

### 1. **Document Processing**
- Extract text accurately
- Handle multiple formats
- Preserve document structure

### 2. **Search Optimization**
- Use semantic search capabilities
- Implement proper filtering
- Optimize query performance

### 3. **Prompt Engineering**
- Clear instructions for AI
- Context formatting
- Citation requirements

### 4. **Error Handling**
- Graceful degradation
- User-friendly messages
- Comprehensive logging

This RAG implementation provides a robust, scalable solution for document-based question answering with high accuracy and user experience. 