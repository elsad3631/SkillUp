export interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description?: string;
  technologiesUsed: string[];
  employeeId?: string;
} 