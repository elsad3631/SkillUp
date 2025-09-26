import ApiService from "@/core/services/ApiService";

export interface PayslipProcessingOptions {
  autoMatch: boolean;
  createFolders: boolean;
  sendEmail: boolean;
}

export interface PayslipProcessingResult {
  extractedCount: number;
  matchedCount: number;
  unmatched: Array<{
    fileName: string;
    fiscalCode?: string;
    reason: string;
  }>;
  processedFiles: Array<{
    fileName: string;
    employeeId: string;
    fiscalCode?: string;
    filePath: string;
  }>;
}

/**
 * Service for processing payslips
 */
class PayslipService {
  /**
   * Process a PDF containing multiple payslips
   */
  async processPayslipsPDF(
    file: File,
    options: PayslipProcessingOptions,
    companyId?: string
  ): Promise<PayslipProcessingResult> {
    try {
      const formData = new FormData();
      formData.append('payslipsPdf', file);
      formData.append('options', JSON.stringify(options));
      
      if (companyId) {
        formData.append('companyId', companyId);
      }

      const response = await ApiService.post('/processPayslips', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return {
          extractedCount: response.data.extractedCount,
          matchedCount: response.data.matchedCount,
          unmatched: response.data.unmatched || [],
          processedFiles: response.data.processedFiles || []
        };
      } else {
        throw new Error(response.data.message || 'Failed to process payslips');
      }
    } catch (error: any) {
      console.error('Error processing payslips:', error);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.details) {
        throw new Error(error.response.data.details);
      } else {
        throw new Error(error.message || 'Failed to process payslips');
      }
    }
  }

  /**
   * Get payslip processing history (if needed in the future)
   */
  async getProcessingHistory(companyId?: string): Promise<any[]> {
    try {
      const params = companyId ? { companyId } : {};
      const response = await ApiService.get('/payslips/history', { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching payslip processing history:', error);
      return [];
    }
  }
}

// Export singleton instance
export const payslipService = new PayslipService();
export default payslipService;
