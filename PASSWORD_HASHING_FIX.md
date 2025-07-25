# Fix Password Hashing - Employee Creation

## Problema Identificato

Quando si creava un nuovo employee tramite `AddEmployeeModal.vue`, la password veniva salvata nel database in chiaro invece di essere hashata. Questo rappresentava un grave problema di sicurezza.

### Root Cause

1. **Frontend**: Il frontend inviava la password in chiaro nel campo `passwordHash`
2. **Backend**: Il servizio `applicationuser.service.ts` non gestiva l'hashing della password nel metodo `create()`

## Soluzioni Implementate

### 1. Backend - applicationuser.service.ts

#### Import aggiunto
```typescript
import * as bcrypt from 'bcrypt';
```

#### Metodo create() aggiornato
```typescript
async create(data: any) {
  const prismaData: any = { ...data };
  
  // Initialize with empty roles array - roles will be managed through UserRole table
  prismaData.roles = [];

  // Hash password if provided (passwordHash field contains the plain password from frontend)
  if (data.passwordHash) {
    prismaData.passwordHash = await bcrypt.hash(data.passwordHash, 10);
  }
  
  // ... resto del codice
}
```

#### Metodo update() aggiornato
```typescript
// Password hash update (if provided)
if (data.passwordHash) {
  prismaData.passwordHash = await bcrypt.hash(data.passwordHash, 10);
}
```

### 2. Frontend - AddEmployeeModal.vue

#### Commento aggiornato
```typescript
passwordHash: form.password, // Password in chiaro - verrà hashata dal backend
```

## Verifica della Soluzione

### Test di Hashing
Creato file `test-password-hash.js` per verificare che bcrypt funzioni correttamente:

```javascript
const bcrypt = require('bcrypt');

async function testPasswordHashing() {
  const plainPassword = 'testpassword123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
  console.log('✅ Password originale:', plainPassword);
  console.log('✅ Password hashata:', hashedPassword);
  console.log('✅ Verifica password:', await bcrypt.compare(plainPassword, hashedPassword));
}
```

### Flusso Corretto

1. **Frontend**: L'utente inserisce la password in chiaro
2. **Frontend**: Invia la password nel campo `passwordHash` 
3. **Backend**: Il servizio `applicationuser.service.ts` riceve la password in chiaro
4. **Backend**: Usa `bcrypt.hash(password, 10)` per hashare la password
5. **Database**: Salva la password hashata nel campo `passwordHash`

## Compatibilità

### Servizi già corretti
- `auth.service.ts` - già utilizzava bcrypt per l'hashing
- `cvdata.services.ts` - già utilizzava bcrypt per l'hashing
- `systemUser.service.ts` - già utilizzava bcrypt per l'hashing

### Servizi aggiornati
- `applicationuser.service.ts` - ora gestisce correttamente l'hashing

### Frontend
- `AddEmployeeModal.vue` - commento aggiornato per chiarezza
- `EditEmployeeModal.vue` - già funzionava correttamente

## Sicurezza

### Prima del fix
- ❌ Password salvate in chiaro nel database
- ❌ Grave vulnerabilità di sicurezza
- ❌ Possibile accesso non autorizzato ai dati

### Dopo il fix
- ✅ Password hashate con bcrypt (salt rounds: 10)
- ✅ Sicurezza conforme alle best practices
- ✅ Protezione contro attacchi di forza bruta

## Testing

Per testare il fix:

1. **Creare un nuovo employee** tramite `AddEmployeeModal.vue`
2. **Verificare nel database** che la password sia hashata (inizia con `$2b$`)
3. **Testare il login** con le credenziali create
4. **Aggiornare la password** tramite `EditEmployeeModal.vue` e verificare che sia hashata

## Note Tecniche

- **Algoritmo**: bcrypt con 10 salt rounds
- **Formato hash**: `$2b$10$...` (bcrypt versione 2b, 10 rounds)
- **Compatibilità**: Mantiene compatibilità con password già hashate
- **Performance**: Hashing asincrono per non bloccare il server 