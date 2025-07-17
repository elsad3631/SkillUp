# Logging and Notifications System

Questo documento descrive il sistema di logging delle attività utente e di gestione delle notifiche implementato nel backend Azure Functions.

## 📋 Panoramica

Il sistema è composto da due componenti principali:

1. **UserActivityLog**: Traccia tutte le azioni compiute dagli utenti per permettere all'admin di monitorare l'attività del sistema
2. **Notification**: Gestisce messaggi tra utenti e notifiche di sistema per processi asincroni

## 🗄️ Schema Database

### UserActivityLog Table
```sql
CREATE TABLE "UserActivityLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "description" TEXT NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL,
  "errorMessage" TEXT,
  "metadata" JSON,
  FOREIGN KEY ("userId") REFERENCES "ApplicationUser"("id") ON DELETE CASCADE
);
```

### Notification Table
```sql
CREATE TABLE "Notification" (
  "id" TEXT PRIMARY KEY,
  "recipientId" TEXT NOT NULL,
  "senderId" TEXT,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "priority" TEXT DEFAULT 'MEDIUM',
  "isRead" BOOLEAN DEFAULT FALSE,
  "readAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP,
  "actionUrl" TEXT,
  "metadata" JSON,
  FOREIGN KEY ("recipientId") REFERENCES "ApplicationUser"("id") ON DELETE CASCADE,
  FOREIGN KEY ("senderId") REFERENCES "ApplicationUser"("id") ON DELETE SET NULL
);
```

## 🔧 Servizi

### UserActivityLogService

Il servizio fornisce metodi per:

- **Logging**: `create()`, `logSuccess()`, `logError()`, `logPending()`
- **Query**: `getAll()`, `getById()`, `getByUserId()`, `getByAction()`, `getByEntityType()`, `getByStatus()`, `getByDateRange()`
- **Gestione**: `update()`, `remove()`, `removeOldLogs()`
- **Statistiche**: `getStats()`

### NotificationService

Il servizio fornisce metodi per:

- **Creazione**: `create()`, `sendMessage()`, `sendSystemNotification()`
- **Notifiche specifiche**: `sendCVProcessingComplete()`, `sendProjectAssignment()`, `sendTaskCompletion()`
- **Query**: `getAll()`, `getById()`, `getByRecipientId()`, `getUnreadByRecipientId()`, `getByType()`, `getByPriority()`
- **Gestione**: `markAsRead()`, `markAllAsRead()`, `update()`, `remove()`, `removeExpired()`
- **Utility**: `getUnreadCount()`, `getStats()`

## 🌐 API Endpoints

### UserActivityLog Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/userActivityLog` | Get all logs |
| GET | `/api/userActivityLog/{id}` | Get log by ID |
| GET | `/api/userActivityLog/user/{userId}` | Get logs by user ID |
| GET | `/api/userActivityLog/action/{action}` | Get logs by action |
| GET | `/api/userActivityLog/entity/{entityType}` | Get logs by entity type |
| GET | `/api/userActivityLog/status/{status}` | Get logs by status |
| GET | `/api/userActivityLog/date-range` | Get logs by date range |
| GET | `/api/userActivityLog/stats` | Get log statistics |
| POST | `/api/userActivityLog` | Create new log |
| POST | `/api/userActivityLog/success` | Log successful action |
| POST | `/api/userActivityLog/error` | Log failed action |
| POST | `/api/userActivityLog/pending` | Log pending action |
| PUT | `/api/userActivityLog/{id}` | Update log |
| DELETE | `/api/userActivityLog/{id}` | Delete log |
| DELETE | `/api/userActivityLog/cleanup/{daysOld}` | Remove old logs |

### Notification Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notification` | Get all notifications |
| GET | `/api/notification/{id}` | Get notification by ID |
| GET | `/api/notification/recipient/{recipientId}` | Get notifications by recipient |
| GET | `/api/notification/unread/{recipientId}` | Get unread notifications |
| GET | `/api/notification/type/{type}` | Get notifications by type |
| GET | `/api/notification/priority/{priority}` | Get notifications by priority |
| GET | `/api/notification/unread-count/{recipientId}` | Get unread count |
| GET | `/api/notification/stats` | Get notification statistics |
| POST | `/api/notification` | Create new notification |
| POST | `/api/notification/message` | Send message notification |
| POST | `/api/notification/system` | Send system notification |
| POST | `/api/notification/cv-processing-complete` | Send CV processing complete |
| POST | `/api/notification/project-assignment` | Send project assignment |
| POST | `/api/notification/task-completion` | Send task completion |
| PUT | `/api/notification/{id}` | Update notification |
| PUT | `/api/notification/mark-read/{id}` | Mark as read |
| PUT | `/api/notification/mark-all-read/{recipientId}` | Mark all as read |
| DELETE | `/api/notification/{id}` | Delete notification |
| DELETE | `/api/notification/cleanup/expired` | Remove expired |

## 📝 Esempi di Utilizzo

### Logging delle Azioni Utente

```typescript
// Log di creazione employee
await userActivityLogService.logSuccess({
  userId: 'admin-id',
  action: 'CREATE_EMPLOYEE',
  entityType: 'ApplicationUser',
  entityId: 'new-employee-id',
  description: 'Created new employee John Doe',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  metadata: { department: 'IT', role: 'Developer' }
});

// Log di upload CV
await userActivityLogService.logPending({
  userId: 'user-id',
  action: 'UPLOAD_CV',
  entityType: 'CVData',
  description: 'Started CV processing for resume.pdf',
  metadata: { fileName: 'resume.pdf', fileSize: 1024000 }
});

// Log di errore
await userActivityLogService.logError({
  userId: 'user-id',
  action: 'UPDATE_PROJECT',
  entityType: 'Project',
  entityId: 'project-id',
  description: 'Failed to update project settings',
  errorMessage: 'Database connection timeout',
  metadata: { projectName: 'E-commerce Platform' }
});
```

### Invio Notifiche

```typescript
// Messaggio tra utenti
await notificationService.sendMessage({
  recipientId: 'recipient-id',
  senderId: 'sender-id',
  title: 'New Message',
  message: 'You have a new message from John',
  priority: 'MEDIUM'
});

// Notifica di completamento CV
await notificationService.sendCVProcessingComplete('user-id', {
  id: 'cv-id',
  fileName: 'resume.pdf'
});

// Notifica di assegnazione progetto
await notificationService.sendProjectAssignment('user-id', {
  id: 'project-id',
  name: 'E-commerce Platform',
  roleOnProject: 'Frontend Developer'
});

// Notifica di sistema
await notificationService.sendSystemNotification({
  recipientId: 'user-id',
  title: 'System Maintenance',
  message: 'System will be down for maintenance tonight',
  type: 'SYSTEM_MAINTENANCE',
  priority: 'HIGH',
  actionUrl: '/maintenance-schedule'
});
```

### Monitoraggio Admin

```typescript
// Dashboard admin - statistiche logs
const logStats = await userActivityLogService.getStats();
console.log(`Total logs: ${logStats.total}`);
console.log(`Success: ${logStats.success}, Failed: ${logStats.failed}`);

// Logs per utente specifico
const userLogs = await userActivityLogService.getByUserId('user-id', 50);

// Logs falliti
const failedLogs = await userActivityLogService.getByStatus('FAILED');

// Logs per range di date
const dateRangeLogs = await userActivityLogService.getByDateRange(
  new Date('2024-01-01'),
  new Date('2024-01-31')
);
```

### Gestione Notifiche

```typescript
// Notifiche dell'utente
const notifications = await notificationService.getByRecipientId('user-id');

// Notifiche non lette
const unreadNotifications = await notificationService.getUnreadByRecipientId('user-id');

// Conta notifiche non lette
const unreadCount = await notificationService.getUnreadCount('user-id');

// Marca come letto
await notificationService.markAsRead('notification-id');

// Marca tutte come lette
await notificationService.markAllAsRead('user-id');
```

## 🎯 Tipi di Azioni e Notifiche

### Azioni Loggabili
- `CREATE_EMPLOYEE` - Creazione nuovo dipendente
- `UPDATE_EMPLOYEE` - Modifica dipendente
- `DELETE_EMPLOYEE` - Eliminazione dipendente
- `CREATE_PROJECT` - Creazione progetto
- `UPDATE_PROJECT` - Modifica progetto
- `DELETE_PROJECT` - Eliminazione progetto
- `UPLOAD_CV` - Upload CV
- `PROCESS_CV` - Elaborazione CV
- `ASSIGN_PROJECT` - Assegnazione progetto
- `LOGIN` - Accesso utente
- `LOGOUT` - Disconnessione utente
- `CHANGE_PASSWORD` - Cambio password
- `UPDATE_PROFILE` - Aggiornamento profilo

### Tipi di Notifiche
- `MESSAGE` - Messaggio tra utenti
- `CV_PROCESSING_COMPLETE` - CV elaborato
- `PROJECT_ASSIGNMENT` - Assegnazione progetto
- `TASK_COMPLETION` - Completamento task
- `SYSTEM_UPDATE` - Aggiornamento sistema
- `SYSTEM_MAINTENANCE` - Manutenzione sistema
- `SECURITY_ALERT` - Allerta sicurezza
- `DEADLINE_REMINDER` - Promemoria scadenza

### Priorità Notifiche
- `LOW` - Bassa priorità
- `MEDIUM` - Priorità media (default)
- `HIGH` - Alta priorità
- `URGENT` - Urgente

## 🔒 Sicurezza e Privacy

### Logging
- Tutti i log includono timestamp automatico
- IP address e user agent opzionali per audit
- Metadata in formato JSON per flessibilità
- Possibilità di rimozione automatica log vecchi

### Notifiche
- Relazioni con utenti per integrità referenziale
- Supporto per notifiche di sistema (senza mittente)
- Scadenza automatica notifiche
- Gestione stato letto/non letto

## 🚀 Deployment

1. **Database Migration**: Eseguire la migration Prisma per creare le nuove tabelle
2. **Deploy Functions**: Deploy delle nuove Azure Functions
3. **Test**: Verificare il funzionamento con i test unitari
4. **Monitoring**: Configurare monitoring per le nuove funzionalità

## 📊 Monitoring e Manutenzione

### Pulizia Automatica
- Log vecchi: `DELETE /api/userActivityLog/cleanup/{daysOld}`
- Notifiche scadute: `DELETE /api/notification/cleanup/expired`

### Statistiche
- Log: `GET /api/userActivityLog/stats`
- Notifiche: `GET /api/notification/stats`

### Performance
- Indici consigliati su `userId`, `timestamp`, `isRead`
- Paginazione con parametro `limit`
- Query ottimizzate per relazioni

## 🔄 Integrazione con Frontend

Il frontend può integrare queste funzionalità per:

1. **Dashboard Admin**: Visualizzazione logs e statistiche
2. **Notifiche Real-time**: Badge contatore e lista notifiche
3. **Audit Trail**: Tracciamento azioni utente
4. **User Experience**: Feedback per azioni asincrone

## 📚 Risorse Aggiuntive

- [Documentazione API Completa](AZURE_FUNCTIONS_API_UPDATED.md)
- [Test Unitari](src/__tests__/)
- [Schema Prisma](prisma/schema.prisma) 