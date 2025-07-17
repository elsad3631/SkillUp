# Activity Logging Implementation

## Overview
Questa implementazione aggiunge il logging automatico delle attività quando un utente viene eliminato dal sistema. Ogni eliminazione di utente viene ora tracciata con dettagli completi per audit e debugging.

## Modifiche Frontend

### ApiService.ts
- **Aggiunto import** di `useCurrentUser` composable
- **Modificato `setHeader()`** per includere automaticamente l'header `x-user-id`
- **Aggiunto `getCurrentUserId()`** per recuperare l'ID utente dal localStorage
- **Modificati tutti i metodi HTTP** (GET, POST, PUT, DELETE) per includere l'header `x-user-id`
- **Aggiunto `getRequestHeaders()`** per gestire gli header dinamici

### useCurrentUser.ts
- **Aggiunto salvataggio** dell'utente corrente nel localStorage (`currentUser`)
- **Aggiunta pulizia** del localStorage durante logout e errori di autenticazione
- **Aggiornamento** del localStorage quando l'utente viene modificato

### auth.ts (Store)
- **Aggiunto salvataggio** dell'utente nel localStorage durante login
- **Aggiunta pulizia** del localStorage durante logout

## Modifiche Backend

### systemUser.service.ts (NUOVO)
- **Servizio dedicato** per gestire l'utente system
- **getOrCreateSystemUser()**: Crea automaticamente l'utente system se non esiste
- **getSystemUserId()**: Restituisce l'ID dell'utente system
- **isSystemUser()**: Verifica se un ID appartiene all'utente system
- **Utente system reale**: Username 'system', email 'system@skillup.local', ruolo 'system'

### applicationuser.service.ts
- **Aggiunto import** di `userActivityLogService` e `systemUserService`
- **Modificato `remove()`** per accettare parametri aggiuntivi (`deletedByUserId`, `ipAddress`, `userAgent`)
- **Validazione utente esecutore**: Verifica che l'utente che esegue l'eliminazione esista
- **Salvataggio informazioni**: Le informazioni dell'utente da eliminare vengono salvate prima dell'eliminazione
- **Aggiunto logging** prima, durante e dopo l'eliminazione
- **Gestione completa degli errori** con logging degli errori
- **Eliminazione completa** di tutti i dati correlati (esperienze, skills, CV, progetti, notifiche)
- **Risoluzione foreign key constraint**: I log vengono creati con l'ID dell'utente esecutore, non dell'utente eliminato
- **Utente System**: Utilizzo di un utente system reale nel database invece di stringhe

### extractCVData.ts
- **Corretto destinatario notifiche**: Le notifiche vengono ora inviate all'utente che ha caricato il CV (non all'utente creato)
- **Aggiunto import** di `systemUserService`
- **Aggiunto logging** per le notifiche inviate e fallite
- **Migliorata gestione errori** con logging dettagliato
- **Messaggi più chiari** nelle notifiche di successo ed errore
- **Utente System**: Utilizzo di un utente system reale nel database invece di stringhe

### notification.service.ts
- **Aggiunto import** di `systemUserService`
- **Modificato `sendSystemNotification()`** per impostare `senderId` con l'ID dell'utente system reale
- **Notifiche corrette**: `senderId` = ID utente system, `recipientId` = ID utente loggato

### user.service.ts
- **Stesse modifiche** di `applicationuser.service.ts` per consistenza
- **Aggiunto import** di `userActivityLogService` e `systemUserService`
- **Validazione utente esecutore**: Verifica che l'utente che esegue l'eliminazione esista
- **Salvataggio informazioni**: Le informazioni dell'utente da eliminare vengono salvate prima dell'eliminazione
- **Risoluzione foreign key constraint**: I log vengono creati con l'ID dell'utente esecutore, non dell'utente eliminato
- **Utente System**: Utilizzo di un utente system reale nel database invece di stringhe

### applicationuser.ts (Function)
- **Modificato `applicationUserRemove`** per estrarre informazioni utente dalle headers
- **Aggiunta gestione** di IP address e user agent per audit trail

### user.ts (Function)
- **Modificato `deleteUser`** per estrarre informazioni utente dalle headers

## Tipi di Log Creati

### 1. USER_DELETION_STARTED
- **Quando**: All'inizio del processo di eliminazione
- **Status**: PENDING
- **Dati**: Informazioni dell'utente da eliminare, conteggio dati correlati

### 2. USER_DELETION_COMPLETED
- **Quando**: Eliminazione completata con successo
- **Status**: SUCCESS
- **Dati**: Informazioni dell'utente eliminato, dettagli sui dati correlati eliminati

### 3. USER_DELETION_FAILED
- **Quando**: Errore durante l'eliminazione
- **Status**: FAILED
- **Dati**: Dettagli dell'errore, stack trace, informazioni utente

### 4. CV_PROCESSING_NOTIFICATION_SENT
- **Quando**: Notifica di successo inviata per elaborazione CV
- **Status**: SUCCESS
- **Dati**: Informazioni sul file CV, ID utente creato, tipo notifica

### 5. CV_PROCESSING_NOTIFICATION_FAILED
- **Quando**: Errore nell'invio della notifica per elaborazione CV
- **Status**: FAILED
- **Dati**: Dettagli dell'errore di notifica, informazioni sul file CV

## Informazioni Registrate nei Log

### Dati dell'Utente Eliminato
- ID, username, email, nome, cognome
- Ruoli, dipartimento, ruolo corrente
- Stato di disponibilità

### Conteggio Dati Correlati
- Numero di esperienze
- Numero di hard skills
- Numero di soft skills
- Numero di assegnazioni progetti
- Numero di activity log
- Numero di notifiche inviate/ricevute

### Informazioni di Audit
- ID dell'utente che ha eseguito l'eliminazione
- IP address
- User agent
- Timestamp dell'operazione

### Dettagli Tecnici (in caso di errori)
- Messaggio di errore
- Stack trace
- Timestamp dell'errore

## Come Testare

### 1. Verificare Header Frontend
```javascript
// Nel browser console, dopo il login
console.log(localStorage.getItem('currentUser'));
// Dovrebbe mostrare l'oggetto utente con l'ID

// Verificare che le richieste includano l'header
// Aprire Network tab in DevTools e controllare le richieste
```

### 2. Verificare Log Backend
```sql
-- Controllare i log di attività
SELECT * FROM "UserActivityLog" 
WHERE action LIKE 'USER_DELETION%' 
ORDER BY timestamp DESC;
```

### 3. Testare Eliminazione Utente
1. Accedere come admin
2. Eliminare un utente
3. Verificare che vengano creati i log:
   - `USER_DELETION_STARTED`
   - `USER_DELETION_COMPLETED`
4. Verificare che tutti i dati correlati siano stati eliminati

## Sistema di Notifiche

### Notifiche di Successo CV
- **Destinatario**: Utente che ha caricato il CV (non l'utente creato)
- **Messaggio**: Conferma dell'elaborazione completata
- **Action URL**: Link al profilo dell'utente creato o alla lista dipendenti
- **Metadati**: Nome file, ID utente creato, timestamp

### Notifiche di Errore CV
- **Destinatario**: Utente che ha caricato il CV
- **Messaggio**: Dettagli dell'errore con nome file
- **Metadati**: Nome file, messaggio errore, timestamp

### Logging Notifiche
- **CV_PROCESSING_NOTIFICATION_SENT**: Notifica inviata con successo
- **CV_PROCESSING_NOTIFICATION_FAILED**: Errore nell'invio notifica
- **Tracciabilità completa**: Ogni notifica è registrata nei log di attività

## Vantaggi dell'Implementazione

1. **Tracciabilità Completa**: Ogni eliminazione è tracciata
2. **Audit Trail**: Possibilità di ricostruire chi ha eliminato cosa e quando
3. **Debugging Migliorato**: Log dettagliati per identificare problemi
4. **Compliance**: Rispetto dei requisiti di audit per applicazioni enterprise
5. **Consistenza**: Entrambi i servizi di eliminazione funzionano allo stesso modo
6. **Sicurezza**: Tracciamento di IP e user agent per sicurezza
7. **Notifiche Corrette**: Le notifiche vengono inviate al mittente corretto

## Risoluzione Problemi

### Foreign Key Constraint Error
**Problema**: Errore "Foreign key constraint violated" durante l'eliminazione utente
**Causa**: Tentativo di creare log con `userId` dell'utente eliminato
**Soluzione**: 
- Validazione dell'utente esecutore prima dell'eliminazione
- Salvataggio delle informazioni dell'utente da eliminare prima dell'operazione
- Utilizzo dell'ID dell'utente esecutore nei log, non dell'utente eliminato

### Validazione Utente Esecutore
- Verifica che l'utente che esegue l'eliminazione esista nel database
- Fallback a 'system' se l'utente non viene trovato
- Prevenzione di errori di foreign key constraint

## Note Tecniche

- L'header `x-user-id` viene inviato automaticamente da tutte le richieste HTTP
- Il localStorage viene sincronizzato con lo stato dell'utente corrente
- I log includono metadati JSON per flessibilità futura
- Gestione robusta degli errori con fallback a 'system' per operazioni automatiche
- **Risoluzione foreign key constraint**: I log utilizzano sempre l'ID dell'utente esecutore 