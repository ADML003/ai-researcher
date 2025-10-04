#!/usr/bin/env python3
"""
Test script to verify research session access
"""
from database import get_db_connection

def test_session_access():
    """Test if we can access the research sessions"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Get all sessions
            cursor.execute("""
                SELECT session_id, user_id, research_question, status, created_at 
                FROM research_sessions 
                ORDER BY created_at DESC
            """)
            
            sessions = cursor.fetchall()
            print(f"Found {len(sessions)} total sessions:")
            for session in sessions:
                print(f"  Session: {session['session_id']}")
                print(f"  User ID: {session['user_id']}")
                print(f"  Question: {session['research_question'][:50]}...")
                print(f"  Status: {session['status']}")
                print(f"  Created: {session['created_at']}")
                print("  ---")
            
            # Check if we have personas for the latest session
            if sessions:
                latest_session = sessions[0]['session_id']
                print(f"\nChecking personas for session: {latest_session}")
                
                cursor.execute("SELECT COUNT(*) as count FROM personas WHERE session_id = %s", (latest_session,))
                persona_count = cursor.fetchone()['count']
                print(f"  Personas: {persona_count}")
                
                cursor.execute("SELECT COUNT(*) as count FROM interviews WHERE session_id = %s", (latest_session,))
                interview_count = cursor.fetchone()['count']
                print(f"  Interviews: {interview_count}")
                
                # Check synthesis
                cursor.execute("SELECT LENGTH(synthesis) as length FROM research_sessions WHERE session_id = %s", (latest_session,))
                synthesis_info = cursor.fetchone()
                synthesis_length = synthesis_info['length'] if synthesis_info and synthesis_info['length'] else 0
                print(f"  Synthesis length: {synthesis_length} characters")
                
                return latest_session, sessions[0]['user_id']
                
    except Exception as e:
        print(f"Error: {e}")
        return None, None

if __name__ == "__main__":
    session_id, user_id = test_session_access()
    if session_id:
        print(f"\n✅ Test successful! Latest session {session_id} belongs to user {user_id}")
    else:
        print("\n❌ Test failed!")