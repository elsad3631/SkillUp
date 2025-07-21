import axios from 'axios';
import { AzureKeyCredential, OpenAIClient } from '@azure/openai';
import { SearchClient } from "@azure/search-documents";
import { AzureOpenAI } from "openai";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";

// Function to create Clients
function getClients() {
 const credential = new DefaultAzureCredential();

    // Search
    const azureSearchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
    const azureSearchIndexName = process.env.AZURE_SEARCH_INDEX_NAME;
    const azureSearchAdminKey = process.env.AZURE_SEARCH_ADMIN_KEY || '';

    if (!azureSearchEndpoint || !azureSearchIndexName) {
        throw new Error("Missing AZURE_SEARCH_ENDPOINT or AZURE_SEARCH_INDEX_NAME environment variables.");
    }

    const searchClient = new SearchClient(
        azureSearchEndpoint,
        azureSearchIndexName,
        new AzureKeyCredential(azureSearchAdminKey)
    );

    // OpenAI
    const azureOpenAiEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureOpenAiApiVersion = process.env.AZURE_OPENAI_VERSION;
    const azureOpenAiDeploymentName = process.env.AZURE_DEPLOYMENT_MODEL;
    const azureOpenAiKey = process.env.AZURE_OPENAI_KEY;

    if (!azureOpenAiEndpoint || !azureOpenAiApiVersion || !azureOpenAiDeploymentName || !azureOpenAiKey) {
        throw new Error("Missing Azure OpenAI environment variables (AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_VERSION, AZURE_DEPLOYMENT_MODEL).");
    }

   // const scope = "https://cognitiveservices.azure.com/.default";
   // const azureADTokenProvider = getBearerTokenProvider(credential, scope);

    const options = {
        //azureADTokenProvider,
        apiKey: azureOpenAiKey,
        deployment: azureOpenAiDeploymentName,
        apiVersion: azureOpenAiApiVersion,
        endpoint: azureOpenAiEndpoint
    };
    const openaiClient = new AzureOpenAI(options);

    return { openaiClient, searchClient, modelName: azureOpenAiDeploymentName };
}

export interface SearchQuery {
  question: string;
  projectId?: string;
  documentPath?: string;
  maxResults?: number;
}

export interface SearchResult {
  answer: string;
  sources: SearchSource[];
  confidence: number;
  queryTime: number;
}

export interface SearchSource {
  fileName: string;
  filePath: string;
  content: string;
  relevance: number;
  pageNumber?: number;
}

export const azureSearchService = {
  /**
   * Ask a question about project documents using Azure AI Search
   */
  async askQuestion(query: SearchQuery): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
        const { openaiClient, searchClient, modelName } = getClients();

        // Step 1: RETRIEVAL - Search for relevant documents using Azure AI Search
        const searchResults = await this.searchDocuments(searchClient, query);
        
        if (!searchResults || searchResults.length === 0) {
          return {
            answer: "I couldn't find any relevant documents to answer your question. Please try rephrasing your question or check if the documents are properly indexed.",
            sources: [],
            confidence: 0,
            queryTime: Date.now() - startTime
          };
        }

        console.log("Risultati della ricerca: ", searchResults);
        // Step 2: GENERATION - Generate answer using OpenAI with retrieved context
        const response = await this.generateAnswer(openaiClient, query.question, searchResults, modelName || '');
        
        // Parse the response
        const content = response.choices?.[0]?.message?.content || 'No answer generated';
        
        // Convert search results to SearchSource format
        const sources: SearchSource[] = searchResults.map((result: any, index: number) => ({
          fileName: result.fileName || `Document ${index + 1}`,
          filePath: result.filePath || '',
          content: result.content || result.chunk || '',
          relevance: result.score || 1.0 - (index * 0.1),
          pageNumber: result.pageNumber
        }));

        return {
          answer: content,
          sources: sources,
          confidence: 0.8, // You could calculate this based on search scores
          queryTime: Date.now() - startTime
        };

    } catch (error) {
      console.error('Error in Azure Search query:', error);
      throw new Error('Failed to process your question. Please try again.');
    }
  },

  /**
   * RETRIEVAL STEP: Search for relevant documents using Azure AI Search with Azure AD authentication
   */
  async searchDocuments(searchClient: SearchClient<any>, query: SearchQuery): Promise<any[]> {
    if (!query.question) {
        throw new Error('La query utente non può essere vuota.');
    }

    try {
        console.log(`Searching for: "${query.question}"\n`);
        
        const searchResults = await searchClient.search(query.question, {
            top: query.maxResults || 5,
            select: ["parent_id", "chunk", "title", "employee_id", "project_id"],
            //filter: query.projectId ? `parent_id eq '${query.projectId}'` : undefined
        });
    
        const results = [];
        for await (const result of searchResults.results) {
            const doc = result.document;
            results.push({
                content: doc.content || doc.chunk || '',
                fileName: doc.fileName || doc.title || 'Unknown',
                filePath: doc.filePath || '',
                pageNumber: doc.pageNumber,
                score: result.score,
                projectId: doc.project_id,
                employeeId: doc.employee_id
            });
        }

        return results;

    } catch (error) {
        console.error('Errore durante il recupero dei documenti da Azure AI Search:', error);
        throw new Error('Impossibile recuperare i documenti pertinenti: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  },

  /**
   * AUGMENTED GENERATION STEP: Generate answer using OpenAI with retrieved context using grounded prompt
   */
  async generateAnswer(openaiClient: AzureOpenAI, query: string, sources: any[], modelName: string): Promise<any> {
    try {
        // Format sources for the prompt
        const sourcesFormatted = sources.map(source => 
            `File: ${source.fileName}\nContent: ${source.content}\n`
        ).join("\n---\n");

        const GROUNDED_PROMPT = `
        You are a helpful assistant that answers questions based on the provided documents.
        Answer the query using only the sources provided below in a clear and concise manner.
        Answer ONLY with the facts listed in the sources below.
        If there isn't enough information in the sources, say you don't know.
        Do not generate answers that don't use the sources below.
       
       Query: ${query}
       Sources: ${sourcesFormatted}
       `;
       
        return await openaiClient.chat.completions.create({
            model: modelName,
            messages: [
                {
                    role: "user",
                    content: GROUNDED_PROMPT,
                }
            ],
            temperature: 0.7,
            max_tokens: 800,
        });

    } catch (error) {
      console.error('Error generating answer with OpenAI:', error);
      throw new Error('I encountered an error while processing your question. Please try again.');
    }
  },

  /**
   * Check if Azure Search service is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const { searchClient } = getClients();
      await searchClient.search("*", { top: 1 });
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  /**
   * Index a document in Azure AI Search
   */
  async indexDocument(document: {
    fileName: string;
    filePath: string;
    content: string;
    projectId: string;
    contentType?: string;
    size?: number;
    lastModified?: Date;
  }): Promise<boolean> {
    try {
      const { searchClient } = getClients();
      
      const doc = {
        id: document.filePath,
        fileName: document.fileName,
        filePath: document.filePath,
        content: document.content,
        project_id: document.projectId,
        contentType: document.contentType || 'application/octet-stream',
        size: document.size || 0,
        lastModified: document.lastModified || new Date(),
        timestamp: new Date()
      };

      await searchClient.uploadDocuments([doc]);
      return true;
    } catch (error) {
      console.error('Error indexing document:', error);
      return false;
    }
  },

  /**
   * Delete a document from Azure AI Search index
   */
  async deleteDocument(filePath: string, projectId: string): Promise<boolean> {
    try {
      const { searchClient } = getClients();
      
      await searchClient.deleteDocuments([{
        id: filePath,
        project_id: projectId
      }]);
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  },
}; 