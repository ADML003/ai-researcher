#!/usr/bin/env python3
"""
Simple test to verify LangSmith tracing is working with a quick request
"""
import requests
import time

print("🔍 Testing LangSmith tracing with a quick research...")

try:
    response = requests.post(
        "http://localhost:8000/research",
        json={
            "research_question": "How do developers use AI tools in their daily workflow?",
            "target_demographic": "Software developers",
            "num_interviews": 1,
            "num_questions": 2
        },
        timeout=60  # Give it more time
    )
    
    if response.status_code == 200:
        print("✅ Research completed successfully!")
        print("\n🎯 Check your LangSmith dashboard now:")
        print("   https://smith.langchain.com/projects")
        print("   Project: automated-research-app")
        print("\n📊 You should see traces for:")
        print("   - research_workflow (main research process)")
        print("   - generate_questions (question generation)")
        print("   - generate_personas (persona creation)")
        print("   - generate_interview_response (interview responses)")
        print("   - generate_synthesis (final analysis)")
        print("   - cerebras_ai_call (AI model calls)")
        
    else:
        print(f"❌ Research failed: {response.status_code}")
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"❌ Request failed: {e}")