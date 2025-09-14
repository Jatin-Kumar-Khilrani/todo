# GitHub Pages Deployment Guide

## 🚀 Deploy to GitHub Pages

### Step 1: Enable GitHub Pages
1. Go to your repository: `https://github.com/Jatin-Kumar-Khilrani/todo`
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

### Step 2: Access Your Live App
Your app will be available at:
**https://jatin-kumar-khilrani.github.io/todo/**

## 🎭 How Demo Mode Works

### For Public Users:
- App works immediately without configuration
- "PlanForMe" generates intelligent demo subtasks
- No API costs or security concerns
- Clear indication it's demo mode

### For You (with API key):
- Configure your Azure AI credentials in settings
- Get real AI-powered task planning
- Full functionality with your personal API key

## 📋 Production Deployment Options

### Option A: Client-Side Only (Current)
```
✅ Easy deployment to GitHub Pages
✅ No server costs
✅ Demo mode for public users
⚠️ Users need their own API keys for full features
```

### Option B: Backend Proxy Service
```
✅ Secure API key storage
✅ No user configuration needed
✅ Better user experience
💰 Requires hosting costs
🔧 More complex setup
```

### Option C: Azure Static Web Apps
```
✅ Integrated with Azure
✅ Serverless functions for API proxy
✅ Built-in CI/CD
✅ Custom domain support
💰 Azure hosting costs
```

## 🔒 Security Best Practices

### ✅ Current Setup (Secure):
- No API keys in repository
- Demo mode for public access
- Optional user configuration
- Local config file for development

### ❌ Avoid These:
- Encrypted API keys in repository
- Hardcoded credentials
- Client-side API key exposure
- Shared API quotas

## 📊 Recommended Approach

For your use case, I recommend:

1. **Deploy current version** to GitHub Pages with demo mode
2. **Users get immediate value** with demo functionality
3. **Power users can configure** their own API keys
4. **Consider backend proxy** if you want to provide full AI features

This gives you the best balance of:
- ✅ Security
- ✅ User experience  
- ✅ Zero hosting costs
- ✅ Easy maintenance
