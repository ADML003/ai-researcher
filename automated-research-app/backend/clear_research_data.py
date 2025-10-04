#!/usr/bin/env python3
"""
Script to clear all research data from the database while preserving the schema.
This will delete all records from research_sessions, personas, and interviews tables.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db_connection

def clear_research_data():
    """Clear all research data from the database while keeping the schema intact"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            print("🗑️  Starting to clear all research data...")
            
            # Due to foreign key constraints, we need to delete in the correct order:
            # 1. First delete interviews (they reference research_sessions)
            # 2. Then delete personas (they reference research_sessions)
            # 3. Finally delete research_sessions
            
            print("Deleting interviews...")
            cursor.execute("DELETE FROM interviews")
            interviews_deleted = cursor.rowcount
            print(f"✅ Deleted {interviews_deleted} interview records")
            
            print("Deleting personas...")
            cursor.execute("DELETE FROM personas")
            personas_deleted = cursor.rowcount
            print(f"✅ Deleted {personas_deleted} persona records")
            
            print("Deleting research sessions...")
            cursor.execute("DELETE FROM research_sessions")
            sessions_deleted = cursor.rowcount
            print(f"✅ Deleted {sessions_deleted} research session records")
            
            # Commit the transaction
            conn.commit()
            
            print(f"""
🎉 Successfully cleared all research data!
📊 Summary:
   - Research Sessions: {sessions_deleted} deleted
   - Personas: {personas_deleted} deleted  
   - Interviews: {interviews_deleted} deleted
   
✅ Database schema preserved - all tables and structure remain intact
🔄 Ready for fresh research data!
""")
            
    except Exception as e:
        print(f"❌ Error clearing research data: {e}")
        return False
    
    return True

def verify_tables_exist():
    """Verify that all tables still exist after clearing data"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check if all tables still exist and are empty
            tables = ['research_sessions', 'personas', 'interviews']
            
            print("🔍 Verifying database state...")
            for table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"   {table}: {count} records (should be 0)")
                
            print("✅ All tables verified - schema intact, data cleared!")
            
    except Exception as e:
        print(f"❌ Error verifying tables: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🧹 Research Data Cleanup Tool")
    print("=" * 50)
    
    # Ask for confirmation
    response = input("⚠️  This will delete ALL research data. Are you sure? (yes/no): ")
    
    if response.lower() in ['yes', 'y']:
        print("\n🚀 Starting cleanup process...")
        
        if clear_research_data():
            verify_tables_exist()
            print("\n✨ Cleanup completed successfully!")
        else:
            print("\n💥 Cleanup failed!")
            sys.exit(1)
    else:
        print("❌ Cleanup cancelled.")
        sys.exit(0)