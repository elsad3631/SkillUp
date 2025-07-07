# SkillUp Backend - Guida ai Test Automatici

## Prerequisiti
- Node.js 20.x LTS
- PostgreSQL in esecuzione e configurato in `.env`
- Dipendenze installate (`npm install`)

## Strumenti utilizzati
- **Jest**: test runner per JavaScript/TypeScript
- **ts-jest**: supporto TypeScript per Jest
- **Supertest**: test delle API HTTP
- **Prisma**: ORM per il database

## Struttura dei test
- Tutti i test si trovano nella cartella `src/__tests__`.
- I file di test hanno estensione `.test.ts`.
- Ogni file di test può testare una o più route, servizi o funzionalità.

Esempio struttura:
```
src/
  __tests__/
    auth.test.ts
    employee.test.ts
    project.test.ts
```

## Scrivere un test di esempio
Esempio di test per la registrazione e login utente:
```ts
import request from 'supertest';
import express from 'express';
import { json } from 'body-parser';
import authRoutes from '../routes/auth.routes';

const app = express();
app.use(json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  it('should register and login a user', async () => {
    const user = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Test1234!',
      roles: ['Employee']
    };
    // Register
    const regRes = await request(app)
      .post('/api/auth/register')
      .send(user);
    expect(regRes.status).toBe(201);
    expect(regRes.body.email).toBe(user.email);
    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user.email).toBe(user.email);
  });
});
```

## Eseguire i test

1. Assicurati che il database sia attivo e la variabile `DATABASE_URL` sia corretta in `.env`.
2. Esegui:
   ```sh
   npx jest
   ```
   oppure, se hai uno script nel `package.json`:
   ```sh
   npm test
   ```

## Best practice
- Usa una base dati di test separata per evitare di alterare i dati reali.
- Pulisci i dati di test tra un test e l'altro (setup/teardown).
- Testa sia i casi di successo che di errore (es. validazione, permessi, errori DB).
- Per testare route protette, effettua prima il login e usa il token JWT nelle richieste.

## Esempio di test per una route protetta
```ts
it('should get employees only if authenticated', async () => {
  // Effettua login e ottieni token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'testuser@example.com', password: 'Test1234!' });
  const token = loginRes.body.token;

  // Richiesta autenticata
  const res = await request(app)
    .get('/api/employees')
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
});
```

## Documentazione utile
- [Jest](https://jestjs.io/it/docs/getting-started)
- [Supertest](https://github.com/visionmedia/supertest)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing)

## Avviare il progetto

Assicurati di aver configurato il file `.env` e installato le dipendenze (`npm install`).

- **Sviluppo (hot reload):**
  ```sh
  npm run dev
  ```
- **Build produzione:**
  ```sh
  npm run build
  ```
- **Avvio produzione:**
  ```sh
  npm start
  ```
- **Eseguire i test:**
  ```sh
  npm test
  ```

---
Per domande o problemi, consulta la documentazione ufficiale o apri una issue nel repository. 