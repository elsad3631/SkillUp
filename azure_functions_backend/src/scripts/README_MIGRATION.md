# Script di Migrazione Ruoli

## Panoramica

Questo script migra i ruoli dal campo `roles` dell'`ApplicationUser` alla tabella `UserRole` per utilizzare il nuovo sistema di gestione ruoli.

## Prerequisiti

1. **Database aggiornato**: Assicurati che il database sia aggiornato con lo schema più recente
2. **Ruoli inizializzati**: Esegui prima lo script `initialize-roles-permissions.ts` per creare i ruoli di base
3. **Backup del database**: Fai un backup del database prima di eseguire la migrazione

## Esecuzione

### 1. Inizializza i ruoli (se non già fatto)

```bash
cd azure_functions_backend
npx ts-node src/scripts/initialize-roles-permissions.ts
```

### 2. Esegui la migrazione

```bash
cd azure_functions_backend
npx ts-node src/scripts/migrate-roles-to-userrole.ts
```

## Cosa fa lo script

1. **Identifica gli utenti**: Trova tutti gli utenti che hanno ruoli nel campo `roles`
2. **Mappa i ruoli**: Ottiene tutti i ruoli disponibili dalla tabella `Role`
3. **Crea record UserRole**: Per ogni utente, crea i record corrispondenti nella tabella `UserRole`
4. **Evita duplicati**: Controlla se il record esiste già prima di crearlo
5. **Riepilogo**: Fornisce un report dettagliato della migrazione

## Output dello script

Lo script produce un output dettagliato che include:

- Numero di utenti trovati con ruoli nel campo `roles`
- Lista dei ruoli disponibili
- Progresso della migrazione per ogni utente
- Conteggio dei ruoli migrati e saltati
- Verifica finale dello stato

### Esempio di output:

```
🔄 Iniziando migrazione ruoli dal campo roles alla tabella UserRole...
📊 Trovati 3 utenti con ruoli nel campo roles
📋 Ruoli disponibili: admin, employee, manager, superadmin

👤 Migrazione utente: user1@example.com (uuid-1)
   Ruoli nel campo roles: [admin]
   ✅ Ruolo 'admin' assegnato con successo

👤 Migrazione utente: user2@example.com (uuid-2)
   Ruoli nel campo roles: [employee, manager]
   ✅ Ruolo 'employee' assegnato con successo
   ✅ Ruolo 'manager' assegnato con successo

🧹 Pulizia del campo roles...
⚠️  Pulizia del campo roles COMMENTATA per sicurezza

📈 Riepilogo migrazione:
   - Utenti processati: 3
   - Ruoli migrati: 3
   - Ruoli saltati: 0
   - Utenti con ruoli nel campo roles: 3

✅ Migrazione completata!
```

## Pulizia del campo roles

Per sicurezza, la pulizia del campo `roles` è commentata nello script. Per abilitarla:

1. Apri il file `migrate-roles-to-userrole.ts`
2. Trova la sezione commentata (righe 95-105 circa)
3. Decommenta le righe per abilitare la pulizia
4. Riesegui lo script

```typescript
// Decommenta queste righe per pulire il campo roles
await prisma.applicationUser.updateMany({
  where: {
    roles: {
      isEmpty: false
    }
  },
  data: {
    roles: []
  }
});
```

## Verifica post-migrazione

Dopo la migrazione, verifica che tutto funzioni correttamente:

1. **Test di login**: Verifica che gli utenti possano ancora accedere
2. **Controllo ruoli**: Usa l'endpoint `GET /api/users/:userId/roles` per verificare i ruoli
3. **Test permessi**: Verifica che i permessi vengano caricati correttamente

## Risoluzione problemi

### Errore: "Ruolo non trovato"
- Assicurati che i ruoli siano stati inizializzati correttamente
- Controlla che i nomi dei ruoli nel campo `roles` corrispondano a quelli nella tabella `Role`

### Errore: "Record già esistente"
- Questo è normale se la migrazione è già stata eseguita parzialmente
- Lo script salta automaticamente i record esistenti

### Errore di connessione al database
- Verifica che la variabile `DATABASE_URL` sia configurata correttamente
- Controlla che il database sia accessibile

## Rollback

Se necessario, puoi fare rollback della migrazione:

1. **Ripristina il backup del database**
2. **Oppure** elimina manualmente i record dalla tabella `UserRole`:

```sql
DELETE FROM "UserRole" WHERE "assignedBy" = 'system';
```

## Note importanti

- Lo script è idempotente: può essere eseguito più volte senza problemi
- I record esistenti nella tabella `UserRole` non vengono modificati
- Il campo `roles` rimane nella tabella per compatibilità
- La migrazione non influisce sui dati esistenti nella tabella `UserRole` 