export class CosmosEntityBase {
  id: string = crypto.randomUUID();
  creation_date: Date = new Date();
  update_date: Date = new Date();
}

export class Customer extends CosmosEntityBase {
  name: string = '';
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  vatNumber?: string; // Partita IVA
  fiscalCode?: string; // Codice Fiscale
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  status: string = 'ACTIVE'; // ACTIVE, INACTIVE, PROSPECT
  industry?: string;
  website?: string;
  company?: string; // ID dell'utente Super Admin che rappresenta la società
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relazioni (opzionali per il frontend)
  projects?: any[];
  calendarEvents?: any[];
} 