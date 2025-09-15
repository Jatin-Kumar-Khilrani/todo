class TodoApp {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.subtaskIdCounter = 1;
        this.aiSettings = {
            endpoint: 'https://jkhilrani-vibe-2025-resource.cognitiveservices.azure.com/',
            apiKey: '',
            deploymentName: 'gpt-4o-mini-vibe'
        };
        
        this.initializeElements();
        this.bindEvents();
        this.loadFromStorage();
        this.loadAiSettings();
        this.render();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.tasksContainer = document.getElementById('tasksContainer');
        this.emptyState = document.getElementById('emptyState');
        
        // Settings elements
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.apiEndpointInput = document.getElementById('apiEndpoint');
        this.apiKeyInput = document.getElementById('apiKey');
        this.deploymentNameInput = document.getElementById('deploymentName');
        this.toggleApiKeyBtn = document.getElementById('toggleApiKey');
        this.testConnectionBtn = document.getElementById('testConnectionBtn');
        this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
        this.connectionStatus = document.getElementById('connectionStatus');
    }

    bindEvents() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Settings events
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });
        
        this.toggleApiKeyBtn.addEventListener('click', () => this.toggleApiKeyVisibility());
        this.testConnectionBtn.addEventListener('click', () => this.testConnection());
        this.saveSettingsBtn.addEventListener('click', () => this.saveAiSettings());
        
        // Auto-save on input change
        [this.apiEndpointInput, this.apiKeyInput, this.deploymentNameInput].forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(this.saveTimeout);
                this.saveTimeout = setTimeout(() => this.saveAiSettings(false), 1000);
            });
        });
    }

    generateTaskId() {
        return `task_${this.taskIdCounter++}`;
    }

    generateSubtaskId() {
        return `subtask_${this.subtaskIdCounter++}`;
    }

    addTask() {
        const title = this.taskInput.value.trim();
        if (!title) return;

        const task = {
            id: this.generateTaskId(),
            title: title,
            completed: false,
            subtasks: [],
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.taskInput.value = '';
        this.saveToStorage();
        this.render();
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveToStorage();
        this.render();
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            // If task is marked complete, mark all subtasks as complete
            if (task.completed) {
                task.subtasks.forEach(subtask => subtask.completed = true);
            }
            this.saveToStorage();
            this.render();
        }
    }

    updateTaskTitle(taskId, newTitle) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && newTitle.trim()) {
            task.title = newTitle.trim();
            this.saveToStorage();
        }
    }

    addSubtask(taskId, subtaskTitle) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && subtaskTitle.trim()) {
            const subtask = {
                id: this.generateSubtaskId(),
                title: subtaskTitle.trim(),
                completed: false,
                createdAt: new Date().toISOString()
            };
            task.subtasks.push(subtask);
            this.saveToStorage();
            this.render();
        }
    }

    deleteSubtask(taskId, subtaskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
            this.saveToStorage();
            this.render();
        }
    }

    toggleSubtaskComplete(taskId, subtaskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const subtask = task.subtasks.find(st => st.id === subtaskId);
            if (subtask) {
                subtask.completed = !subtask.completed;
                
                // If all subtasks are completed, mark main task as completed
                if (task.subtasks.length > 0 && task.subtasks.every(st => st.completed)) {
                    task.completed = true;
                }
                // If any subtask is not completed, mark main task as not completed
                else if (task.subtasks.some(st => !st.completed)) {
                    task.completed = false;
                }
                
                this.saveToStorage();
                this.render();
            }
        }
    }

    updateSubtaskTitle(taskId, subtaskId, newTitle) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const subtask = task.subtasks.find(st => st.id === subtaskId);
            if (subtask && newTitle.trim()) {
                subtask.title = newTitle.trim();
                this.saveToStorage();
            }
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('todoApp_tasks', JSON.stringify(this.tasks));
            localStorage.setItem('todoApp_taskIdCounter', this.taskIdCounter.toString());
            localStorage.setItem('todoApp_subtaskIdCounter', this.subtaskIdCounter.toString());
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }

    loadFromStorage() {
        try {
            const savedTasks = localStorage.getItem('todoApp_tasks');
            const savedTaskIdCounter = localStorage.getItem('todoApp_taskIdCounter');
            const savedSubtaskIdCounter = localStorage.getItem('todoApp_subtaskIdCounter');

            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            }

            if (savedTaskIdCounter) {
                this.taskIdCounter = parseInt(savedTaskIdCounter, 10);
            }

            if (savedSubtaskIdCounter) {
                this.subtaskIdCounter = parseInt(savedSubtaskIdCounter, 10);
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            this.tasks = [];
        }
    }

    // AI Settings Management
    saveAiSettings(showNotification = true) {
        this.aiSettings = {
            endpoint: this.apiEndpointInput.value.trim(),
            apiKey: this.apiKeyInput.value.trim(),
            deploymentName: this.deploymentNameInput.value.trim() || 'gpt-35-turbo'
        };
        
        try {
            // Use a simple encoding for basic security (not production-grade)
            const encodedSettings = btoa(JSON.stringify(this.aiSettings));
            localStorage.setItem('todoApp_aiSettings', encodedSettings);
            
            if (showNotification) {
                this.showConnectionStatus('Settings saved successfully!', 'success');
            }
        } catch (e) {
            console.error('Failed to save AI settings:', e);
            if (showNotification) {
                this.showConnectionStatus('Failed to save settings', 'error');
            }
        }
    }

    loadAiSettings() {
        try {
            const encodedSettings = localStorage.getItem('todoApp_aiSettings');
            if (encodedSettings) {
                this.aiSettings = JSON.parse(atob(encodedSettings));
                this.apiEndpointInput.value = this.aiSettings.endpoint || '';
                this.apiKeyInput.value = this.aiSettings.apiKey || '';
                this.deploymentNameInput.value = this.aiSettings.deploymentName || 'gpt-35-turbo';
            }
        } catch (e) {
            console.error('Failed to load AI settings:', e);
        }
    }

    openSettings() {
        this.settingsModal.classList.add('show');
    }

    closeSettings() {
        this.settingsModal.classList.remove('show');
    }

    toggleApiKeyVisibility() {
        const isPassword = this.apiKeyInput.type === 'password';
        this.apiKeyInput.type = isPassword ? 'text' : 'password';
        this.toggleApiKeyBtn.textContent = isPassword ? '🙈' : '👁️';
    }

    showConnectionStatus(message, type) {
        this.connectionStatus.textContent = message;
        this.connectionStatus.className = `connection-status ${type}`;
        
        if (type === 'success') {
            setTimeout(() => {
                this.connectionStatus.textContent = '';
                this.connectionStatus.className = 'connection-status';
            }, 3000);
        }
    }

    async testConnection() {
        if (!this.aiSettings.endpoint || !this.aiSettings.apiKey) {
            this.showConnectionStatus('Please enter both endpoint and API key', 'error');
            return;
        }

        this.testConnectionBtn.disabled = true;
        this.showConnectionStatus('Testing connection...', 'testing');

        try {
            const response = await this.makeAzureAIRequest('Test connection', true);
            if (response) {
                this.showConnectionStatus('Connection successful!', 'success');
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            this.showConnectionStatus(`Connection failed: ${error.message}`, 'error');
        } finally {
            this.testConnectionBtn.disabled = false;
        }
    }

    async makeAzureAIRequest(taskText, isTest = false) {
        const endpoint = this.aiSettings.endpoint.replace(/\/$/, '');
        const url = `${endpoint}/openai/deployments/${this.aiSettings.deploymentName}/chat/completions?api-version=2024-02-15-preview`;
        
        const prompt = isTest ? 
            "Respond with 'Connection successful' if you can read this message." :
            `Break down the following main task into smaller, actionable subtasks. Return ONLY a JSON array of strings, with no additional text or formatting. Each subtask should be clear and specific. Limit to maximum 10 subtasks.

Main task: "${taskText}"

Example response format: ["Subtask 1", "Subtask 2", "Subtask 3"]`;

        const requestBody = {
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that breaks down tasks into actionable subtasks."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: isTest ? 50 : 500,
            temperature: 0.7
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.aiSettings.apiKey
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        
        if (!content) {
            throw new Error('No response content received');
        }

        if (isTest) {
            return content;
        }

        // Try to parse as JSON array
        try {
            const subtasks = JSON.parse(content);
            if (Array.isArray(subtasks)) {
                return subtasks.slice(0, 10); // Limit to 10 subtasks
            } else {
                throw new Error('Response is not an array');
            }
        } catch (parseError) {
            // If JSON parsing fails, try to extract subtasks from text
            const lines = content.split('\n').filter(line => line.trim());
            const subtasks = lines
                .map(line => line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim())
                .filter(line => line.length > 0)
                .slice(0, 10);
            
            if (subtasks.length === 0) {
                throw new Error('Could not extract subtasks from response');
            }
            
            return subtasks;
        }
    }

    async planForMe(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const planButton = document.querySelector(`[data-task-id="${taskId}"] .plan-for-me-btn`);
        if (!planButton) return;

        // Show loading state
        planButton.disabled = true;
        planButton.classList.add('loading');
        const originalText = planButton.innerHTML;
        planButton.innerHTML = '<span class="magic-wand">🪄</span> Planning...';

        try {
            // Call our Azure Function
            const response = await fetch('https://todo-ai-functions.azurewebsites.net/api/plantask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    taskTitle: task.title
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate plan');
            }

            const data = await response.json();
            const subtasks = data.subtasks;
            
            // Add subtasks to the task
            subtasks.forEach(subtaskTitle => {
                if (subtaskTitle.trim()) {
                    const subtask = {
                        id: this.generateSubtaskId(),
                        title: subtaskTitle.trim(),
                        completed: false,
                        createdAt: new Date().toISOString(),
                        aiGenerated: true
                    };
                    task.subtasks.push(subtask);
                }
            });

            this.saveToStorage();
            this.render();
            
            // Show success feedback
            planButton.innerHTML = '<span class="magic-wand">✨</span> Done!';
            setTimeout(() => {
                planButton.innerHTML = originalText;
                planButton.disabled = false;
                planButton.classList.remove('loading');
            }, 2000);
            
        } catch (error) {
            console.error('AI planning failed:', error);
            alert(`Failed to generate plan: ${error.message}`);
            
            // Reset button
            planButton.innerHTML = originalText;
            planButton.disabled = false;
            planButton.classList.remove('loading');
        }
    }

    showAddSubtaskInput(taskId) {
        const addSubtaskSection = document.querySelector(`[data-task-id="${taskId}"] .add-subtask-section`);
        if (addSubtaskSection) {
            addSubtaskSection.style.display = 'flex';
            const input = addSubtaskSection.querySelector('.subtask-input');
            input.focus();
        }
    }

    hideAddSubtaskInput(taskId) {
        const addSubtaskSection = document.querySelector(`[data-task-id="${taskId}"] .add-subtask-section`);
        if (addSubtaskSection) {
            addSubtaskSection.style.display = 'none';
            const input = addSubtaskSection.querySelector('.subtask-input');
            input.value = '';
        }
    }

    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item new-task';
        taskElement.setAttribute('data-task-id', task.id);

        const subtasksHtml = task.subtasks.map(subtask => `
            <div class="subtask-item" data-subtask-id="${subtask.id}">
                <input type="checkbox" class="subtask-checkbox" ${subtask.completed ? 'checked' : ''}>
                <input type="text" class="subtask-title ${subtask.completed ? 'completed' : ''}" 
                       value="${this.escapeHtml(subtask.title)}" placeholder="Subtask title">
                <button class="delete-subtask-btn" title="Delete subtask">×</button>
            </div>
        `).join('');

        taskElement.innerHTML = `
            <div class="task-header">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <input type="text" class="task-title ${task.completed ? 'completed' : ''}" 
                       value="${this.escapeHtml(task.title)}" placeholder="Task title">
                <div class="task-actions">
                    <button class="plan-for-me-btn" title="Plan for me using AI">
                        <span class="magic-wand">🪄</span> PlanForMe
                    </button>
                    <button class="add-subtask-btn" title="Add subtask">+ Subtask</button>
                    <button class="delete-btn" title="Delete task">×</button>
                </div>
            </div>
            ${task.subtasks.length > 0 ? `
                <div class="subtasks-container">
                    ${subtasksHtml}
                </div>
            ` : ''}
            <div class="add-subtask-section" style="display: none;">
                <input type="text" class="subtask-input" placeholder="Enter subtask title..." maxlength="100">
                <button class="add-subtask-confirm-btn">Add</button>
                <button class="cancel-subtask-btn">Cancel</button>
            </div>
        `;

        this.bindTaskEvents(taskElement, task);
        return taskElement;
    }

    bindTaskEvents(taskElement, task) {
        const taskCheckbox = taskElement.querySelector('.task-checkbox');
        const taskTitle = taskElement.querySelector('.task-title');
        const deleteBtn = taskElement.querySelector('.delete-btn');
        const addSubtaskBtn = taskElement.querySelector('.add-subtask-btn');
        const planForMeBtn = taskElement.querySelector('.plan-for-me-btn');
        const subtaskInput = taskElement.querySelector('.subtask-input');
        const addSubtaskConfirmBtn = taskElement.querySelector('.add-subtask-confirm-btn');
        const cancelSubtaskBtn = taskElement.querySelector('.cancel-subtask-btn');

        // Task events
        taskCheckbox.addEventListener('change', () => {
            this.toggleTaskComplete(task.id);
        });

        taskTitle.addEventListener('blur', () => {
            this.updateTaskTitle(task.id, taskTitle.value);
        });

        taskTitle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                taskTitle.blur();
            }
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task and all its subtasks?')) {
                this.deleteTask(task.id);
            }
        });

        addSubtaskBtn.addEventListener('click', () => {
            this.showAddSubtaskInput(task.id);
        });

        // AI Plan for Me button
        planForMeBtn.addEventListener('click', () => {
            this.planForMe(task.id);
        });

        // Subtask input events
        const addSubtask = () => {
            const subtaskTitle = subtaskInput.value.trim();
            if (subtaskTitle) {
                this.addSubtask(task.id, subtaskTitle);
                this.hideAddSubtaskInput(task.id);
            }
        };

        addSubtaskConfirmBtn.addEventListener('click', addSubtask);

        subtaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addSubtask();
            } else if (e.key === 'Escape') {
                this.hideAddSubtaskInput(task.id);
            }
        });

        cancelSubtaskBtn.addEventListener('click', () => {
            this.hideAddSubtaskInput(task.id);
        });

        // Subtask events
        const subtaskElements = taskElement.querySelectorAll('.subtask-item');
        subtaskElements.forEach(subtaskElement => {
            const subtaskId = subtaskElement.getAttribute('data-subtask-id');
            const subtask = task.subtasks.find(st => st.id === subtaskId);
            
            if (subtask) {
                const subtaskCheckbox = subtaskElement.querySelector('.subtask-checkbox');
                const subtaskTitle = subtaskElement.querySelector('.subtask-title');
                const deleteSubtaskBtn = subtaskElement.querySelector('.delete-subtask-btn');

                subtaskCheckbox.addEventListener('change', () => {
                    this.toggleSubtaskComplete(task.id, subtaskId);
                });

                subtaskTitle.addEventListener('blur', () => {
                    this.updateSubtaskTitle(task.id, subtaskId, subtaskTitle.value);
                });

                subtaskTitle.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        subtaskTitle.blur();
                    }
                });

                deleteSubtaskBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this subtask?')) {
                        this.deleteSubtask(task.id, subtaskId);
                    }
                });
            }
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    render() {
        // Clear the container
        this.tasksContainer.innerHTML = '';

        if (this.tasks.length === 0) {
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');

        // Sort tasks: incomplete first, then by creation date
        const sortedTasks = [...this.tasks].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Render tasks
        sortedTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.tasksContainer.appendChild(taskElement);
            
            // Remove the animation class after animation completes
            setTimeout(() => {
                taskElement.classList.remove('new-task');
            }, 300);
        });
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add task from anywhere
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const taskInput = document.getElementById('taskInput');
        if (taskInput.value.trim()) {
            document.getElementById('addTaskBtn').click();
        } else {
            taskInput.focus();
        }
        e.preventDefault();
    }
});
