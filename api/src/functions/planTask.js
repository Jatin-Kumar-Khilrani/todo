const { app } = require('@azure/functions');

app.http('planTask', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('HTTP trigger function processed a request.');

        try {
            // Get the task title from the request body
            const requestText = await request.text();
            let body;
            
            try {
                body = JSON.parse(requestText);
            } catch (parseError) {
                return {
                    status: 400,
                    jsonBody: { 
                        error: 'Invalid JSON in request body',
                        message: 'Request body must be valid JSON' 
                    }
                };
            }

            const { taskTitle } = body;

            if (!taskTitle || !taskTitle.trim()) {
                return {
                    status: 400,
                    jsonBody: { 
                        error: 'Missing task title',
                        message: 'taskTitle is required in request body' 
                    }
                };
            }

            // Get Azure OpenAI configuration from environment variables
            const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
            const apiKey = process.env.AZURE_OPENAI_API_KEY;
            const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini-vibe';

            if (!endpoint || !apiKey) {
                context.log('Missing Azure OpenAI configuration');
                return {
                    status: 500,
                    jsonBody: { 
                        error: 'Service configuration error',
                        message: 'Azure OpenAI service is not properly configured' 
                    }
                };
            }

            // Prepare the request to Azure OpenAI
            const azureUrl = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`;
            
            const prompt = `Break down the following main task into smaller, actionable subtasks. Return ONLY a JSON array of strings, with no additional text or formatting. Each subtask should be clear and specific. Limit to maximum 10 subtasks.

Main task: "${taskTitle.trim()}"

Example response format: ["Subtask 1", "Subtask 2", "Subtask 3"]`;

            const openAIRequestBody = {
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that breaks down tasks into actionable subtasks. Always respond with a valid JSON array of strings."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            };

            context.log('Making request to Azure OpenAI...');

            // Make the request to Azure OpenAI
            const response = await fetch(azureUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey
                },
                body: JSON.stringify(openAIRequestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                context.log('Azure OpenAI API error:', response.status, errorText);
                
                return {
                    status: 500,
                    jsonBody: { 
                        error: 'AI service error',
                        message: `Failed to generate subtasks: ${response.status} ${response.statusText}` 
                    }
                };
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content?.trim();

            if (!content) {
                context.log('No content in AI response');
                return {
                    status: 500,
                    jsonBody: { 
                        error: 'Empty AI response',
                        message: 'No content received from AI service' 
                    }
                };
            }

            // Parse the AI response
            let subtasks;
            try {
                // Try to parse as JSON array first
                subtasks = JSON.parse(content);
                if (!Array.isArray(subtasks)) {
                    throw new Error('Response is not an array');
                }
            } catch (parseError) {
                context.log('Failed to parse JSON, attempting text parsing:', parseError.message);
                // If JSON parsing fails, try to extract subtasks from text
                const lines = content.split('\n').filter(line => line.trim());
                subtasks = lines
                    .map(line => line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim())
                    .filter(line => line.length > 0)
                    .slice(0, 10);
                
                if (subtasks.length === 0) {
                    context.log('Could not extract subtasks from content:', content);
                    return {
                        status: 500,
                        jsonBody: { 
                            error: 'Parse error',
                            message: 'Could not extract subtasks from AI response' 
                        }
                    };
                }
            }

            // Limit to 10 subtasks and ensure they're strings
            const finalSubtasks = subtasks
                .slice(0, 10)
                .map(task => String(task).trim())
                .filter(task => task.length > 0);

            context.log('Successfully generated subtasks:', finalSubtasks.length);

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                jsonBody: {
                    subtasks: finalSubtasks,
                    originalTask: taskTitle.trim(),
                    count: finalSubtasks.length
                }
            };

        } catch (error) {
            context.log('Unexpected error:', error);
            return {
                status: 500,
                jsonBody: { 
                    error: 'Internal server error',
                    message: 'An unexpected error occurred while processing your request' 
                }
            };
        }
    }
});
