# Test Rapido Export Functionality

## Test Backend

### 1. Verifica che il backend sia in esecuzione
```bash
# Il backend dovrebbe essere in esecuzione su http://localhost:7071
```

### 2. Test Endpoint Filtri
```bash
curl -X GET "http://localhost:7071/api/export-filters" \
  -H "Content-Type: application/json"
```

**Risposta attesa:**
```json
{
  "departments": ["IT", "HR", "Marketing"],
  "roles": ["employee", "manager", "admin"]
}
```

### 3. Test Export Excel Base
```bash
curl -X POST "http://localhost:7071/api/export" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "excel",
    "filters": {
      "status": "all",
      "includeContactInfo": true,
      "includeSkills": false,
      "includeExperience": false,
      "includeProjects": false
    }
  }' \
  --output "test_export.xlsx"
```

### 4. Test Export CSV Base
```bash
curl -X POST "http://localhost:7071/api/export" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "filters": {
      "status": "all",
      "includeContactInfo": true,
      "includeSkills": false,
      "includeExperience": false,
      "includeProjects": false
    }
  }' \
  --output "test_export.csv"
```

## Test Frontend

### 1. Avvia il frontend
```bash
cd frontend/app
npm run dev
```

### 2. Test Modal
1. Navigare a `http://localhost:3000/employees`
2. Cliccare "Export"
3. Verificare che il modal si apra
4. Verificare che i filtri siano caricati

### 3. Test Export
1. Selezionare "Excel"
2. Selezionare un dipartimento
3. Cliccare "Export Employees"
4. Verificare che il download inizi

## Debug

### Log Backend
Controllare i log del backend per vedere:
- `🔍 Starting getFilteredEmployees with filters:`
- `🔍 Where clause:`
- `🔍 Include clause:`
- `✅ Found X employees`

### Errori Comuni
1. **500 Internal Server Error**: Controllare i log del backend
2. **Modal non si apre**: Verificare che il componente sia importato
3. **Filtri vuoti**: Verificare che ci siano dati nel database
4. **Download non funziona**: Verificare che il browser permetta i download

## Risoluzione Problemi

### Se il backend non si avvia:
```bash
cd azure_functions_backend
npm install
npm run build
npm start
```

### Se il frontend non si avvia:
```bash
cd frontend/app
npm install
npm run dev
```

### Se ci sono errori di tipo:
```bash
cd frontend/app
npm run type-check
```

## Checklist Completa

- [ ] Backend si avvia senza errori
- [ ] Endpoint `/api/export-filters` restituisce dati
- [ ] Endpoint `/api/export` genera file Excel
- [ ] Endpoint `/api/export` genera file CSV
- [ ] Frontend si avvia senza errori
- [ ] Modal si apre correttamente
- [ ] Filtri vengono caricati dinamicamente
- [ ] Download funziona automaticamente
- [ ] File generati sono validi 