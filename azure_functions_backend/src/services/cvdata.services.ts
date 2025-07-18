import { PrismaClient } from '@prisma/client';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { applicationUserService } from './applicationuser.service';
import { userActivityLogService } from './userActivityLog.service';
const prisma = new PrismaClient();

export const cvDataService = {
  async getAll() {
    return prisma.cVData.findMany();
  },
  async getById(id: string) {
    return prisma.cVData.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.cVData.create({ data });
  },
  async update(id: string, data: any) {
    return prisma.cVData.update({ where: { id }, data });
  },
  async remove(id: string) {
    return prisma.cVData.delete({ where: { id } });
  },
  async extractFromCV(file: Express.Multer.File, requestingUserId?: string) {
    let cvText = '';
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      const data = await pdfParse(file.buffer);
      cvText = data.text;
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      cvText = result.value;
    } else {
      throw new Error('Unsupported file type');
    }
    // Carica la lista di skills da un file JSON
    const skillsListPath = path.join(__dirname, '../../skills-list.json');
    const skillsListArr = JSON.parse(fs.readFileSync(skillsListPath, 'utf-8'));
    const skillsList = skillsListArr.join(', ');
    // Prompt fisso
    const prompt = `Sei un assistente AI esperto nell'analisi di curriculum vitae.
Ti fornirò il testo di un curriculum e dovrai estrarre le seguenti informazioni in formato JSON.

**Informazioni da estrarre:**
- **FirstName**: Nome della persona.
- **LastName**: Cognome della persona.
- **DateOfBirth**: Data di nascita (formato 'AAAA-MM-GG' o 'null' se non trovata).
- **PlaceOfBirth**: Luogo di nascita.
- **Address**: Indirizzo completo.
- **Phone**: Numero di telefono.
- **Email**: Indirizzo email.
- **Experiences**: Un array di oggetti Experience. Ogni oggetto deve avere:
    - **JobTitle**: Titolo del ruolo.
    - **CompanyName**: Nome dell'azienda.
    - **StartDate**: Data di inizio (formato 'AAAA-MM-GG').
    - **EndDate**: Data di fine (formato 'AAAA-MM-GG' o 'null' se corrente).
    - **Description**: Breve descrizione delle responsabilità/logiche (massimo 100 parole).
    - **TechnologiesUsed**: Un array di stringhe, tecnologie utilizzate in questa esperienza, normalizzate dalla lista fornita.
- **HardSkills**: Un array di oggetti EmployeeSkill. Ogni oggetto deve avere:
    - **Name**: Nome della competenza, normalizzato dalla lista fornita.
    - **ProficiencyLevel**: Livello di competenza (integer da 1 a 10, 1=base, 10=esperto).
    - **LastUsed**: Data dell'ultima volta che la skill è stata menzionata/utilizzata (formato 'AAAA-MM-GG' o 'null').
    - **Certification**: Se esiste una certificazione specifica per la skill (stringa o null).
- **SoftSkills**: Un array di oggetti EmployeeSkill, per le competenze trasversali.

**Regole di normalizzazione delle competenze:**
Le competenze (sia in Experiences.TechnologiesUsed che in HardSkills e SoftSkills) devono essere normalizzate e incluse **esclusivamente** se presenti nella seguente lista predefinita. Usa **esattamente questi nomi**. Se trovi sinonimi o varianti, mappale sul nome corretto.

Lista di competenze valide (non generare altre competenze che non siano in questa lista):
["{skillsList}"]

**Output JSON desiderato:**
\`\`\`json
{{
    "firstName": "Mario",
    "lastName": "Rossi",
    "dateOfBirth": "1990-01-15",
    "placeOfBirth": "Roma",
    "address": "Via Roma 1, 00100 Roma",
    "phone": "+39123456789",
    "email": "mario.rossi@example.com",
    "experiences": [
        {{
            "jobTitle": "Software Developer",
            "companyName": "Tech Solutions",
            "startDate": "2018-03-01",
            "endDate": "2022-06-30",
            "description": "Sviluppo di applicazioni web e API REST con C# e .NET.",
            "technologiesUsed": [".NET", "C#", "REST API"]
        }}
    ],
    "hardSkills": [
        {{
            "name": "C#",
            "proficiencyLevel": 8,
            "lastUsed": "2024-05-01",
            "certification": "Microsoft Certified"
        }}
    ],
    "softSkills": [
        {{
            "name": "Lavoro di Squadra",
            "proficiencyLevel": 9,
            "lastUsed": null,
            "certification": null
        }}
    ]
}}\`\`\`
\`\`\`{cvText}\`\`\`
`;
    const finalPrompt = prompt.replace('{skillsList}', skillsList).replace('{cvText}', cvText);
    // Chiamata Azure OpenAI - valori hardcoded per test
    const endpoint = 'https://intentopenaisrv.openai.azure.com/';
    const key = '2a0a03ad296d4b94bc516c0ae744432f';
    const deployment = 'GPT4O';
    
    const response = await axios.post(
      `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`,
      {
        messages: [
          { role: 'system', content: 'Estrai i dati dal CV secondo le istruzioni.' },
          { role: 'user', content: finalPrompt }
        ],
        max_tokens: 2048,
        temperature: 0.2
      },
      {
        headers: {
          'api-key': key,
          'Content-Type': 'application/json'
        }
      }
    );
    // Parsing della risposta
    let extracted;
    try {
      let content = response.data.choices[0].message.content;
      console.log('🔍 Raw OpenAI response:', content);
      
      // Rimuovi blocchi di codice markdown se presenti
      if (content.includes('```json')) {
        content = content.replace(/```json\n?/g, '').replace(/```/g, '');
      } else if (content.includes('```')) {
        content = content.replace(/```\n?/g, '');
      }
      
      // Trova il JSON nella risposta (potrebbe esserci del testo prima/dopo)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      console.log('🔧 Cleaned content for parsing:', content);
      
      extracted = JSON.parse(content);
      console.log('✅ Successfully parsed JSON:', extracted);
    } catch (e) {
      console.error('❌ JSON parsing failed:', e);
      console.error('Raw content was:', response.data.choices[0].message.content);
      throw new Error(`OpenAI response is not valid JSON: ${(e as Error).message}`);
    }
    // Normalizzazione (es: date ISO)
    // ...eventuali normalizzazioni qui...
    
    // Genera automaticamente username e password per creare l'ApplicationUser
    const email = extracted.email;
    if (!email) {
      throw new Error('Email not found in CV - cannot create user account');
    }
    
    // Verifica se l'email esiste già nel database
    const existingUserByEmail = await prisma.applicationUser.findUnique({
      where: { email: email }
    });
    if (existingUserByEmail) {
      throw new Error(`Un utente con email ${email} esiste già nel sistema`);
    }
    
    // Genera username dall'email (rimuove domini e caratteri speciali)
    let generatedUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Verifica se l'username esiste già e genera una variante se necessario
    let usernameCounter = 1;
    let finalUsername = generatedUsername;
    while (await prisma.applicationUser.findUnique({ where: { username: finalUsername } })) {
      finalUsername = `${generatedUsername}_${usernameCounter}`;
      usernameCounter++;
    }
    
    // Genera password temporanea (8 caratteri alfanumerici)
    const generatePassword = (length: number = 8): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    const temporaryPassword = generatePassword();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);
    
    // Prepara i dati per la creazione dell'ApplicationUser
    // Funzione helper per convertire le date in modo sicuro
    const safeParseDate = (dateStr: any): Date | undefined => {
      if (!dateStr || dateStr === null) return undefined;
      try {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? undefined : date;
      } catch (e) {
        console.warn(`Invalid date format: ${dateStr}`);
        return undefined;
      }
    };

    // Converti le date nelle experiences da stringhe a oggetti Date
    const processedExperiences = (extracted.experiences || []).map((exp: any) => ({
      jobTitle: exp.jobTitle,
      companyName: exp.companyName,
      startDate: safeParseDate(exp.startDate) || new Date(),
      endDate: safeParseDate(exp.endDate),
      description: exp.description || '',
      technologiesUsed: Array.isArray(exp.technologiesUsed) ? exp.technologiesUsed : []
    }));

    // Converti le date lastUsed nelle skills da stringhe a oggetti Date
    const processedHardSkills = (extracted.hardSkills || []).map((skill: any) => ({
      name: skill.name,
      proficiencyLevel: skill.proficiencyLevel ? Number(skill.proficiencyLevel) : undefined,
      lastUsed: safeParseDate(skill.lastUsed),
      certification: skill.certification || undefined
    }));

    const processedSoftSkills = (extracted.softSkills || []).map((skill: any) => ({
      name: skill.name,
      proficiencyLevel: skill.proficiencyLevel ? Number(skill.proficiencyLevel) : undefined,
      lastUsed: safeParseDate(skill.lastUsed),
      certification: skill.certification || undefined
    }));

    const applicationUserData = {
      username: finalUsername,
      email: extracted.email,
      passwordHash: passwordHash,
      roles: ['employee'], // Ruolo di default
      firstName: extracted.firstName,
      lastName: extracted.lastName,
      dateOfBirth: safeParseDate(extracted.dateOfBirth),
      placeOfBirth: extracted.placeOfBirth,
      address: extracted.address,
      phone: extracted.phone,
      isAvailable: true, // Default disponibile
      hardSkills: processedHardSkills,
      softSkills: processedSoftSkills,
      experiences: processedExperiences,
      cvData: {
        fileName: file.originalname,
        storageUrl: `cv_uploads/${finalUsername}_${Date.now()}_${file.originalname}`,
      }
    };
    
    // Debug logging prima della creazione
    console.log('🔍 Creating ApplicationUser with processed data:', {
      username: applicationUserData.username,
      email: applicationUserData.email,
      experiencesCount: applicationUserData.experiences.length,
      hardSkillsCount: applicationUserData.hardSkills.length,
      softSkillsCount: applicationUserData.softSkills.length,
      sampleExperience: applicationUserData.experiences[0] || 'none',
    });

    // Crea l'ApplicationUser nel database
    const createdUser = await applicationUserService.create(applicationUserData);
    
    // Crea un log dell'attività se è stato fornito l'ID dell'utente richiedente
    if (requestingUserId) {
      try {
        await userActivityLogService.logSuccess({
          userId: requestingUserId,
          action: 'CREATE_EMPLOYEE_FROM_CV',
          entityType: 'ApplicationUser',
          entityId: createdUser.id,
          description: `Employee created successfully from CV: ${createdUser.firstName} ${createdUser.lastName} (${createdUser.email})`,
          metadata: {
            createdUserId: createdUser.id,
            createdUserEmail: createdUser.email,
            cvFileName: file.originalname,
            extractedSkillsCount: {
              hardSkills: processedHardSkills.length,
              softSkills: processedSoftSkills.length
            },
            extractedExperiencesCount: processedExperiences.length
          }
        });
      } catch (logError) {
        console.error('❌ Failed to create activity log:', logError);
        // Non blocchiamo il processo se il logging fallisce
      }
    }
    
    // Restituisce un oggetto con successo, i dati dell'utente creato e le credenziali temporanee
    return {
      success: true,
      message: 'User created successfully from CV',
      user: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        temporaryPassword: temporaryPassword, // Password temporanea da comunicare all'utente
      },
      extractedData: extracted // Dati originali estratti dal CV per riferimento
    };
  },
}; 