#!/usr/bin/env python3
"""
Test script to verify LangSmith connection and project creation
"""
import os
import sys
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append('/Users/ADML/Desktop/user_research/automated-research-app/backend')

# Load environment variables
load_dotenv('/Users/ADML/Desktop/user_research/automated-research-app/.env')
load_dotenv('/Users/ADML/Desktop/user_research/automated-research-app/backend/.env')

print("=== LangSmith Configuration Test ===")
print(f"LANGCHAIN_TRACING_V2: {os.getenv('LANGCHAIN_TRACING_V2')}")
print(f"LANGCHAIN_PROJECT: {os.getenv('LANGCHAIN_PROJECT')}")
print(f"LANGCHAIN_ENDPOINT: {os.getenv('LANGCHAIN_ENDPOINT')}")

langsmith_key = os.getenv("LANGSMITH_API_KEY") or os.getenv("LANGCHAIN_API_KEY")
if langsmith_key:
    print(f"API Key found: {langsmith_key[:20]}...")
else:
    print("❌ No API key found!")
    sys.exit(1)

# Set required environment variables
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "automated-research-app"
os.environ["LANGCHAIN_API_KEY"] = langsmith_key
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"

try:
    from langsmith import Client
    print("\n=== Testing LangSmith Client ===")
    
    client = Client()
    print("✅ LangSmith client created successfully")
    
    # Test basic connection
    try:
        # This will create the project if it doesn't exist
        print(f"📡 Testing connection to project: {os.environ['LANGCHAIN_PROJECT']}")
        
        # Create a simple run to ensure project appears
        from langchain_core.tracers import LangChainTracer
        tracer = LangChainTracer(project_name="automated-research-app")
        print("✅ LangChain tracer created successfully")
        
        print("\n=== Creating test trace ===")
        # Import and use langchain to create a trace
        from langchain_core.messages import HumanMessage
        from langchain_core.runnables import RunnableLambda
        
        def test_function(input_data):
            return f"Test response for: {input_data}"
        
        runnable = RunnableLambda(test_function)
        result = runnable.invoke("Hello from LangSmith test!")
        
        print(f"✅ Test trace created: {result}")
        print(f"\n🎉 Success! Your project should now appear in LangSmith at:")
        print(f"   https://smith.langchain.com/projects")
        print(f"   Project name: automated-research-app")
        
    except Exception as e:
        print(f"⚠️  Basic connection test failed: {e}")
        
except ImportError as e:
    print(f"❌ Failed to import LangSmith: {e}")
    print("Please install langsmith: pip install langsmith")
except Exception as e:
    print(f"❌ LangSmith client creation failed: {e}")
    print("Check your API key and network connection")