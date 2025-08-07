import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

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

export interface ExportOptions {
  format: 'excel' | 'csv';
  filters: ExportFilters;
  companyId?: string;
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

export const exportEmployees = async (options: ExportOptions): Promise<ArrayBuffer> => {
  ApiService.setHeader();
  return ApiService.post("export", options)
    .then(({ data }) => data as ArrayBuffer)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error('Failed to export employees');
    });
};

export const getExportFilters = async (): Promise<{
  departments: string[];
  roles: string[];
}> => {
  ApiService.setHeader();
  return ApiService.get("export-filters")
    .then(({ data }) => data as { departments: string[]; roles: string[] })
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error('Failed to get export filters');
    });
};

export const exportCustomers = async (options: CustomerExportOptions): Promise<ArrayBuffer> => {
  ApiService.setHeader();
  return ApiService.post("export-customers", options)
    .then(({ data }) => data as ArrayBuffer)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error('Failed to export customers');
    });
};

export const getCustomerExportFilters = async (): Promise<{
  industries: string[];
}> => {
  ApiService.setHeader();
  return ApiService.get("export-customers-filters")
    .then(({ data }) => data as { industries: string[] })
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error('Failed to get customer export filters');
    });
};

export const exportProjects = async (options: ProjectExportOptions): Promise<ArrayBuffer> => {
  ApiService.setHeader();
  return ApiService.post("export-projects", options)
    .then(({ data }) => data as ArrayBuffer)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error('Failed to export projects');
    });
};

export const getProjectExportFilters = async (): Promise<{
  priorities: string[];
}> => {
  ApiService.setHeader();
  return ApiService.get("export-projects-filters")
    .then(({ data }) => data as { priorities: string[] })
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error('Failed to get project export filters');
    });
}; 