// Example: Azure Functions backend proxy
// This runs on Azure and keeps your API key secure

const { app } = require('@azure/functions');

app.http('planTask', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const { taskText } = await request.json();
            
            // Your API key stays secure on the server
            const response = await fetch(`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.AZURE_OPENAI_KEY // Secure environment variable
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: "Break down tasks into actionable subtasks. Return only a JSON array."
                        },
                        {
                            role: "user",
                            content: `Break down: "${taskText}"`
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            return { 
                status: 200,
                jsonBody: { 
                    subtasks: JSON.parse(data.choices[0].message.content) 
                }
            };
        } catch (error) {
            return { 
                status: 500, 
                jsonBody: { error: 'AI service unavailable' } 
            };
        }
    }
});
