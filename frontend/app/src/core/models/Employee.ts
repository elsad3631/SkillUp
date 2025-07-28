
export class CosmosEntityBase {
  id: string = crypto.randomUUID(); // oppure usare un uuid lib esterna
  creation_date: Date = new Date();
  update_date: Date = new Date();
}

export class CVData {
  file_name?: string;
  storage_url?: string;
  upload_date?: Date;
  parsed_version?: number;
}

export class Experience {
  job_title?: string;
  company_name?: string;
  start_date?: Date;
  end_date?: Date;
  description?: string;
  technologies_used?: string[];
}

export class EmployeeSkill {
  name?: string;
  proficiency_level?: number; // es. scala 1-5
  last_used?: Date;
  certification?: string;
}

export class Employee extends CosmosEntityBase {
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
  place_of_birth?: string;
  address?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  cv_data?: CVData;
  experiences?: Experience[];
  hard_skills?: EmployeeSkill[];
  soft_skills?: EmployeeSkill[];
  current_role?: string;
  department?: string;
  is_available: boolean = true;
  user_id?: string;
  company?: string; // ID dell'utente Super Admin che rappresenta la società
}
