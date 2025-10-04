#!/usr/bin/env python3
"""
Simple test to verify LangSmith tracing during a research workflow
"""
import os
import requests
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/Users/ADML/Desktop/user_research/automated-research-app/.env')

# Test the research endpoint
print("🧪 Testing research endpoint with LangSmith tracing...")

try:
    response = requests.post(
        "http://localhost:8000/research",
        json={
            "research_question": "What are users' experiences with LangSmith integration?",
            "target_demographic": "Software developers using AI/ML tools",
            "num_interviews": 1,
            "num_questions": 2
        },
        timeout=30
    )
    
    if response.status_code == 200:
        print("✅ Research request completed successfully!")
        print(f"📊 Response: {len(response.text)} characters")
        
        print("\n🎯 Your LangSmith project should now be visible at:")
        print("   https://smith.langchain.com/projects")
        print("   Project name: automated-research-app")
        print("\n💡 If you still don't see it:")
        print("   1. Make sure you're logged into LangSmith with the same account")
        print("   2. Check that your API key is valid")
        print("   3. Wait a few minutes for traces to appear")
        print("   4. Try refreshing the projects page")
        
    else:
        print(f"❌ Research request failed: {response.status_code}")
        print(f"Response: {response.text}")
        
except requests.exceptions.RequestException as e:
    print(f"❌ Failed to connect to server: {e}")
    print("Make sure the backend server is running on http://localhost:8000")