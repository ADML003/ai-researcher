#!/bin/bash

# Automated Research App Startup Script

echo "🚀 Starting Automated Research App..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create it from .env.example and add your API keys."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check required ports
if ! check_port 8000; then
    echo "⚠️ Backend port 8000 is in use. Attempting to stop existing service..."
    pkill -f "python.*main_simple.py" 2>/dev/null || true
    sleep 2
fi

if ! check_port 3000; then
    echo "⚠️ Frontend port 3000 is in use. Attempting to stop existing service..."
    pkill -f "next.*dev" 2>/dev/null || true
    sleep 2
fi

# Start backend
echo "🔧 Starting backend server..."
cd backend

# Check if FastAPI is available in system Python
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "� Installing FastAPI..."
    pip3 install fastapi uvicorn python-dotenv
fi

# Start backend in background
echo "🌐 Starting FastAPI backend on port 8000..."
python3 main_simple.py &
BACKEND_PID=$!

# Give backend time to start
sleep 3

# Check if backend started successfully
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend started successfully"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo "🎨 Starting frontend server..."
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "🌐 Starting Next.js frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📊 Backend API: http://localhost:8000"
echo "🎨 Frontend App: http://localhost:3000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for services
wait