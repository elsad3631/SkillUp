TASK LIST PER L'ESPANSIONE DEL DATABASE
🟢 1. Performance Review
➤ Obiettivo: Introdurre una tabella per tracciare la valutazione delle performance degli utenti.

 Aggiungi modello PerformanceReview

Permette ai manager o supervisori di valutare gli utenti su base periodica.

Traccia chi ha effettuato la valutazione, su chi, e con quali feedback e punteggio.

🟢 2. Formazione e Certificazioni
➤ Obiettivo: Estendere il sistema formativo con tracciamento utenti + certificazioni.

 Crea tabella TrainingEnrollment

Collega gli utenti con i training presenti in SkillTraining.

Gestisce lo stato della partecipazione (es. PLANNED, IN_PROGRESS, COMPLETED).

 Crea tabella Certification

Raccoglie informazioni sulle certificazioni ottenute dagli utenti, inclusa autorità emittente, data, e validità.

🟢 3. Task Management
➤ Obiettivo: Aggiungere una gestione delle attività (task) assegnabili a utenti e progetti.

 Crea modello Task

Permette di assegnare task a utenti specifici o a progetti.

Include data di scadenza, priorità, stato, e descrizione.

🟢 4. Mentorship
➤ Obiettivo: Introdurre un sistema mentor–mentee per programmi interni di crescita.

 Crea modello Mentorship

Tiene traccia dei rapporti di mentorship, periodo, obiettivi e note.

Permette di stabilire chi è mentor e chi è mentee.

🟢 5. Commenti e Collaborazione
➤ Obiettivo: Abilitare commenti generici su varie entità (progetti, task, esperienze, ecc.)

 Crea modello Comment

Collega un commento a un'entità generica via entityType e entityId.

Può essere riutilizzato ovunque (es. feedback a caldo).

🟢 6. Obiettivi e KPI
➤ Obiettivo: Tracciare obiettivi individuali o di team con valori misurabili.

 Crea modello Objective

Definisce un target da raggiungere entro un periodo definito.

Può essere aggiornato via interfaccia admin per follow-up ciclici.

🟢 7. Document Management
➤ Obiettivo: Permettere l'upload e l'associazione di documenti a utenti e progetti.

 Crea modello Document

Traccia documenti (es. contratti, manuali, certificati) caricati da un utente.

Collegabile a un utente o a un progetto.

🟢 8. Audit Log Avanzato
➤ Obiettivo: Tracciare modifiche o eventi critici ai dati per audit e tracciabilità.

 Crea modello AuditLog

Ogni modifica o evento importante può essere registrato.

Può contenere anche IP, UserAgent, tipo di evento e descrizione.

🟢 9. Impostazioni Utente
➤ Obiettivo: Memorizzare preferenze personali di ogni utente (es. lingua, notifiche).

 Crea modello UserSetting

Gestisce preferenze come tema, lingua, preferenze notifiche (JSON).

Collegato one-to-one all'utente.