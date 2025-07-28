# Implementazione Selezione Settore e Assegnazione Automatica Skills

## Panoramica

Questa implementazione aggiunge la funzionalità di selezione del settore della società durante la registrazione dell'utente, con conseguente assegnazione automatica delle hard skills e soft skills specifiche del settore selezionato.

## Modifiche Implementate

### 1. Backend - Servizio di Autenticazione (`auth.service.ts`)

**Nuove Funzionalità:**
- **Caricamento Skills**: Funzione `loadSkillsList()` per caricare le skills dal file `skills-list.json`
- **Creazione Skills**: Funzione `createSkillsForUser()` per creare automaticamente le skills basate sul settore
- **Cambio Ruolo**: Modificato il ruolo di default da `admin` a `superadmin`
- **Gestione Settore**: Aggiunto il parametro `sector` alla funzione di registrazione

**Modifiche Principali:**
```typescript
// Nuovo parametro sector nella funzione register
async register({ 
  // ... altri parametri
  sector, // Nuovo campo per il settore
  roles = ['superadmin'], // Cambiato da admin a superadmin
  // ... altri parametri
}: any)

// Creazione automatica delle skills
if (sector) {
  await createSkillsForUser(user.id, sector);
}
```

### 2. Backend - Endpoint API (`auth.ts`)

**Nuovo Endpoint:**
- `GET /api/auth/sectors` - Restituisce la lista dei settori disponibili

**Implementazione:**
```typescript
app.http('getSectors', {
  methods: ['GET'],
  route: 'auth/sectors',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext) => {
    // Carica e formatta i settori dal file skills-list.json
  }
});
```

### 3. Frontend - Form di Registrazione (`SignUp.vue`)

**Nuove Funzionalità:**
- **Campo Settore**: Aggiunto dropdown per la selezione del settore
- **Validazione**: Aggiunta validazione obbligatoria per il campo settore
- **UI/UX**: Aggiunto testo informativo per spiegare la funzionalità

**Modifiche Principali:**
```vue
<!-- Nuovo campo per la selezione del settore -->
<div class="fv-row mb-7">
  <label class="form-label fw-bold text-dark fs-6">
    <i class="ki-duotone ki-briefcase fs-5 text-primary me-2"></i>
    Settore della Società
  </label>
  <Field
    name="sector"
    class="form-select form-select-lg form-select-solid"
    as="select"
  >
    <option value="Settore_Tecnologia_Informazione">Tecnologia e Informazione</option>
    <!-- ... altri settori ... -->
  </Field>
</div>
```

### 4. Frontend - Store di Autenticazione (`auth.ts`)

**Modifiche:**
- **Tipo User**: Aggiunto campo `sector?: string` all'interfaccia User
- **Funzione Register**: Aggiornata per accettare il parametro `sector`

### 5. Frontend - Controlli di Autorizzazione

**Aggiornamenti:**
- **Projects.vue**: Aggiornato il controllo per includere sia `admin` che `superadmin`
- **Autorizzazione**: Mantenuta compatibilità con entrambi i ruoli

## Settori Disponibili

I seguenti settori sono disponibili per la selezione:

1. **Settore_Tecnologia_Informazione** - Tecnologia e Informazione
2. **Settore_Finanza_e_Bancario** - Finanza e Bancario
3. **Settore_Sanitario_e_Biomedicale** - Sanitario e Biomedicale
4. **Settore_Industriale_e_Manifatturiero** - Industriale e Manifatturiero
5. **Settore_Vendite_e_Marketing** - Vendite e Marketing
6. **Settore_Amministrazione_e_Risorse_Umane** - Amministrazione e Risorse Umane
7. **Settore_Educazione_e_Formazione** - Educazione e Formazione
8. **Settore_Hospitality_e_Turismo** - Hospitality e Turismo
9. **Settore_Logistica_e_Trasporti** - Logistica e Trasporti

## Processo di Registrazione

### Flusso Completo:

1. **Utente compila il form** di registrazione includendo:
   - Informazioni personali (nome, cognome, email)
   - Password
   - **Settore della società** (nuovo campo obbligatorio)

2. **Validazione frontend**:
   - Tutti i campi obbligatori sono validati
   - Il settore deve essere selezionato

3. **Invio al backend**:
   - I dati vengono inviati all'endpoint `/api/auth/register`
   - Il campo `sector` viene incluso nella richiesta

4. **Creazione utente**:
   - L'utente viene creato nel database
   - Viene assegnato automaticamente il ruolo `superadmin`

5. **Creazione skills**:
   - Il sistema carica le skills dal file `skills-list.json`
   - Vengono create le hard skills e soft skills specifiche del settore
   - Tutte le skills vengono associate all'utente appena creato

6. **Risposta al frontend**:
   - L'utente viene automaticamente loggato
   - Viene reindirizzato alla dashboard

## Struttura delle Skills

### Hard Skills:
- Vengono create con `proficiencyLevel: 1` (livello base)
- Associate all'utente tramite `applicationUserHardId`
- Nome della skill preso direttamente dal file JSON

### Soft Skills:
- Vengono create con `proficiencyLevel: 1` (livello base)
- Associate all'utente tramite `applicationUserSoftId`
- Nome della skill preso direttamente dal file JSON

## Gestione degli Errori

### Backend:
- Se il file `skills-list.json` non può essere caricato, viene loggato un errore ma la registrazione continua
- Se il settore non viene trovato, viene loggato un warning ma la registrazione continua
- Se la creazione delle skills fallisce, viene loggato un errore ma la registrazione continua

### Frontend:
- Validazione obbligatoria del campo settore
- Messaggi di errore chiari per l'utente
- Gestione degli errori di rete

## Compatibilità

### Ruoli:
- **Mantenuta compatibilità** con il ruolo `admin` esistente
- **Aggiunto supporto** per il ruolo `superadmin`
- Tutti i controlli di autorizzazione funzionano con entrambi i ruoli

### Database:
- **Nessuna migrazione richiesta** per il database esistente
- Le skills vengono create nella tabella `EmployeeSkill` esistente
- Mantenuta la struttura relazionale esistente

## Testing

### Test Manuali:
1. Registrare un nuovo utente selezionando un settore
2. Verificare che l'utente abbia il ruolo `superadmin`
3. Verificare che le skills del settore siano state create nel database
4. Verificare che l'utente possa accedere alle funzionalità amministrative

### Test Automatici:
- Validazione del campo settore nel form
- Gestione degli errori di rete
- Creazione corretta delle skills nel database

## Sicurezza

### Considerazioni:
- Il ruolo `superadmin` ha tutti i permessi del sistema
- Le skills vengono create automaticamente senza validazione aggiuntiva
- Il file `skills-list.json` deve essere protetto da modifiche non autorizzate

### Raccomandazioni:
- Considerare l'implementazione di un processo di approvazione per i nuovi utenti
- Aggiungere validazione delle skills create automaticamente
- Implementare audit log per le creazioni di skills automatiche

## Rollback

Se necessario, per tornare al comportamento precedente:

1. **Backend**:
   - Rimuovere il parametro `sector` dalla funzione `register`
   - Rimuovere la chiamata a `createSkillsForUser`
   - Cambiare il ruolo di default da `superadmin` a `admin`

2. **Frontend**:
   - Rimuovere il campo settore dal form di registrazione
   - Rimuovere la validazione del campo settore
   - Aggiornare l'interfaccia User

3. **Database**:
   - Le skills create automaticamente rimarranno nel database
   - Considerare la pulizia manuale se necessario 