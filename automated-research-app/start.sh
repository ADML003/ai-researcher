#!/bin/bash

# Unified Startup Script for Automated Research App
# Supports: Intelligent Backend, Dashboard, LangSmith Integration

echo "🚀 Automated Research App - Intelligent Research System"
echo "====================================================="

# Navigate to app directory
cd "$(dirname "$0")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to cleanup on exit
cleanup() {
    print_status $YELLOW "🛑 Shutting down services..."
    # Kill backend
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    # Kill frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    # Kill by port as backup
    pkill -f "python.*main_intelligent.py" 2>/dev/null || true
    pkill -f "npm.*dev" 2>/dev/null || true
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Stop any existing services
print_status $YELLOW "🛑 Stopping existing services..."
pkill -f "python.*main_intelligent.py" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Check environment
print_status $BLUE "🔍 Checking environment..."

if [ ! -f ".env" ]; then
    print_status $YELLOW "⚠️  .env file not found. Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status $YELLOW "📝 Please edit .env file and add your API keys"
    else
        print_status $RED "❌ No .env.example found!"
        exit 1
    fi
fi

if ! command -v python3 &> /dev/null; then
    print_status $RED "❌ Python3 is required but not installed"
    exit 1
fi

if ! command -v node &> /dev/null; then
    print_status $RED "❌ Node.js is required but not installed"
    exit 1
fi

print_status $GREEN "✅ Environment check passed"

# Setup backend
print_status $BLUE "🔧 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    print_status $YELLOW "📦 Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

if [ -f "requirements.txt" ]; then
    print_status $YELLOW "📦 Installing Python dependencies..."
    pip install -r requirements.txt --quiet
fi

print_status $GREEN "✅ Backend setup complete"

# Start backend
print_status $BLUE "🧠 Starting intelligent backend..."
if [ ! -f "main_intelligent.py" ]; then
    print_status $RED "❌ main_intelligent.py not found!"
    exit 1
fi

python main_intelligent.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
print_status $YELLOW "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
for i in {1..10}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        print_status $GREEN "✅ Backend started successfully on http://localhost:8000"
        break
    fi
    if [ $i -eq 10 ]; then
        print_status $RED "❌ Backend failed to start after 10 attempts"
        cleanup
        exit 1
    fi
    sleep 2
done

# Setup frontend
print_status $BLUE "🎨 Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    print_status $YELLOW "📦 Installing Node.js dependencies..."
    npm install --silent
fi

print_status $GREEN "✅ Frontend setup complete"

# Start frontend
print_status $BLUE "🎨 Starting frontend..."
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
print_status $YELLOW "⏳ Waiting for frontend to start..."
sleep 8

# Check if frontend is running
FRONTEND_URL=""
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_status $GREEN "✅ Frontend started successfully on http://localhost:3000"
    FRONTEND_URL="http://localhost:3000"
elif curl -s http://localhost:3001 > /dev/null 2>&1; then
    print_status $YELLOW "⚠️  Frontend started on port 3001 (port 3000 was in use)"
    FRONTEND_URL="http://localhost:3001"
else
    print_status $RED "❌ Frontend failed to start"
    cleanup
    exit 1
fi

# Final status
print_status $GREEN "🎉 Automated Research App is running!"
echo ""
print_status $BLUE "📍 Available Services:"
print_status $GREEN "   🎨 Main App: $FRONTEND_URL"
print_status $GREEN "   📊 Dashboard: $FRONTEND_URL/dashboard"
print_status $GREEN "   🧠 API: http://localhost:8000"
print_status $GREEN "   📋 API Docs: http://localhost:8000/docs"
print_status $GREEN "   💚 Health: http://localhost:8000/health"

echo ""
print_status $BLUE "✨ Features Available:"
print_status $GREEN "   🧠 AI-Powered Research with Intelligent Personas"
print_status $GREEN "   📊 Comprehensive Dashboard with Research History"
print_status $GREEN "   💾 Local Database Storage (SQLite)"
print_status $GREEN "   🔍 LangSmith Integration (if configured)"
print_status $GREEN "   🎯 Professional Research Analysis"

echo ""
print_status $YELLOW "📝 Quick Start:"
print_status $YELLOW "   1. Open $FRONTEND_URL and create a research question"
print_status $YELLOW "   2. View results and analysis"
print_status $YELLOW "   3. Check the dashboard for research history"

echo ""
print_status $BLUE "� To stop: Press Ctrl+C"

# Keep script running and monitor services
while true; do
    sleep 10
    # Quick health check
    if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
        print_status $RED "❌ Backend stopped unexpectedly"
        break
    fi
done

cleanup