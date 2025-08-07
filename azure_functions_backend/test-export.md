# Test della Funzionalità Export

## Test Backend

### 1. Test Endpoint `/api/export-filters`
```bash
curl -X GET "http://localhost:7071/api/export-filters" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Risposta attesa:**
```json
{
  "departments": ["IT", "HR", "Marketing", "Sales"],
  "roles": ["employee", "manager", "admin"]
}
```

### 2. Test Endpoint `/api/export` (Excel)
```bash
curl -X POST "http://localhost:7071/api/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "excel",
    "filters": {
      "status": "all",
      "includeContactInfo": true,
      "includeSkills": true,
      "includeExperience": false,
      "includeProjects": false
    }
  }' \
  --output "employees_export.xlsx"
```

### 3. Test Endpoint `/api/export` (CSV)
```bash
curl -X POST "http://localhost:7071/api/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "filters": {
      "status": "available",
      "departments": ["IT", "HR"],
      "includeContactInfo": true,
      "includeSkills": false,
      "includeExperience": true,
      "includeProjects": true
    }
  }' \
  --output "employees_export.csv"
```

## Test Frontend

### 1. Test Modal Export
1. Navigare alla pagina `/employees`
2. Cliccare sul pulsante "Export"
3. Verificare che il modal si apra correttamente
4. Verificare che i filtri siano caricati dinamicamente

### 2. Test Configurazione Export
1. Selezionare formato "Excel"
2. Selezionare un dipartimento
3. Selezionare "Available Only"
4. Attivare "Include Contact Information"
5. Cliccare "Export Employees"
6. Verificare che il download inizi automaticamente

### 3. Test Gestione Errori
1. Disconnettere la rete
2. Provare a fare export
3. Verificare che appaia un messaggio di errore appropriato

## Test di Performance

### 1. Test con Dati Grandi
```bash
# Generare export con tutti i dati
curl -X POST "http://localhost:7071/api/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "excel",
    "filters": {
      "status": "all",
      "includeContactInfo": true,
      "includeSkills": true,
      "includeExperience": true,
      "includeProjects": true
    }
  }' \
  --output "full_export.xlsx"
```

### 2. Test Filtri Complessi
```bash
# Test con filtri multipli
curl -X POST "http://localhost:7071/api/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "filters": {
      "status": "available",
      "departments": ["IT"],
      "roles": ["employee", "manager"],
      "dateRange": {
        "start": "2024-01-01",
        "end": "2024-12-31"
      },
      "includeContactInfo": true,
      "includeSkills": true,
      "includeExperience": true,
      "includeProjects": true
    }
  }' \
  --output "filtered_export.csv"
```

## Validazione Output

### 1. Verifica File Excel
- Aprire il file `.xlsx` con Excel o LibreOffice
- Verificare che le colonne siano corrette
- Verificare che i dati siano formattati correttamente
- Verificare che l'header sia stilizzato

### 2. Verifica File CSV
- Aprire il file `.csv` con un editor di testo
- Verificare che l'encoding sia UTF-8
- Verificare che i valori siano correttamente escaped
- Verificare che le virgole siano gestite correttamente

## Test di Sicurezza

### 1. Test Autenticazione
```bash
# Test senza token
curl -X POST "http://localhost:7071/api/export" \
  -H "Content-Type: application/json" \
  -d '{"format": "excel", "filters": {"status": "all"}}'
```
**Risposta attesa:** 401 Unauthorized

### 2. Test Validazione Input
```bash
# Test con formato non valido
curl -X POST "http://localhost:7071/api/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"format": "pdf", "filters": {"status": "all"}}'
```
**Risposta attesa:** 400 Bad Request

## Checklist Test

- [ ] Backend si avvia senza errori
- [ ] Endpoint `/api/export-filters` restituisce dati
- [ ] Endpoint `/api/export` genera file Excel
- [ ] Endpoint `/api/export` genera file CSV
- [ ] Modal si apre correttamente
- [ ] Filtri vengono caricati dinamicamente
- [ ] Download funziona automaticamente
- [ ] Gestione errori funziona
- [ ] File generati sono validi
- [ ] Performance è accettabile
- [ ] Sicurezza è implementata correttamente 