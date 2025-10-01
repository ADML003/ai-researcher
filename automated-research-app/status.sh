#!/bin/bash

echo "📊 Current Status of Automated Research App"
echo "=============================================="

# Check if backend is running
echo "🔧 Backend Status:"
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 8000"
    BACKEND_DATA=$(curl -s http://localhost:8000/health)
    echo "   📊 Backend response: $BACKEND_DATA"
else
    echo "   ❌ Backend is not running"
    echo "   🔄 Attempting to start backend..."
    cd /Users/ADML/Desktop/user_research/automated-research-app/backend
    python3 main_simple.py &
    BACKEND_PID=$!
    echo "   🚀 Backend started with PID: $BACKEND_PID"
    sleep 3
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "   ✅ Backend is now running"
    else
        echo "   ❌ Backend failed to start"
    fi
fi

echo ""

# Check if frontend is running  
echo "🎨 Frontend Status:"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 3000"
else
    echo "   ❌ Frontend is not running"
    echo "   📦 Checking if node_modules exists..."
    if [ -d "/Users/ADML/Desktop/user_research/automated-research-app/frontend/node_modules" ]; then
        echo "   ✅ Dependencies are installed"
    else
        echo "   ❌ Dependencies not installed"
        echo "   🔄 Installing dependencies..."
        cd /Users/ADML/Desktop/user_research/automated-research-app/frontend
        npm install --silent --no-audit
    fi
fi

echo ""
echo "🔍 Environment Check:"

# Check for required environment variables
if [ -f "/Users/ADML/Desktop/user_research/automated-research-app/.env" ]; then
    echo "   ✅ .env file exists"
    if grep -q "CEREBRAS_API_KEY" /Users/ADML/Desktop/user_research/automated-research-app/.env; then
        echo "   ✅ Cerebras API key configured"
    else
        echo "   ❌ Cerebras API key missing"
    fi
else
    echo "   ❌ .env file missing"
fi

echo ""
echo "📋 Quick Access URLs:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔧 Backend API: http://localhost:8000"
echo "   📚 API Docs: http://localhost:8000/docs"
echo ""

echo "💡 To start services manually:"
echo "   Backend: cd backend && python3 main_simple.py"
echo "   Frontend: cd frontend && npm run dev"