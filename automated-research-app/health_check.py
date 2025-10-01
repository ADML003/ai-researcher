#!/usr/bin/env python3
"""
Health check script for the Automated Research App
"""

import requests
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def check_backend():
    """Check if backend is running and configured correctly"""
    try:
        # Test basic health endpoint
        response = requests.get(f"{BACKEND_URL}/health", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend is running")
            print(f"   - API Status: {data.get('status', 'unknown')}")
            print(f"   - Cerebras API: {'✅ Configured' if data.get('cerebras_api_configured') else '❌ Missing'}")
            print(f"   - LangSmith API: {'✅ Configured' if data.get('langsmith_configured') else '❌ Missing'}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running or unreachable")
        return False
    except Exception as e:
        print(f"❌ Backend health check error: {e}")
        return False

def check_frontend():
    """Check if frontend is running"""
    try:
        response = requests.get(FRONTEND_URL, timeout=10)
        
        if response.status_code == 200:
            print("✅ Frontend is running")
            return True
        else:
            print(f"❌ Frontend returned status: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Frontend is not running or unreachable")
        return False
    except Exception as e:
        print(f"❌ Frontend health check error: {e}")
        return False

def check_environment():
    """Check environment configuration"""
    print("🔧 Checking environment configuration...")
    
    required_vars = [
        "CEREBRAS_API_KEY",
        "LANGSMITH_TRACING",
        "LANGCHAIN_PROJECT"
    ]
    
    all_configured = True
    for var in required_vars:
        value = os.getenv(var)
        if value:
            # Don't print actual API keys, just show they exist
            masked_value = f"{value[:8]}..." if len(value) > 8 else "***"
            print(f"   ✅ {var}: {masked_value}")
        else:
            print(f"   ❌ {var}: Not set")
            all_configured = False
    
    return all_configured

def main():
    """Run all health checks"""
    print("🏥 Automated Research App - Health Check")
    print("=" * 50)
    
    env_ok = check_environment()
    print()
    
    backend_ok = check_backend()
    print()
    
    frontend_ok = check_frontend()
    print()
    
    print("=" * 50)
    if env_ok and backend_ok and frontend_ok:
        print("✅ All systems operational!")
        print(f"🌐 App URL: {FRONTEND_URL}")
        print(f"📚 API Docs: {BACKEND_URL}/docs")
        sys.exit(0)
    else:
        print("❌ Some issues found:")
        if not env_ok:
            print("   - Check your .env file configuration")
        if not backend_ok:
            print("   - Backend service needs attention")
        if not frontend_ok:
            print("   - Frontend service needs attention")
        sys.exit(1)

if __name__ == "__main__":
    main()