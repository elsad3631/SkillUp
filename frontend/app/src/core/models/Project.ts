export class CosmosEntityBase {
  id: string = crypto.randomUUID();
  creation_date: Date = new Date();
  update_date: Date = new Date();
}

export class SkillRequirement {
  name?: string;
  min_proficiency_level?: number;
  is_mandatory?: boolean;
}

export class Project extends CosmosEntityBase {
  name?: string;
  description?: string;
  required_hard_skills?: SkillRequirement[];
  required_soft_skills?: string[];
  start_date?: Date;
  end_date?: Date;
  status?: string;
  manager_id?: string;
  budget?: number;
  priority?: string;
  company?: string;
} 