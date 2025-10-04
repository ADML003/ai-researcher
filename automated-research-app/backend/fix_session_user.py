#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db_connection

def update_session_user():
    """Update the existing session to match a specific user ID for testing"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # First, let's see all sessions and their users
            print("Current sessions in database:")
            print("=" * 80)
            cursor.execute("""
                SELECT session_id, user_id, research_question, created_at 
                FROM research_sessions 
                ORDER BY created_at DESC
            """)
            
            sessions = cursor.fetchall()
            for session in sessions:
                print(f"Session: {session['session_id']}")
                print(f"User: {session['user_id']}")
                print(f"Question: {session['research_question'][:60]}...")
                print(f"Created: {session['created_at']}")
                print("-" * 40)
            
            if sessions:
                print(f"\nFound {len(sessions)} session(s)")
                
                # Ask user for their current user_id
                print("\nTo fix the access issue, I need to update the session owner.")
                print("What is your current user_id when you log in?")
                print("(You can find this by logging in and checking browser dev tools)")
                current_user_id = input("Enter your current user_id: ").strip()
                
                if current_user_id:
                    # Update the session
                    cursor.execute("""
                        UPDATE research_sessions 
                        SET user_id = %s 
                        WHERE session_id = %s
                    """, (current_user_id, sessions[0]['session_id']))
                    
                    # Update personas
                    cursor.execute("""
                        UPDATE personas p
                        SET user_id = %s
                        FROM research_sessions rs 
                        WHERE p.session_id = rs.session_id 
                        AND rs.session_id = %s
                    """, (current_user_id, sessions[0]['session_id']))
                    
                    # Update interviews  
                    cursor.execute("""
                        UPDATE interviews i
                        SET user_id = %s
                        FROM research_sessions rs
                        WHERE i.session_id = rs.session_id
                        AND rs.session_id = %s
                    """, (current_user_id, sessions[0]['session_id']))
                    
                    conn.commit()
                    
                    print(f"✅ Updated session {sessions[0]['session_id']} to user {current_user_id}")
                    print("Now try clicking on the research session from the dashboard!")
                else:
                    print("❌ No user_id provided")
            else:
                print("No sessions found in database")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_session_user()