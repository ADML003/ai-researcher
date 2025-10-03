# 🔧 LangSmith Integration Setup Guide

## Current Status

Your LangSmith integration is configured but needs your API key to function.

## Setup Steps

### 1. Get Your LangSmith API Key

1. Go to [LangSmith](https://smith.langchain.com)
2. Sign up/Login with your account
3. Navigate to **Settings** → **API Keys**
4. Create a new API key
5. Copy the key (starts with `lsv2_pt_...`)

### 2. Update Your Environment

Replace the placeholder in your `.env` file:

```bash
# Replace this line:
LANGSMITH_API_KEY=lsv2_pt_your_actual_langsmith_api_key_here

# With your real API key:
LANGSMITH_API_KEY=lsv2_pt_abc123def456...
```

### 3. Restart Your Backend

```bash
cd backend
python -m uvicorn main_intelligent:app --reload
```

## What LangSmith Provides

✅ **Real-time Tracing** - See every AI call and response  
✅ **Performance Monitoring** - Track response times and costs  
✅ **Debugging** - Detailed logs for troubleshooting  
✅ **Analytics** - Usage patterns and insights

## Verification

Once configured, you'll see:

- "LangSmith integration enabled" in your backend logs
- Research sessions appearing in your LangSmith dashboard
- Detailed traces for each research workflow

## Project Configuration

- **Project Name**: `automated-research-app`
- **Environment**: Development
- **Traces**: All AI interactions (persona generation, interviews, synthesis)

The LangSmith project is automatically created when you first run research with a valid API key.
