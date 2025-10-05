from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os

# Create FastAPI app
app = FastAPI()

@app.get("/")
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "research-api", "message": "API is working!"}

@app.get("/test")
async def test_endpoint():
    """Test endpoint to verify API is working"""
    return {
        "message": "API is working correctly!",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "timestamp": "2025-10-05"
    }

# Vercel expects this for serverless functions
def handler(request):
    return app(request)