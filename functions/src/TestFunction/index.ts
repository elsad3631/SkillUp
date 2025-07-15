import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function TestFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'World';
    
    // Converti headers in oggetto semplice
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
        headers[key] = value;
    });
    
    const responseData = {
        message: `Hello, ${name}! Questa è una funzione di test di Azure Functions.`,
        timestamp: new Date().toISOString(),
        method: request.method,
        url: request.url,
        headers: headers,
        functionName: 'TestFunction',
        status: 'success'
    };

    return { 
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(responseData, null, 2)
    };
}

app.http('TestFunction', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: TestFunction
}); 