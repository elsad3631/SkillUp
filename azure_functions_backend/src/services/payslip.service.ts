import { PDFDocument, PDFPage } from 'pdf-lib';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { blobStorageService } from './blobstorage.service';

const prisma = new PrismaClient();

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
    employeeId?: string;
    fiscalCode?: string;
    filePath: string;
  }>;
}

export interface ExtractedPayslip {
  pageNumbers: number[];
  content: string;
  fiscalCode?: string;
  fileName: string;
  pdfBuffer: Buffer;
}

export const payslipService = {
  /**
   * Process a PDF containing multiple payslips
   */
  async processPayslipsPDF(
    pdfBuffer: Buffer,
    originalFileName: string,
    companyId: string,
    options: PayslipProcessingOptions
  ): Promise<PayslipProcessingResult> {
    try {
      console.log(`Processing payslips PDF: ${originalFileName} for company: ${companyId}`);
      
      // Step 1: Split PDF into individual payslips
      const extractedPayslips = await this.splitPDFIntoPayslips(pdfBuffer, originalFileName);
      console.log(`Extracted ${extractedPayslips.length} payslips from PDF`);

      // Step 2: Extract fiscal codes from each payslip
      const payslipsWithFiscalCodes = await this.extractFiscalCodesFromPayslips(extractedPayslips);
      
      // Step 3: Match payslips with employees
      const matchingResults = await this.matchPayslipsWithEmployees(payslipsWithFiscalCodes, companyId);

      // Step 4: Save processed files
      const savedFiles = await this.saveProcessedPayslips(matchingResults.matched, companyId, options);

      // Step 5: Prepare results
      const result: PayslipProcessingResult = {
        extractedCount: extractedPayslips.length,
        matchedCount: matchingResults.matched.length,
        unmatched: matchingResults.unmatched,
        processedFiles: savedFiles
      };

      console.log('Payslip processing completed:', result);
      return result;

    } catch (error) {
      console.error('Error processing payslips PDF:', error);
      throw error;
    }
  },

  /**
   * Split PDF into individual payslips based on page breaks
   */
  async splitPDFIntoPayslips(pdfBuffer: Buffer, originalFileName: string): Promise<ExtractedPayslip[]> {
    try {
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const totalPages = pdfDoc.getPageCount();
      const extractedPayslips: ExtractedPayslip[] = [];

      console.log(`PDF has ${totalPages} pages`);

      // For now, we'll assume each payslip is exactly one page
      // This can be enhanced later with more sophisticated logic
      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();
        const fileName = `${path.parse(originalFileName).name}_page_${i + 1}.pdf`;

        // Extract text content for fiscal code detection
        const textContent = await this.extractTextFromPDFBuffer(Buffer.from(pdfBytes));

        extractedPayslips.push({
          pageNumbers: [i + 1],
          content: textContent,
          fileName,
          pdfBuffer: Buffer.from(pdfBytes)
        });
      }

      return extractedPayslips;
    } catch (error) {
      console.error('Error splitting PDF:', error);
      throw new Error(`Failed to split PDF: ${(error as Error).message}`);
    }
  },

  /**
   * Extract text content from PDF buffer
   */
  async extractTextFromPDFBuffer(pdfBuffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(pdfBuffer);
      return data.text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return '';
    }
  },

  /**
   * Extract fiscal codes from payslips
   */
  async extractFiscalCodesFromPayslips(payslips: ExtractedPayslip[]): Promise<ExtractedPayslip[]> {
    const fiscalCodeRegex = /\b[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]\b/g;
    
    return payslips.map(payslip => {
      const matches = payslip.content.match(fiscalCodeRegex);
      if (matches && matches.length > 0) {
        // Take the first fiscal code found
        payslip.fiscalCode = matches[0];
        console.log(`Found fiscal code ${payslip.fiscalCode} in ${payslip.fileName}`);
      } else {
        console.warn(`No fiscal code found in ${payslip.fileName}`);
      }
      return payslip;
    });
  },

  /**
   * Match payslips with employees based on fiscal codes
   */
  async matchPayslipsWithEmployees(
    payslips: ExtractedPayslip[],
    companyId: string
  ): Promise<{
    matched: Array<ExtractedPayslip & { employeeId: string; employee: any }>;
    unmatched: Array<{ fileName: string; fiscalCode?: string; reason: string }>;
  }> {
    const matched: Array<ExtractedPayslip & { employeeId: string; employee: any }> = [];
    const unmatched: Array<{ fileName: string; fiscalCode?: string; reason: string }> = [];

    for (const payslip of payslips) {
      if (!payslip.fiscalCode) {
        unmatched.push({
          fileName: payslip.fileName,
          fiscalCode: payslip.fiscalCode,
          reason: 'Codice fiscale non trovato nel documento'
        });
        continue;
      }

      try {
        // Find employee by fiscal code in the same company
        const employee = await prisma.applicationUser.findFirst({
          where: {
            fiscalCode: payslip.fiscalCode,
            company: companyId
          },
          include: {
            userRoles: true
          }
        });

        if (employee) {
          matched.push({
            ...payslip,
            employeeId: employee.id,
            employee
          });
          console.log(`Matched payslip ${payslip.fileName} with employee ${employee.firstName} ${employee.lastName}`);
        } else {
          unmatched.push({
            fileName: payslip.fileName,
            fiscalCode: payslip.fiscalCode,
            reason: 'Dipendente non trovato con questo codice fiscale'
          });
        }
      } catch (error) {
        console.error(`Error matching payslip ${payslip.fileName}:`, error);
        unmatched.push({
          fileName: payslip.fileName,
          fiscalCode: payslip.fiscalCode,
          reason: 'Errore durante la ricerca del dipendente'
        });
      }
    }

    return { matched, unmatched };
  },

  /**
   * Save processed payslips to storage and local folders
   */
  async saveProcessedPayslips(
    matchedPayslips: Array<ExtractedPayslip & { employeeId: string; employee: any }>,
    companyId: string,
    options: PayslipProcessingOptions
  ): Promise<Array<{
    fileName: string;
    employeeId: string;
    fiscalCode?: string;
    filePath: string;
  }>> {
    const savedFiles: Array<{
      fileName: string;
      employeeId: string;
      fiscalCode?: string;
      filePath: string;
    }> = [];

    // Create base directory for payslips
    const baseDir = path.join(process.cwd(), 'processed_payslips', companyId);
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    for (const payslip of matchedPayslips) {
      try {
        let filePath: string;
        let fileName: string;

        if (options.createFolders) {
          // Create folder for each employee
          const employeeFolder = path.join(baseDir, `${payslip.employee.firstName}_${payslip.employee.lastName}_${payslip.employeeId}`);
          if (!fs.existsSync(employeeFolder)) {
            fs.mkdirSync(employeeFolder, { recursive: true });
          }
          
          fileName = `busta_paga_${new Date().toISOString().split('T')[0]}_${payslip.fiscalCode}.pdf`;
          filePath = path.join(employeeFolder, fileName);
        } else {
          // Save all in the same folder with employee info in filename
          fileName = `${payslip.employee.firstName}_${payslip.employee.lastName}_${payslip.fiscalCode}_${new Date().toISOString().split('T')[0]}.pdf`;
          filePath = path.join(baseDir, fileName);
        }

        // Save PDF file locally
        fs.writeFileSync(filePath, payslip.pdfBuffer);

        // Optionally upload to blob storage
        try {
          const blobName = `payslips/${companyId}/${payslip.employeeId}/${fileName}`;
          await blobStorageService.uploadFile(blobName, payslip.pdfBuffer, 'application/pdf', {
            employee_id: payslip.employeeId,
            fiscal_code: payslip.fiscalCode || '',
            company_id: companyId,
            upload_date: new Date().toISOString(),
            document_type: 'payslip'
          });
          console.log(`Uploaded payslip to blob storage: ${blobName}`);
        } catch (blobError) {
          console.error('Error uploading to blob storage:', blobError);
          // Continue processing even if blob upload fails
        }

        savedFiles.push({
          fileName,
          employeeId: payslip.employeeId,
          fiscalCode: payslip.fiscalCode,
          filePath
        });

        console.log(`Saved payslip for ${payslip.employee.firstName} ${payslip.employee.lastName} to ${filePath}`);
      } catch (error) {
        console.error(`Error saving payslip for employee ${payslip.employeeId}:`, error);
      }
    }

    return savedFiles;
  },

  /**
   * Enhanced payslip detection logic (for future implementation)
   * This method can be enhanced to detect payslip boundaries more intelligently
   */
  async detectPayslipBoundaries(pdfBuffer: Buffer): Promise<number[][]> {
    // For now, return simple page-by-page boundaries
    // This can be enhanced with:
    // - Header detection
    // - Employee name detection
    // - Date pattern recognition
    // - Company logo detection
    
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();
    const boundaries: number[][] = [];

    for (let i = 0; i < totalPages; i++) {
      boundaries.push([i]);
    }

    return boundaries;
  },

  /**
   * Get company-specific parsing rules (for future implementation)
   */
  async getCompanyParsingRules(companyId: string): Promise<any> {
    // This can be enhanced to load company-specific rules from database
    // For example:
    // - Fiscal code position patterns
    // - Header text patterns
    // - Page break indicators
    
    return {
      fiscalCodePattern: /\b[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]\b/g,
      headerPatterns: ['BUSTA PAGA', 'CEDOLINO', 'STIPENDIO'],
      datePatterns: [/\d{2}\/\d{2}\/\d{4}/, /\d{4}-\d{2}-\d{2}/]
    };
  }
};
