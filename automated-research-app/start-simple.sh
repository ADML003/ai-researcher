#!/bin/bash

# Simple Startup Script for Automated Research App
echo "🚀 Automated Research App - Quick Start"
echo "======================================"

# Navigate to app directory
cd "$(dirname "$0")"

# Function to check if a service is running
check_service() {
    local port=$1
    local name=$2
    if curl -s http://localhost:$port > /dev/null 2>&1; then
        echo "✅ $name is already running on port $port"
        return 0
    else
        echo "❌ $name is not running on port $port"
        return 1
    fi
}

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend..."
    cd backend
    if [ ! -f "main_simple.py" ]; then
        echo "❌ Backend file not found!"
        return 1
    fi
    
    # Check if FastAPI is available
    if ! python3 -c "import fastapi" 2>/dev/null; then
        echo "📦 Installing FastAPI..."
        pip3 install --quiet fastapi uvicorn python-dotenv
    fi
    
    echo "🌐 Starting backend server on http://localhost:8000"
    python3 main_simple.py &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 3
    if check_service 8000 "Backend"; then
        return 0
    else
        echo "❌ Failed to start backend"
        kill $BACKEND_PID 2>/dev/null
        return 1
    fi
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend..."
    cd frontend
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install --silent
    fi
    
    echo "🌐 Starting frontend server on http://localhost:3000"
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for frontend to start
    sleep 5
    if check_service 3000 "Frontend"; then
        return 0
    else
        echo "❌ Failed to start frontend"
        kill $FRONTEND_PID 2>/dev/null
        return 1
    fi
}

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    # Also kill any remaining processes
    pkill -f "python.*main_simple.py" 2>/dev/null
    pkill -f "next.*dev" 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Check current status
echo "🔍 Checking current status..."
BACKEND_RUNNING=false
FRONTEND_RUNNING=false

if check_service 8000 "Backend"; then
    BACKEND_RUNNING=true
fi

if check_service 3000 "Frontend"; then
    FRONTEND_RUNNING=true
fi

# Start services if not running
if [ "$BACKEND_RUNNING" = false ]; then
    if ! start_backend; then
        echo "❌ Failed to start backend. Exiting."
        exit 1
    fi
fi

if [ "$FRONTEND_RUNNING" = false ]; then
    if ! start_frontend; then
        echo "❌ Failed to start frontend. Exiting."
        exit 1
    fi
fi

echo ""
echo "✅ All services are running!"
echo ""
echo "📋 Access URLs:"
echo "   🌐 Main App:        http://localhost:3000"
echo "   🔧 Backend API:     http://localhost:8000"
echo "   📚 API Docs:        http://localhost:8000/docs"
echo "   🏥 Health Check:    http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running
while true; do
    sleep 1
done