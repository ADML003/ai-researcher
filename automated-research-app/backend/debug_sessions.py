#!/usr/bin/env python3
"""
Simple script to check your current user ID and update sessions accordingly
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db_connection

def show_current_state():
    """Show current sessions and their user IDs"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            print("🔍 Current Research Sessions in Database:")
            print("=" * 80)
            
            cursor.execute("""
                SELECT session_id, user_id, research_question, created_at, status 
                FROM research_sessions 
                ORDER BY created_at DESC
            """)
            
            sessions = cursor.fetchall()
            if sessions:
                for i, session in enumerate(sessions, 1):
                    print(f"{i}. Session: {session['session_id']}")
                    print(f"   User ID: {session['user_id']}")
                    print(f"   Question: {session['research_question'][:60]}...")
                    print(f"   Created: {session['created_at']}")
                    print(f"   Status: {session['status']}")
                    print("-" * 40)
                
                print(f"\n📊 Total sessions found: {len(sessions)}")
                
                # Show unique user IDs
                user_ids = set(s['user_id'] for s in sessions)
                print(f"🔑 Unique User IDs in database: {len(user_ids)}")
                for uid in user_ids:
                    count = sum(1 for s in sessions if s['user_id'] == uid)
                    print(f"   - {uid} ({count} sessions)")
                
                return sessions
            else:
                print("❌ No sessions found in database")
                return []
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

def update_all_sessions_to_user(target_user_id):
    """Update all sessions to belong to a specific user"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Update research_sessions
            cursor.execute("UPDATE research_sessions SET user_id = %s", (target_user_id,))
            sessions_updated = cursor.rowcount
            
            # Update personas (if they have user_id column)
            try:
                cursor.execute("UPDATE personas SET user_id = %s", (target_user_id,))
                personas_updated = cursor.rowcount
            except:
                personas_updated = 0
                
            # Update interviews (if they have user_id column)
            try:
                cursor.execute("UPDATE interviews SET user_id = %s", (target_user_id,))
                interviews_updated = cursor.rowcount
            except:
                interviews_updated = 0
            
            conn.commit()
            
            print(f"✅ Updated {sessions_updated} research sessions")
            print(f"✅ Updated {personas_updated} personas")
            print(f"✅ Updated {interviews_updated} interviews")
            print(f"🎉 All data now belongs to user: {target_user_id}")
            
    except Exception as e:
        print(f"❌ Error updating sessions: {e}")

if __name__ == "__main__":
    print("🧪 Research Session Debug Tool")
    print("=" * 50)
    
    sessions = show_current_state()
    
    if sessions:
        print("\n" + "=" * 50)
        print("🛠️  Fix Options:")
        print("1. Update all sessions to a specific user ID")
        print("2. Just show me what user ID I need to use")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == "1":
            print("\n📝 To fix the 403 Forbidden errors, I need your current user ID.")
            print("You can get this by:")
            print("1. Opening browser dev tools (F12)")
            print("2. Going to Network tab")
            print("3. Making a request to dashboard")
            print("4. Looking at the Authorization header")
            print("5. The user ID is in the JWT token")
            print("\nOR just provide any unique identifier you want to use.")
            
            new_user_id = input("\nEnter your current user ID: ").strip()
            
            if new_user_id:
                print(f"\n🔄 Updating all sessions to user: {new_user_id}")
                update_all_sessions_to_user(new_user_id)
                print("\n✨ Now try accessing your research sessions again!")
            else:
                print("❌ No user ID provided")
        
        elif choice == "2":
            print("\n📋 Current user IDs in database:")
            user_ids = set(s['user_id'] for s in sessions)
            for uid in user_ids:
                print(f"   {uid}")
            print("\n💡 Use one of these user IDs, or create a new one!")
        
        else:
            print("👋 Goodbye!")
    
    else:
        print("📝 No sessions to fix. Create a research session first!")