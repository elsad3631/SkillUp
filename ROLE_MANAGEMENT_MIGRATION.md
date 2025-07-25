# Migrazione dalla Gestione Ruoli con Campo `roles` alla Tabella `UserRole`

## Panoramica

Questo documento descrive la migrazione dal sistema di gestione ruoli che utilizzava il campo `roles` nell'`ApplicationUser` al nuovo sistema che utilizza esclusivamente la tabella `UserRole` per una gestione più granulare e flessibile dei ruoli.

## Problema Identificato

Durante la creazione degli utenti, il ruolo `admin` veniva assegnato direttamente nel campo `roles` dell'`ApplicationUser`, creando una duplicazione e potenziali inconsistenze con il sistema di ruoli basato sulla tabella `UserRole`.

## Modifiche Apportate

### 1. Servizio di Autenticazione (`auth.service.ts`)

**Prima:**
```typescript
const user = await prisma.applicationUser.create({
  data: { 
    // ... altri campi
    roles: ['admin'], // Ruolo assegnato direttamente nel campo
  },
});
```

**Dopo:**
```typescript
const user = await prisma.applicationUser.create({
  data: { 
    // ... altri campi
    roles: [], // Inizializzato con array vuoto
  },
});

// Assegnazione ruolo attraverso la tabella UserRole
await roleService.assignRoleToUser({
  userId: user.id,
  roleId: adminRole.id,
  assignedBy: 'system'
});
```

**Modifiche al Login:**
- Ora recupera i ruoli dalla tabella `UserRole` invece che dal campo `roles`
- Include i permessi associati ai ruoli dell'utente

### 2. Servizio ApplicationUser (`applicationuser.service.ts`)

**Metodi Modificati:**
- `create()`: Inizializza sempre `roles: []`
- `update()`: Rimuove la gestione del campo `roles`
- `getByRole()`: Utilizza la tabella `UserRole` per filtrare gli utenti
- `updateRoles()`: Completamente riscritto per utilizzare la tabella `UserRole`

**Nuovi Metodi:**
- `getUserRoles(userId)`: Recupera i ruoli di un utente dalla tabella `UserRole`
- `getUserRolesWithPermissions(userId)`: Recupera ruoli e permessi associati

### 3. Servizio CV Data (`cvdata.services.ts`)

**Modificato:**
- Inizializza sempre `roles: []` durante la creazione di utenti da CV
- Assegna il ruolo `admin` attraverso la tabella `UserRole`

### 4. Script di Inizializzazione (`initialize-roles-permissions.ts`)

**Modificato:**
- L'utente superadmin viene creato con `roles: []`
- Il ruolo viene assegnato attraverso la tabella `UserRole`

### 5. Servizio System User (`systemUser.service.ts`)

**Modificato:**
- L'utente di sistema viene creato con `roles: []`
- Il metodo `isSystemUser()` ora controlla la tabella `UserRole`

## Vantaggi della Nuova Implementazione

### 1. **Gestione Granulare**
- Possibilità di assegnare più ruoli a un utente
- Controllo temporale sui ruoli (campo `expiresAt`)
- Tracciamento di chi ha assegnato il ruolo (campo `assignedBy`)

### 2. **Consistenza dei Dati**
- Eliminazione della duplicazione tra campo `roles` e tabella `UserRole`
- Unica fonte di verità per i ruoli degli utenti

### 3. **Flessibilità**
- Possibilità di attivare/disattivare ruoli senza eliminarli
- Sistema di permessi integrato con i ruoli
- Storico delle assegnazioni di ruoli

### 4. **Sicurezza**
- Controllo granulare sui permessi
- Possibilità di revocare ruoli temporaneamente
- Audit trail delle assegnazioni

## Endpoint API Disponibili

### Gestione Ruoli
- `GET /api/roles` - Lista tutti i ruoli
- `POST /api/roles` - Crea nuovo ruolo
- `PUT /api/roles/:id` - Aggiorna ruolo
- `DELETE /api/roles/:id` - Elimina ruolo

### Assegnazione Ruoli
- `POST /api/roles/assign` - Assegna ruolo a utente
- `DELETE /api/roles/assign/:userId/:roleId` - Rimuovi ruolo da utente
- `GET /api/users/:userId/roles` - Ottieni ruoli di un utente

## Migrazione dei Dati Esistenti

Per gli utenti esistenti che hanno ruoli nel campo `roles`, è necessario:

1. **Identificare gli utenti con ruoli nel campo `roles`:**
```sql
SELECT id, email, roles FROM "ApplicationUser" WHERE array_length(roles, 1) > 0;
```

2. **Creare record nella tabella `UserRole`:**
```sql
INSERT INTO "UserRole" (id, "userId", "roleId", "assignedBy", "assignedAt", "isActive")
SELECT 
  gen_random_uuid(),
  au.id,
  r.id,
  'system',
  NOW(),
  true
FROM "ApplicationUser" au
CROSS JOIN LATERAL unnest(au.roles) AS role_name
JOIN "Role" r ON r.name = role_name
WHERE array_length(au.roles, 1) > 0;
```

3. **Pulire il campo `roles`:**
```sql
UPDATE "ApplicationUser" SET roles = '{}' WHERE array_length(roles, 1) > 0;
```

## Note Importanti

### 1. **Compatibilità**
- Il campo `roles` rimane nella tabella per compatibilità con il frontend esistente
- Viene sempre inizializzato come array vuoto
- Non viene più utilizzato per la logica di business

### 2. **Performance**
- Le query per i ruoli ora richiedono JOIN con la tabella `UserRole`
- Considerare l'aggiunta di indici appropriati per ottimizzare le performance

### 3. **Testing**
- Verificare che tutti gli endpoint funzionino correttamente
- Testare l'assegnazione e rimozione di ruoli
- Verificare che i permessi vengano caricati correttamente durante il login

## Prossimi Passi

1. **Aggiornamento Frontend**: Modificare il frontend per utilizzare i nuovi endpoint
2. **Migrazione Dati**: Eseguire la migrazione dei dati esistenti
3. **Testing Completo**: Verificare che tutto funzioni correttamente
4. **Documentazione API**: Aggiornare la documentazione API
5. **Rimozione Campo Roles**: Una volta completata la migrazione, considerare la rimozione del campo `roles` dallo schema

## Conclusioni

Questa migrazione migliora significativamente la gestione dei ruoli nel sistema, fornendo maggiore flessibilità, sicurezza e consistenza dei dati. Il nuovo sistema è più scalabile e permette una gestione granulare dei permessi e dei ruoli degli utenti. 