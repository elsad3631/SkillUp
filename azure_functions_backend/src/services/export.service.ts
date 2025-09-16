import { PrismaClient } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import { applicationUserService } from './applicationuser.service';

const prisma = new PrismaClient();

export interface ExportFilters {
  // Note: dateRange is not available for ApplicationUser entity
  // dateRange?: {
  //   start: Date;
  //   end: Date;
  // };
  departments?: string[];
  roles?: string[];
  status?: 'available' | 'busy' | 'all';
  includeSkills?: boolean;
  includeExperience?: boolean;
  includeProjects?: boolean;
  includeContactInfo?: boolean;
}

export interface ExportOptions {
  format: 'excel' | 'csv';
  filters: ExportFilters;
  companyId?: string;
}

export interface CustomerExportFilters {
  status?: 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'all';
  industries?: string[];
  includeContactInfo?: boolean;
  includeProjects?: boolean;
  includeFinancialInfo?: boolean;
  includeNotes?: boolean;
}

export interface ProjectExportFilters {
  status?: 'active' | 'completed' | 'on hold' | 'cancelled' | 'all';
  priorities?: string[];
  includeSkills?: boolean;
  includeAssignments?: boolean;
  includeCustomerInfo?: boolean;
  includeTimeline?: boolean;
}

export interface CustomerExportOptions {
  format: 'excel' | 'csv';
  filters: CustomerExportFilters;
  companyId?: string;
}

export interface ProjectExportOptions {
  format: 'excel' | 'csv';
  filters: ProjectExportFilters;
  companyId?: string;
}

export const exportService = {
  async exportEmployees(options: ExportOptions): Promise<{ buffer: any; filename: string; contentType: string }> {
    try {
      // Get employees data based on filters
      const employees = await this.getFilteredEmployees(options.filters, options.companyId);
      
      if (options.format === 'excel') {
        return await this.generateExcelReport(employees, options.filters);
      } else {
        return await this.generateCSVReport(employees, options.filters);
      }
    } catch (error) {
      console.error('Export error:', error);
      throw new Error('Failed to export employees data');
    }
  },

  async getFilteredEmployees(filters: ExportFilters, companyId?: string): Promise<any[]> {
    try {
      console.log('🔍 Starting getFilteredEmployees with filters:', filters);
      console.log('🔍 Company ID:', companyId);

      // Build where clause for filtering
      const whereClause: any = {
        // Exclude super admin users
        userRoles: {
          none: {
            role: {
              name: 'superadmin'
            }
          }
        }
      };

      // Filter by company
      if (companyId) {
        whereClause.company = companyId;
      }

      // Filter by department
      if (filters.departments && filters.departments.length > 0) {
        whereClause.department = {
          in: filters.departments
        };
      }

      // Filter by status
      if (filters.status && filters.status !== 'all') {
        whereClause.isAvailable = filters.status === 'available';
      }

      // Note: createdAt field doesn't exist in ApplicationUser model
      // Date range filtering is not available for this entity
      // if (filters.dateRange) {
      //   whereClause.createdAt = {
      //     gte: filters.dateRange.start,
      //     lte: filters.dateRange.end
      //   };
      // }

      console.log('🔍 Where clause:', JSON.stringify(whereClause, null, 2));

      // Get employees with includes based on filters
      const includeClause: any = {
        userRoles: {
          include: {
            role: true
          }
        }
      };

      if (filters.includeSkills) {
        includeClause.hardSkills = true;
        includeClause.softSkills = true;
      }

      if (filters.includeExperience) {
        includeClause.experiences = true;
      }

      if (filters.includeProjects) {
        includeClause.projectAssignments = {
          include: {
            project: true
          }
        };
      }

      console.log('🔍 Include clause:', JSON.stringify(includeClause, null, 2));

      const employees = await prisma.applicationUser.findMany({
        where: whereClause,
        include: includeClause
      });

      console.log(`✅ Found ${employees.length} employees`);

      // Filter by roles if specified
      if (filters.roles && filters.roles.length > 0) {
        const filteredEmployees = employees.filter(emp => 
          emp.userRoles.some((ur: any) => filters.roles!.includes(ur.role.name))
        );
        console.log(`✅ After role filtering: ${filteredEmployees.length} employees`);
        return filteredEmployees;
      }

      return employees;
    } catch (error) {
      console.error('❌ Error in getFilteredEmployees:', error);
      throw error;
    }
  },

  async generateExcelReport(employees: any[], filters: ExportFilters): Promise<{ buffer: any; filename: string; contentType: string }> {
    try {
      console.log('📊 Generating Excel report for', employees.length, 'employees');
      
      const workbook = new ExcelJS.Workbook();
      // Simplified metadata for better Excel 2016 compatibility
      workbook.creator = 'SkillUp';
      workbook.lastModifiedBy = 'SkillUp';
      
      const worksheet = workbook.addWorksheet('Employees');

      // Define columns based on filters
      const columns = [
        { header: 'ID', key: 'id', width: 15 },
        { header: 'First Name', key: 'firstName', width: 15 },
        { header: 'Last Name', key: 'lastName', width: 15 },
        { header: 'Email', key: 'email', width: 25 },
      ];

      if (filters.includeContactInfo) {
        columns.push(
          { header: 'Phone', key: 'phone', width: 15 },
          { header: 'Address', key: 'address', width: 30 }
        );
      }

      columns.push(
        { header: 'Department', key: 'department', width: 15 },
        { header: 'Current Role', key: 'currentRole', width: 20 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Roles', key: 'roles', width: 25 }
      );

      if (filters.includeSkills) {
        columns.push(
          { header: 'Hard Skills', key: 'hardSkills', width: 30 },
          { header: 'Soft Skills', key: 'softSkills', width: 30 }
        );
      }

      if (filters.includeExperience) {
        columns.push(
          { header: 'Experience', key: 'experience', width: 40 }
        );
      }

      if (filters.includeProjects) {
        columns.push(
          { header: 'Projects', key: 'projects', width: 40 }
        );
      }

      // Set up columns
      worksheet.columns = columns;

      // Simple header styling for Excel 2016 compatibility
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Add data rows with minimal styling
      employees.forEach((employee, index) => {
        const rowData: any = {
          id: employee.id || '',
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          email: employee.email || '',
          department: employee.department || '',
          currentRole: employee.currentRole || '',
          status: employee.isAvailable ? 'Available' : 'Busy',
          roles: employee.userRoles?.map((ur: any) => ur.role.name).join(', ') || ''
        };

        if (filters.includeContactInfo) {
          rowData.phone = employee.phone || '';
          rowData.address = employee.address || '';
        }

        if (filters.includeSkills) {
          rowData.hardSkills = employee.hardSkills?.map((skill: any) => `${skill.name} (${skill.proficiencyLevel || 'N/A'})`).join(', ') || '';
          rowData.softSkills = employee.softSkills?.map((skill: any) => `${skill.name} (${skill.proficiencyLevel || 'N/A'})`).join(', ') || '';
        }

        if (filters.includeExperience) {
          rowData.experience = employee.experiences?.map((exp: any) => 
            `${exp.jobTitle} at ${exp.companyName} (${new Date(exp.startDate).getFullYear()}-${exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'})`
          ).join('; ') || '';
        }

        if (filters.includeProjects) {
          rowData.projects = employee.projectAssignments?.map((pa: any) => 
            `${pa.project.name} (${pa.project.status})`
          ).join('; ') || '';
        }

        worksheet.addRow(rowData);
      });

      // Set column widths
      worksheet.columns.forEach((column) => {
        if (column.width) {
          column.width = Math.min(column.width, 50);
        }
      });

      console.log('📊 Excel report generated successfully');
      
      // Use writeBuffer with options for better Excel 2016 compatibility
      const buffer = await workbook.xlsx.writeBuffer({
        filename: 'employees_export.xlsx',
        useStyles: true,
        useSharedStrings: true
      });
      
      const filename = `employees_export_${new Date().toISOString().split('T')[0]}.xlsx`;

      return {
        buffer,
        filename,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
    } catch (error) {
      console.error('❌ Error generating Excel report:', error);
      throw error;
    }
  },

  async generateCSVReport(employees: any[], filters: ExportFilters): Promise<{ buffer: any; filename: string; contentType: string }> {
    try {
      console.log('📊 Generating CSV report for', employees.length, 'employees');
      
      // Define headers based on filters
      const headers = [
        { id: 'id', title: 'ID' },
        { id: 'firstName', title: 'First Name' },
        { id: 'lastName', title: 'Last Name' },
        { id: 'email', title: 'Email' },
      ];

      if (filters.includeContactInfo) {
        headers.push(
          { id: 'phone', title: 'Phone' },
          { id: 'address', title: 'Address' }
        );
      }

      headers.push(
        { id: 'department', title: 'Department' },
        { id: 'currentRole', title: 'Current Role' },
        { id: 'status', title: 'Status' },
        { id: 'roles', title: 'Roles' }
      );

      if (filters.includeSkills) {
        headers.push(
          { id: 'hardSkills', title: 'Hard Skills' },
          { id: 'softSkills', title: 'Soft Skills' }
        );
      }

      if (filters.includeExperience) {
        headers.push(
          { id: 'experience', title: 'Experience' }
        );
      }

      if (filters.includeProjects) {
        headers.push(
          { id: 'projects', title: 'Projects' }
        );
      }

      // Create CSV data
      const csvData = employees.map(employee => {
        const rowData: any = {
          id: employee.id || '',
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          email: employee.email || '',
          department: employee.department || '',
          currentRole: employee.currentRole || '',
          status: employee.isAvailable ? 'Available' : 'Busy',
          roles: employee.userRoles?.map((ur: any) => ur.role.name).join(', ') || ''
        };

        if (filters.includeContactInfo) {
          rowData.phone = employee.phone || '';
          rowData.address = employee.address || '';
        }

        if (filters.includeSkills) {
          rowData.hardSkills = employee.hardSkills?.map((skill: any) => `${skill.name} (${skill.proficiencyLevel || 'N/A'})`).join(', ') || '';
          rowData.softSkills = employee.softSkills?.map((skill: any) => `${skill.name} (${skill.proficiencyLevel || 'N/A'})`).join(', ') || '';
        }

        if (filters.includeExperience) {
          rowData.experience = employee.experiences?.map((exp: any) => 
            `${exp.jobTitle} at ${exp.companyName} (${new Date(exp.startDate).getFullYear()}-${exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'})`
          ).join('; ') || '';
        }

        if (filters.includeProjects) {
          rowData.projects = employee.projectAssignments?.map((pa: any) => 
            `${pa.project.name} (${pa.project.status})`
          ).join('; ') || '';
        }

        return rowData;
      });

      // Convert to CSV string
      const csvString = this.convertToCSV(csvData, headers);
      const buffer = Buffer.from(csvString, 'utf-8');
      const filename = `employees_export_${new Date().toISOString().split('T')[0]}.csv`;

      console.log('📊 CSV report generated successfully');

      return {
        buffer,
        filename,
        contentType: 'text/csv; charset=utf-8'
      };
    } catch (error) {
      console.error('❌ Error generating CSV report:', error);
      throw error;
    }
  },

  convertToCSV(data: any[], headers: any[]): string {
    try {
      const csvHeaders = headers.map(h => `"${h.title}"`).join(',');
      const csvRows = data.map(row => {
        return headers.map(header => {
          const value = row[header.id] || '';
          // Escape quotes and wrap in quotes if contains comma or newline
          const escapedValue = value.toString().replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ');
          return `"${escapedValue}"`;
        }).join(',');
      });

      return [csvHeaders, ...csvRows].join('\n');
    } catch (error) {
      console.error('❌ Error converting to CSV:', error);
      throw error;
    }
  },

  async getAvailableFilters(companyId?: string): Promise<{
    departments: string[];
    roles: string[];
  }> {
    try {
      const [departments, roles] = await Promise.all([
        prisma.applicationUser.findMany({
          where: {
            department: { not: null },
            ...(companyId ? { company: companyId } : {})
          },
          select: { department: true },
          distinct: ['department']
        }),
        prisma.role.findMany({
          where: {
            name: { not: 'superadmin' }
          },
          select: { name: true, description: true }
        })
      ]);

      return {
        departments: departments.map(d => d.department!).filter(Boolean),
        roles: roles.map(r => r.name)
      };
    } catch (error) {
      console.error('Error getting available filters:', error);
      return {
        departments: [],
        roles: []
      };
    }
  },

  // Customer Export Methods
  async exportCustomers(options: CustomerExportOptions): Promise<{ buffer: any; filename: string; contentType: string }> {
    try {
      // Get customers data based on filters
      const customers = await this.getFilteredCustomers(options.filters, options.companyId);
      
      if (options.format === 'excel') {
        return await this.generateCustomerExcelReport(customers, options.filters);
      } else {
        return await this.generateCustomerCSVReport(customers, options.filters);
      }
    } catch (error) {
      console.error('Export error:', error);
      throw new Error('Failed to export customers data');
    }
  },

  async getFilteredCustomers(filters: CustomerExportFilters, companyId?: string): Promise<any[]> {
    try {
      console.log('🔍 Starting getFilteredCustomers with filters:', filters);
      console.log('🔍 Company ID:', companyId);

      // Build where clause for filtering
      const whereClause: any = {};

      // Filter by company
      if (companyId) {
        whereClause.company = companyId;
      }

      // Filter by status
      if (filters.status && filters.status !== 'all') {
        whereClause.status = filters.status;
      }

      // Filter by industry
      if (filters.industries && filters.industries.length > 0) {
        whereClause.industry = {
          in: filters.industries
        };
      }

      console.log('🔍 Where clause:', JSON.stringify(whereClause, null, 2));

      // Get customers with includes based on filters
      const includeClause: any = {};

      if (filters.includeProjects) {
        includeClause.projects = true;
      }

      console.log('🔍 Include clause:', JSON.stringify(includeClause, null, 2));

      const customers = await (prisma as any).customer.findMany({
        where: whereClause,
        include: includeClause
      });

      console.log(`✅ Found ${customers.length} customers`);

      return customers;
    } catch (error) {
      console.error('❌ Error in getFilteredCustomers:', error);
      throw error;
    }
  },

  async generateCustomerExcelReport(customers: any[], filters: CustomerExportFilters): Promise<{ buffer: any; filename: string; contentType: string }> {
    try {
      console.log('📊 Generating Excel report for', customers.length, 'customers');
      
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'SkillUp';
      workbook.lastModifiedBy = 'SkillUp';
      
      const worksheet = workbook.addWorksheet('Customers');

      // Define columns based on filters
      const columns = [
        { header: 'ID', key: 'id', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Company Name', key: 'companyName', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
      ];

      if (filters.includeContactInfo) {
        columns.push(
          { header: 'Phone', key: 'phone', width: 15 },
          { header: 'Address', key: 'address', width: 30 },
          { header: 'City', key: 'city', width: 15 },
          { header: 'Country', key: 'country', width: 15 },
          { header: 'Contact Person', key: 'contactPerson', width: 20 },
          { header: 'Contact Phone', key: 'contactPhone', width: 15 },
          { header: 'Contact Email', key: 'contactEmail', width: 30 }
        );
      }

      columns.push(
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Industry', key: 'industry', width: 20 },
        { header: 'Website', key: 'website', width: 25 }
      );

      if (filters.includeFinancialInfo) {
        columns.push(
          { header: 'VAT Number', key: 'vatNumber', width: 20 },
          { header: 'Fiscal Code', key: 'fiscalCode', width: 20 }
        );
      }

      if (filters.includeProjects) {
        columns.push(
          { header: 'Projects', key: 'projects', width: 40 }
        );
      }

      if (filters.includeNotes) {
        columns.push(
          { header: 'Notes', key: 'notes', width: 40 }
        );
      }

      // Set up columns
      worksheet.columns = columns;

      // Simple header styling for Excel 2016 compatibility
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Add data rows with minimal styling
      customers.forEach((customer, index) => {
        const rowData: any = {
          id: customer.id || '',
          name: customer.name || '',
          companyName: customer.companyName || '',
          email: customer.email || '',
          status: customer.status || '',
          industry: customer.industry || '',
          website: customer.website || ''
        };

        if (filters.includeContactInfo) {
          rowData.phone = customer.phone || '';
          rowData.address = customer.address || '';
          rowData.city = customer.city || '';
          rowData.country = customer.country || '';
          rowData.contactPerson = customer.contactPerson || '';
          rowData.contactPhone = customer.contactPhone || '';
          rowData.contactEmail = customer.contactEmail || '';
        }

        if (filters.includeFinancialInfo) {
          rowData.vatNumber = customer.vatNumber || '';
          rowData.fiscalCode = customer.fiscalCode || '';
        }

        if (filters.includeProjects) {
          rowData.projects = customer.projects?.map((project: any) => 
            `${project.name} (${project.status})`
          ).join('; ') || '';
        }

        if (filters.includeNotes) {
          rowData.notes = customer.notes || '';
        }

        worksheet.addRow(rowData);
      });

      // Set column widths
      worksheet.columns.forEach((column) => {
        if (column.width) {
          column.width = Math.min(column.width, 50);
        }
      });

      console.log('📊 Excel report generated successfully');

      const buffer = await workbook.xlsx.writeBuffer();
      const filename = `customers_export_${new Date().toISOString().split('T')[0]}.xlsx`;

      return {
        buffer,
        filename,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
    } catch (error) {
      console.error('❌ Error generating Excel report:', error);
      throw error;
    }
  },

  async generateCustomerCSVReport(customers: any[], filters: CustomerExportFilters): Promise<{ buffer: any; filename: string; contentType: string }> {
    try {
      console.log('📊 Generating CSV report for', customers.length, 'customers');

      // Define headers based on filters
      const headers = [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'companyName', title: 'Company Name' },
        { id: 'email', title: 'Email' },
      ];

      if (filters.includeContactInfo) {
        headers.push(
          { id: 'phone', title: 'Phone' },
          { id: 'address', title: 'Address' },
          { id: 'city', title: 'City' },
          { id: 'country', title: 'Country' },
          { id: 'contactPerson', title: 'Contact Person' },
          { id: 'contactPhone', title: 'Contact Phone' },
          { id: 'contactEmail', title: 'Contact Email' }
        );
      }

      headers.push(
        { id: 'status', title: 'Status' },
        { id: 'industry', title: 'Industry' },
        { id: 'website', title: 'Website' }
      );

      if (filters.includeFinancialInfo) {
        headers.push(
          { id: 'vatNumber', title: 'VAT Number' },
          { id: 'fiscalCode', title: 'Fiscal Code' }
        );
      }

      if (filters.includeProjects) {
        headers.push(
          { id: 'projects', title: 'Projects' }
        );
      }

      if (filters.includeNotes) {
        headers.push(
          { id: 'notes', title: 'Notes' }
        );
      }

      // Create CSV data
      const csvData = customers.map(customer => {
        const rowData: any = {
          id: customer.id || '',
          name: customer.name || '',
          companyName: customer.companyName || '',
          email: customer.email || '',
          status: customer.status || '',
          industry: customer.industry || '',
          website: customer.website || ''
        };

        if (filters.includeContactInfo) {
          rowData.phone = customer.phone || '';
          rowData.address = customer.address || '';
          rowData.city = customer.city || '';
          rowData.country = customer.country || '';
          rowData.contactPerson = customer.contactPerson || '';
          rowData.contactPhone = customer.contactPhone || '';
          rowData.contactEmail = customer.contactEmail || '';
        }

        if (filters.includeFinancialInfo) {
          rowData.vatNumber = customer.vatNumber || '';
          rowData.fiscalCode = customer.fiscalCode || '';
        }

        if (filters.includeProjects) {
          rowData.projects = customer.projects?.map((project: any) => 
            `${project.name} (${project.status})`
          ).join('; ') || '';
        }

        if (filters.includeNotes) {
          rowData.notes = customer.notes || '';
        }

        return rowData;
      });

      // Convert to CSV string
      const csvString = this.convertToCSV(csvData, headers);
      const buffer = Buffer.from(csvString, 'utf-8');
      const filename = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;

      console.log('📊 CSV report generated successfully');

      return {
        buffer,
        filename,
        contentType: 'text/csv; charset=utf-8'
      };
    } catch (error) {
      console.error('❌ Error generating CSV report:', error);
      throw error;
    }
  },

  async getCustomerExportFilters(companyId?: string): Promise<{
    industries: string[];
  }> {
    try {
      const industries = await (prisma as any).customer.findMany({
        where: {
          industry: { not: null },
          ...(companyId ? { company: companyId } : {})
        },
        select: { industry: true },
        distinct: ['industry']
      });

      return {
        industries: industries.map((i: any) => i.industry!).filter(Boolean)
      };
    } catch (error) {
      console.error('Error getting customer export filters:', error);
      return {
        industries: []
      };
    }
  },

  // Project Export Methods
  async exportProjects(options: ProjectExportOptions): Promise<{ buffer: any; filename: string; contentType: string }> {
    try {
      // Get projects data based on filters
      const projects = await this.getFilteredProjects(options.filters, options.companyId);
      
      if (options.format === 'excel') {
        return await this.generateProjectExcelReport(projects, options.filters);
      } else {
        return await this.generateProjectCSVReport(projects, options.filters);
      }
    } catch (error) {
      console.error('Export error:', error);
      throw new Error('Failed to export projects data');
    }
  },

  async getFilteredProjects(filters: ProjectExportFilters, companyId?: string): Promise<any[]> {
    try {
      console.log('🔍 Starting getFilteredProjects with filters:', filters);
      console.log('🔍 Company ID:', companyId);

      // Build where clause for filtering
      const whereClause: any = {};

      // Filter by company
      if (companyId) {
        whereClause.company = companyId;
      }

      // Filter by status
      if (filters.status && filters.status !== 'all') {
        whereClause.status = filters.status;
      }

      // Filter by priority
      if (filters.priorities && filters.priorities.length > 0) {
        whereClause.priority = {
          in: filters.priorities
        };
      }

      console.log('🔍 Where clause:', JSON.stringify(whereClause, null, 2));

      // Get projects with includes based on filters
      const includeClause: any = {};

      if (filters.includeSkills) {
        includeClause.requiredHardSkills = true;
        includeClause.requiredSoftSkills = true;
      }

      if (filters.includeAssignments) {
        includeClause.assignments = {
          include: {
            employee: true
          }
        };
      }

      if (filters.includeCustomerInfo) {
        includeClause.customer = true;
      }

      console.log('🔍 Include clause:', JSON.stringify(includeClause, null, 2));

      const projects = await prisma.project.findMany({
        where: whereClause,
        include: includeClause
      });

      console.log(`✅ Found ${projects.length} projects`);

      return projects;
    } catch (error) {
      console.error('❌ Error in getFilteredProjects:', error);
      throw error;
    }
  },

  async generateProjectExcelReport(projects: any[], filters: ProjectExportFilters): Promise<{ buffer: any; filename: string; contentType: string }> {
    try {
      console.log('📊 Generating Excel report for', projects.length, 'projects');
      
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'SkillUp';
      workbook.lastModifiedBy = 'SkillUp';
      
      const worksheet = workbook.addWorksheet('Projects');

      // Define columns based on filters
      const columns = [
        { header: 'ID', key: 'id', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Priority', key: 'priority', width: 15 },
        { header: 'Budget', key: 'budget', width: 15 },
        { header: 'Start Date', key: 'startDate', width: 15 },
        { header: 'End Date', key: 'endDate', width: 15 },
      ];

      if (filters.includeCustomerInfo) {
        columns.push(
          { header: 'Customer', key: 'customer', width: 25 }
        );
      }

      if (filters.includeSkills) {
        columns.push(
          { header: 'Required Hard Skills', key: 'requiredHardSkills', width: 40 },
          { header: 'Required Soft Skills', key: 'requiredSoftSkills', width: 40 }
        );
      }

      if (filters.includeAssignments) {
        columns.push(
          { header: 'Assignments', key: 'assignments', width: 40 }
        );
      }

      if (filters.includeTimeline) {
        columns.push(
          { header: 'Progress', key: 'progress', width: 15 }
        );
      }

      // Set up columns
      worksheet.columns = columns;

      // Simple header styling for Excel 2016 compatibility
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Add data rows with minimal styling
      projects.forEach((project, index) => {
        const rowData: any = {
          id: project.id || '',
          name: project.name || '',
          description: project.description || '',
          status: project.status || '',
          priority: project.priority || '',
          budget: project.budget ? `$${project.budget.toLocaleString()}` : '',
          startDate: project.startDate ? new Date(project.startDate).toLocaleDateString() : '',
          endDate: project.endDate ? new Date(project.endDate).toLocaleDateString() : ''
        };

        if (filters.includeCustomerInfo) {
          rowData.customer = project.customer?.name || '';
        }

        if (filters.includeSkills) {
          rowData.requiredHardSkills = project.requiredHardSkills?.map((skill: any) => 
            `${skill.name} (${skill.minProficiencyLevel || 'N/A'})`
          ).join(', ') || '';
          rowData.requiredSoftSkills = project.requiredSoftSkills?.map((skill: any) => 
            `${skill.name} (${skill.proficiencyLevel || 'N/A'})`
          ).join(', ') || '';
        }

        if (filters.includeAssignments) {
          rowData.assignments = project.assignments?.map((assignment: any) => 
            `${assignment.employee?.firstName} ${assignment.employee?.lastName}`
          ).join(', ') || '';
        }

        if (filters.includeTimeline) {
          const startDate = project.startDate ? new Date(project.startDate) : null;
          const endDate = project.endDate ? new Date(project.endDate) : null;
          const now = new Date();
          
          if (startDate && endDate) {
            const totalDuration = endDate.getTime() - startDate.getTime();
            const elapsed = now.getTime() - startDate.getTime();
            const percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
            rowData.progress = `${percentage.toFixed(1)}%`;
          } else {
            rowData.progress = 'N/A';
          }
        }

        worksheet.addRow(rowData);
      });

      // Set column widths
      worksheet.columns.forEach((column) => {
        if (column.width) {
          column.width = Math.min(column.width, 50);
        }
      });

      console.log('📊 Excel report generated successfully');

      const buffer = await workbook.xlsx.writeBuffer();
      const filename = `projects_export_${new Date().toISOString().split('T')[0]}.xlsx`;

      return {
        buffer,
        filename,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
    } catch (error) {
      console.error('❌ Error generating Excel report:', error);
      throw error;
    }
  },

  async generateProjectCSVReport(projects: any[], filters: ProjectExportFilters): Promise<{ buffer: any; filename: string; contentType: string }> {
    try {
      console.log('📊 Generating CSV report for', projects.length, 'projects');

      // Define headers based on filters
      const headers = [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'description', title: 'Description' },
        { id: 'status', title: 'Status' },
        { id: 'priority', title: 'Priority' },
        { id: 'budget', title: 'Budget' },
        { id: 'startDate', title: 'Start Date' },
        { id: 'endDate', title: 'End Date' },
      ];

      if (filters.includeCustomerInfo) {
        headers.push(
          { id: 'customer', title: 'Customer' }
        );
      }

      if (filters.includeSkills) {
        headers.push(
          { id: 'requiredHardSkills', title: 'Required Hard Skills' },
          { id: 'requiredSoftSkills', title: 'Required Soft Skills' }
        );
      }

      if (filters.includeAssignments) {
        headers.push(
          { id: 'assignments', title: 'Assignments' }
        );
      }

      if (filters.includeTimeline) {
        headers.push(
          { id: 'progress', title: 'Progress' }
        );
      }

      // Create CSV data
      const csvData = projects.map(project => {
        const rowData: any = {
          id: project.id || '',
          name: project.name || '',
          description: project.description || '',
          status: project.status || '',
          priority: project.priority || '',
          budget: project.budget ? `$${project.budget.toLocaleString()}` : '',
          startDate: project.startDate ? new Date(project.startDate).toLocaleDateString() : '',
          endDate: project.endDate ? new Date(project.endDate).toLocaleDateString() : ''
        };

        if (filters.includeCustomerInfo) {
          rowData.customer = project.customer?.name || '';
        }

        if (filters.includeSkills) {
          rowData.requiredHardSkills = project.requiredHardSkills?.map((skill: any) => 
            `${skill.name} (${skill.minProficiencyLevel || 'N/A'})`
          ).join(', ') || '';
          rowData.requiredSoftSkills = project.requiredSoftSkills?.map((skill: any) => 
            `${skill.name} (${skill.proficiencyLevel || 'N/A'})`
          ).join(', ') || '';
        }

        if (filters.includeAssignments) {
          rowData.assignments = project.assignments?.map((assignment: any) => 
            `${assignment.employee?.firstName} ${assignment.employee?.lastName}`
          ).join(', ') || '';
        }

        if (filters.includeTimeline) {
          const startDate = project.startDate ? new Date(project.startDate) : null;
          const endDate = project.endDate ? new Date(project.endDate) : null;
          const now = new Date();
          
          if (startDate && endDate) {
            const totalDuration = endDate.getTime() - startDate.getTime();
            const elapsed = now.getTime() - startDate.getTime();
            const percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
            rowData.progress = `${percentage.toFixed(1)}%`;
          } else {
            rowData.progress = 'N/A';
          }
        }

        return rowData;
      });

      // Convert to CSV string
      const csvString = this.convertToCSV(csvData, headers);
      const buffer = Buffer.from(csvString, 'utf-8');
      const filename = `projects_export_${new Date().toISOString().split('T')[0]}.csv`;

      console.log('📊 CSV report generated successfully');

      return {
        buffer,
        filename,
        contentType: 'text/csv; charset=utf-8'
      };
    } catch (error) {
      console.error('❌ Error generating CSV report:', error);
      throw error;
    }
  },

  async getProjectExportFilters(companyId?: string): Promise<{
    priorities: string[];
  }> {
    try {
      const priorities = await prisma.project.findMany({
        where: {
          priority: { not: null },
          ...(companyId ? { company: companyId } : {})
        },
        select: { priority: true },
        distinct: ['priority']
      });

      return {
        priorities: priorities.map(p => p.priority!).filter(Boolean)
      };
    } catch (error) {
      console.error('Error getting project export filters:', error);
      return {
        priorities: []
      };
    }
  }
}; 