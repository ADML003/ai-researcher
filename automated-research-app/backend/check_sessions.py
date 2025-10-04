#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db_connection

def check_sessions():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            print("Recent research sessions:")
            print("=" * 80)
            
            cursor.execute("""
                SELECT session_id, user_id, research_question, created_at 
                FROM research_sessions 
                ORDER BY created_at DESC 
                LIMIT 5
            """)
            
            rows = cursor.fetchall()
            for row in rows:
                print(f"Session: {row['session_id']}")
                print(f"User ID: {row['user_id']}")
                print(f"Question: {row['research_question'][:60]}...")
                print(f"Created: {row['created_at']}")
                print("-" * 40)
                
            # Check the specific session
            print("\nChecking specific session:")
            cursor.execute("""
                SELECT session_id, user_id, research_question 
                FROM research_sessions 
                WHERE session_id = %s
            """, ("research_20251004_182922_4858",))
            
            row = cursor.fetchone()
            if row:
                print(f"Found session: {row['session_id']}")
                print(f"User ID: {row['user_id']}")
                print(f"Question: {row['research_question']}")
            else:
                print("Session not found!")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_sessions()