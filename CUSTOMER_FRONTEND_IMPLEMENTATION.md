# Implementazione Frontend per Customer Management

## Panoramica

È stata implementata una completa gestione dei customer nel frontend, prendendo spunto dalla struttura esistente per gli employee. L'implementazione include:

## File Creati

### 1. Modello Customer
**File:** `frontend/app/src/core/models/Customer.ts`
- Definisce l'interfaccia Customer con tutti i campi necessari
- Estende CosmosEntityBase per ID e timestamp
- Include relazioni con projects e calendarEvents

### 2. Servizi API
**File:** `frontend/app/src/core/services/businessServices/Customer.ts`
- `getAllCustomers()` - Recupera tutti i customer
- `getCustomerById(id)` - Recupera un customer specifico
- `createCustomer(data)` - Crea un nuovo customer
- `updateCustomer(id, data)` - Aggiorna un customer esistente
- `deleteCustomer(id)` - Elimina un customer
- `searchCustomers(query)` - Cerca customer per nome, company, email, contact person
- `getCustomersByStatus(status)` - Filtra per status
- `getCustomersWithProjects()` - Recupera customer con progetti associati

### 3. Pagine Vue

#### Lista Customer
**File:** `frontend/app/src/views/customer/List.vue`
- Tabella con datatable per visualizzare tutti i customer
- Ricerca funzionale su nome, company, email, contact person, etc.
- Azioni: View, Edit, Delete
- Selezione multipla per eliminazione in batch
- Modal per aggiunta nuovo customer

#### Modal Aggiunta Customer
**File:** `frontend/app/src/components/customer/AddCustomerModal.vue`
- Form completo per creazione nuovo customer
- Sezioni organizzate:
  - Basic Information (nome, company, industry, status, website, VAT, fiscal code)
  - Contact Information (email, phone, contact person, contact phone, contact email)
  - Address Information (indirizzo, città, paese)
  - Additional Information (note)

#### Pagina Dettaglio Customer
**File:** `frontend/app/src/views/customer/Overview.vue`
- Visualizzazione completa dei dettagli customer
- Sezioni organizzate:
  - Header con avatar e informazioni principali
  - Contact Information
  - Address Information
  - Business Information (VAT, fiscal code, industry, status)
  - Statistics (numero progetti, date creazione/aggiornamento)
  - Notes
  - Projects associati (se presenti)

#### Pagina Modifica Customer
**File:** `frontend/app/src/views/customer/Settings.vue`
- Form di modifica completo
- Stessa struttura del form di creazione
- Salvataggio con validazione
- Statistiche customer

### 4. Routing
**Modifiche a:** `frontend/app/src/router/index.ts`
- Aggiunta rotta `/customers` per la lista
- Aggiunta rotta `/customers/:id` con sottorotte per overview e settings
- Redirect automatico a overview quando si accede a un customer specifico

### 5. Menu di Navigazione
**Modifiche a:** `frontend/app/src/core/config/MainMenuConfig.ts`
- Aggiunta voce "customers" nel menu principale
- Icona "profile-user" per i customer

## Funzionalità Implementate

### ✅ Creazione Customer
- Modal con form completo
- Validazione campi obbligatori
- Gestione errori e feedback utente

### ✅ Visualizzazione Customer
- Lista con datatable
- Ricerca avanzata
- Filtri per status
- Paginazione

### ✅ Modifica Customer
- Pagina dedicata per modifiche
- Form pre-popolato con dati esistenti
- Salvataggio con conferma

### ✅ Eliminazione Customer
- Eliminazione singola con conferma
- Eliminazione multipla in batch
- Gestione errori

### ✅ Navigazione
- Menu di navigazione aggiornato
- Breadcrumbs funzionanti
- Routing completo

## Struttura Dati Customer

```typescript
interface Customer {
  id: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  vatNumber?: string;
  fiscalCode?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  industry?: string;
  website?: string;
  createdAt?: Date;
  updatedAt?: Date;
  projects?: any[];
  calendarEvents?: any[];
}
```

## Status Customer
- **ACTIVE** - Cliente attivo
- **INACTIVE** - Cliente inattivo  
- **PROSPECT** - Cliente potenziale

## Integrazione con Backend

L'implementazione si integra perfettamente con il backend esistente:
- Utilizza le API già implementate in `azure_functions_backend/src/functions/customer.ts`
- Gestisce tutti i campi definiti nel modello Prisma
- Supporta le relazioni con projects e calendarEvents

## UI/UX

- Design coerente con il resto dell'applicazione
- Utilizzo delle stesse componenti (Datatable, Loading, etc.)
- Icone Keenthemes per consistenza visiva
- Responsive design
- Feedback utente con SweetAlert2

## Prossimi Passi

1. **Test delle funzionalità** - Verificare che tutto funzioni correttamente
2. **Permessi e autorizzazioni** - Implementare controlli di accesso se necessari
3. **Validazioni avanzate** - Aggiungere validazioni più specifiche per i campi
4. **Filtri avanzati** - Implementare filtri per industry, status, etc.
5. **Export dati** - Implementare funzionalità di export
6. **Import dati** - Implementare funzionalità di import da CSV/Excel

## Note Tecniche

- Utilizza Vue 3 Composition API
- TypeScript per type safety
- Prisma per il modello dati
- Bootstrap per il design
- Keenthemes per le icone
- SweetAlert2 per le notifiche
- Axios per le chiamate API 