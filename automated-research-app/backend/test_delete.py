#!/usr/bin/env python3
"""Test script to verify delete endpoint functionality"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_delete_endpoint():
    """Test the delete research session endpoint"""
    print("Testing DELETE endpoint...")
    
    # Try to delete a non-existent session (should get 401 due to auth)
    test_session_id = "test_session_123"
    
    try:
        response = requests.delete(f"{BASE_URL}/research/{test_session_id}")
        print(f"DELETE /research/{test_session_id}")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print("✅ Authentication check working - returns 401 for missing token")
        elif response.status_code == 404:
            print("✅ Session not found handling working - returns 404")
        else:
            print(f"⚠️  Unexpected status code: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing endpoint: {e}")

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health check: {response.status_code}")
        if response.status_code == 200:
            print("✅ Server is running")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Server not accessible: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Backend Delete Functionality")
    print("=" * 50)
    
    if test_health():
        test_delete_endpoint()
    else:
        print("❌ Server not running, skipping tests")
    
    print("\n" + "=" * 50)
    print("Test completed!")