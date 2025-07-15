import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { cvDataService } from '../services/cvdata.service';

export async function CVExtractorFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('CV Extractor Function triggered');

    try {
        // Verifica che sia una richiesta POST
        if (request.method !== 'POST') {
            return {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Method not allowed. Use POST.' })
            };
        }

        // Verifica Content-Type per multipart/form-data
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Content-Type must be multipart/form-data' })
            };
        }

        // Ottieni il form data dalla richiesta
        const formData = await request.formData();
        const file = formData.get('cv') as File;

        if (!file) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'No file uploaded' })
            };
        }

        // Verifica il tipo di file
        const fileName = file.name;
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext !== 'pdf' && ext !== 'docx') {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Only .pdf and .docx files are allowed' })
            };
        }

        // Verifica la dimensione del file (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'File size must be less than 10MB' })
            };
        }

        context.log('File uploaded:', {
            originalname: fileName,
            mimetype: file.type,
            size: file.size
        });

        // Converti il file in buffer
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        // Chiama il servizio per estrarre i dati dal CV
        const result = await cvDataService.extractFromCV(fileBuffer, fileName);
        
        context.log('Service result:', result);

        return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        };

    } catch (error) {
        context.log('Service error:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        return {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: 'Error processing CV', 
                error: errorMessage 
            })
        };
    }
}

app.http('CVExtractorFunction', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: CVExtractorFunction
}); 