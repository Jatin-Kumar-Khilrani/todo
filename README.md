# My To Do App

A simple, elegant to-do list application built with HTML, CSS, and JavaScript, now enhanced with AI-powered task planning.

*🚀 Deployment Status: API token updated - triggering new deployment*

## Features

✅ **Add Main Tasks** - Create primary tasks with a simple text input  
✅ **Subtasks** - Add smaller, related tasks underneath main tasks  
✅ **Edit Task Titles** - Click on any task or subtask title to edit it inline  
✅ **Mark Complete** - Check boxes to mark tasks and subtasks as completed  
✅ **Delete Tasks** - Remove unwanted tasks and subtasks with the × button  
✅ **Auto-Save** - All changes are automatically saved to browser storage  
✅ **Persistent Data** - Your tasks remain even after closing the browser or restarting  
✅ **Responsive Design** - Works great on desktop and mobile devices  
🆕 **AI-Powered Planning** - Use Azure AI to automatically generate subtasks  
🆕 **Settings Panel** - Configure your Azure AI credentials securely  

## 🪄 AI-Powered "Plan for Me" Feature

The app now includes an intelligent planning feature that uses Azure AI to break down your main tasks into actionable subtasks.

### How It Works:
1. **Add a main task** (e.g., "Plan a birthday party")
2. **Click the purple "PlanForMe" button** with the magic wand icon (🪄)
3. **Get intelligent subtasks**:
   - **Demo Mode**: Smart pattern-based subtasks (no configuration needed)
   - **AI Mode**: Real Azure AI-generated subtasks (requires API setup)
4. **Subtasks are added automatically** and can be edited, completed, or deleted like any other subtask

### Setting Up AI Integration:
1. **Click the settings gear (⚙️)** in the top right corner
2. **Enter your Azure AI credentials**:
   - **API Endpoint**: Your Azure OpenAI endpoint (e.g., `https://your-endpoint.openai.azure.com/`)
   - **API Key**: Your Azure OpenAI API key
   - **Deployment Name**: Your model deployment name (default: `gpt-35-turbo`)
3. **Test your connection** using the "Test Connection" button
4. **Save your settings** - they're stored securely in your browser

### AI Features:
- **Smart Task Breakdown**: Analyzes your main task and creates logical, actionable subtasks
- **Contextual Understanding**: Generates relevant subtasks based on the task description
- **Limit Protection**: Maximum of 10 subtasks to keep lists manageable
- **Error Handling**: Graceful handling of API errors with user feedback
- **Secure Storage**: API credentials are encoded and stored locally  

## How to Use

1. **Adding Tasks**: 
   - Type your task in the input field at the top
   - Press Enter or click "Add Task"

2. **Adding Subtasks**:
   - Click the "+ Subtask" button on any main task
   - Enter your subtask title and press Enter or click "Add"

3. **🪄 Using AI Planning**:
   - Click the purple "PlanForMe" button on any main task
   - The AI will automatically generate relevant subtasks
   - Generated subtasks can be edited, completed, or deleted normally

4. **Editing Tasks**:
   - Click on any task or subtask title to edit it inline
   - Press Enter to save your changes

5. **Completing Tasks**:
   - Check the checkbox next to any task to mark it complete
   - Completed tasks will show with strikethrough text
   - Completing all subtasks automatically completes the main task

6. **Deleting Tasks**:
   - Click the × button to delete any task or subtask
   - A confirmation dialog will appear for main tasks

7. **Settings Configuration**:
   - Click the gear icon (⚙️) in the top right
   - Enter your Azure AI credentials
   - Test the connection before saving

## Keyboard Shortcuts

- **Enter** - Add a new task when typing in the main input
- **Ctrl/Cmd + Enter** - Quick add task from anywhere on the page
- **Enter** - Save changes when editing task titles
- **Escape** - Cancel adding a subtask

## Technical Features

- **Local Storage** - All data is saved in your browser's local storage
- **Responsive Design** - Adapts to different screen sizes
- **Smooth Animations** - Tasks slide in with elegant animations
- **Smart Task Management** - Automatic task completion logic
- **Input Validation** - Prevents empty tasks and handles edge cases
- **AI Integration** - Azure OpenAI API integration for intelligent task planning
- **Secure Credential Storage** - API keys are encoded and stored locally
- **Error Handling** - Comprehensive error handling for AI requests
- **Real-time Feedback** - Visual feedback for AI operations and connection status

## File Structure

```
Todo-AI/
├── index.html      # Main HTML structure with settings modal
├── styles.css      # CSS styling, responsive design, and AI button styling
├── script.js       # JavaScript functionality with AI integration
└── README.md       # This file
```

## Getting Started

1. Open `index.html` in your web browser
2. Start adding your tasks!
3. **Optional**: Configure Azure AI for intelligent task planning
4. Your data will automatically save and persist between sessions

## Azure AI Setup Requirements

To use the AI "Plan for Me" feature, you'll need:

1. **Azure OpenAI Service** - An active Azure subscription with OpenAI service
2. **API Endpoint** - Your Azure OpenAI endpoint URL
3. **API Key** - Your Azure OpenAI API key
4. **Model Deployment** - A deployed chat completion model (GPT-3.5-turbo or GPT-4)

### Supported Models:
- GPT-3.5-turbo (recommended)
- GPT-4
- GPT-4-turbo
- Any Azure OpenAI chat completion model

## Browser Compatibility

This app works in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Data Storage

All your tasks are stored locally in your browser using localStorage. This means:
- ✅ Your data persists between sessions
- ✅ No internet connection required
- ✅ Your privacy is protected (data never leaves your device)
- ⚠️ Clearing browser data will remove your tasks
