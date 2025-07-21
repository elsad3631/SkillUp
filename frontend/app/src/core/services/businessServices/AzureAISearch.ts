import ApiService from '@/core/services/ApiService';
import { useAuthStore } from '@/stores/auth';

const store = useAuthStore();

// Types for Azure AI Search
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

export interface SearchHistory {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
  projectId: string;
  sources: SearchSource[];
}

// Azure AI Search Service
class AzureAISearchService {
  private readonly API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:7071';
  
  /**
   * Ask a question about project documents using Azure AI Search
   */
  async askQuestion(query: SearchQuery): Promise<SearchResult | null> {
    try {
      const response = await ApiService.post('/azure-search/ask', query);
      return response.data as SearchResult;
    } catch (error: any) {
      console.error('Error asking question to Azure AI Search:', error);
      store.setError(
        error.response?.data?.message || 'Failed to get answer from AI. Please try again.',
        error.response?.status || 500
      );
      return null;
    }
  }

  /**
   * Get search history for a project
   */
  async getSearchHistory(projectId: string): Promise<SearchHistory[]> {
    try {
      const response = await ApiService.get(`/azure-search/history/${projectId}`);
      return response.data as SearchHistory[];
    } catch (error: any) {
      console.error('Error getting search history:', error);
      store.setError(
        error.response?.data?.message || 'Failed to load search history.',
        error.response?.status || 500
      );
      return [];
    }
  }

  /**
   * Clear search history for a project
   */
  async clearSearchHistory(projectId: string): Promise<boolean> {
    try {
      await ApiService.delete(`/azure-search/history/${projectId}`);
      return true;
    } catch (error: any) {
      console.error('Error clearing search history:', error);
      store.setError(
        error.response?.data?.message || 'Failed to clear search history.',
        error.response?.status || 500
      );
      return false;
    }
  }

  /**
   * Get suggested questions for a project
   */
  async getSuggestedQuestions(projectId: string): Promise<string[]> {
    try {
      const response = await ApiService.get(`/azure-search/suggestions/${projectId}`);
      return response.data as string[];
    } catch (error: any) {
      console.error('Error getting suggested questions:', error);
      return [];
    }
  }

  /**
   * Check if Azure AI Search is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await ApiService.get('/azure-search/health');
      return response.status === 200;
    } catch (error) {
      console.error('Azure AI Search not available:', error);
      return false;
    }
  }

  /**
   * Get document insights for a project
   */
  async getDocumentInsights(projectId: string): Promise<{
    totalDocuments: number;
    documentTypes: Record<string, number>;
    totalSize: number;
    lastUpdated: Date;
  } | null> {
    try {
      const response = await ApiService.get(`/azure-search/insights/${projectId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting document insights:', error);
      return null;
    }
  }

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
      const response = await ApiService.post('/azure-search/index', document);
      return response.status === 200;
    } catch (error: any) {
      console.error('Error indexing document:', error);
      store.setError(
        error.response?.data?.message || 'Failed to index document.',
        error.response?.status || 500
      );
      return false;
    }
  }

  /**
   * Delete a document from Azure AI Search index
   */
  async deleteDocument(filePath: string, projectId: string): Promise<boolean> {
    try {
      const response = await ApiService.delete(`/azure-search/delete?filePath=${encodeURIComponent(filePath)}&projectId=${projectId}`);
      return response.status === 200;
    } catch (error: any) {
      console.error('Error deleting document from index:', error);
      store.setError(
        error.response?.data?.message || 'Failed to delete document from index.',
        error.response?.status || 500
      );
      return false;
    }
  }
}

export const azureAISearchService = new AzureAISearchService();

export default {
  askQuestion: azureAISearchService.askQuestion.bind(azureAISearchService),
  getSearchHistory: azureAISearchService.getSearchHistory.bind(azureAISearchService),
  clearSearchHistory: azureAISearchService.clearSearchHistory.bind(azureAISearchService),
  getSuggestedQuestions: azureAISearchService.getSuggestedQuestions.bind(azureAISearchService),
  checkAvailability: azureAISearchService.checkAvailability.bind(azureAISearchService),
  getDocumentInsights: azureAISearchService.getDocumentInsights.bind(azureAISearchService),
  indexDocument: azureAISearchService.indexDocument.bind(azureAISearchService),
  deleteDocument: azureAISearchService.deleteDocument.bind(azureAISearchService)
}; 