# 🚀 Quick Start Guide

## Starting the Application

You have **3 ways** to start the Automated Research App:

### Option 1: Simple Start Script (Recommended)

```bash
cd /Users/ADML/Desktop/user_research/automated-research-app
./start-simple.sh
```

### Option 2: Manual Start (Most Reliable)

```bash
# Terminal 1 - Backend
cd /Users/ADML/Desktop/user_research/automated-research-app/backend
python3 main_simple.py

# Terminal 2 - Frontend
cd /Users/ADML/Desktop/user_research/automated-research-app/frontend
npm run dev
```

### Option 3: Full Start Script

```bash
cd /Users/ADML/Desktop/user_research/automated-research-app
./start.sh
```

## Access URLs

Once running, access the application at:

- **🌐 Main App**: http://localhost:3000
- **🔧 Backend API**: http://localhost:8000
- **📚 API Documentation**: http://localhost:8000/docs
- **🏥 Health Check**: http://localhost:8000/health

## Stopping Services

To stop all services:

- Press `Ctrl+C` in the terminal running the script
- Or manually kill processes:

```bash
pkill -f "python.*main_simple.py"
pkill -f "next.*dev"
```

## Troubleshooting

### Backend Issues

```bash
# Check if backend is running
curl http://localhost:8000/health

# Install missing dependencies
pip3 install fastapi uvicorn python-dotenv
```

### Frontend Issues

```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Port Conflicts

```bash
# Check what's using the ports
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Kill processes on ports
kill -9 $(lsof -ti:8000)
kill -9 $(lsof -ti:3000)
```

## Status Check

Run this to check the current status:

```bash
cd /Users/ADML/Desktop/user_research/automated-research-app
./status.sh
```

## Current Features

✅ **Working Features:**

- Backend API with mock research data
- Beautiful Apple-inspired frontend
- Dark/light mode toggle
- Research workflow simulation
- API documentation

⚠️ **In Progress:**

- Full AI integration with Cerebras/LangChain
- Real persona generation
- Live interview simulation

The app is fully functional for testing and demonstration!
