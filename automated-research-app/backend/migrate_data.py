#!/usr/bin/env python3
"""
Data migration script to transfer SQLite data to PostgreSQL
Run this after setting up Neon database
"""
import sqlite3
import os
import sys
from dotenv import load_dotenv
from database import get_db_connection, db

# Load environment variables
load_dotenv()

def migrate_data():
    """Migrate data from SQLite to PostgreSQL"""
    
    # Check if we have a PostgreSQL connection
    if db.db_type != "postgresql":
        print("❌ DATABASE_URL is not set to PostgreSQL. Please set your Neon connection string first.")
        print("Example: DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require")
        return False
    
    print("🔄 Starting data migration from SQLite to PostgreSQL...")
    
    # Connect to SQLite database
    try:
        sqlite_conn = sqlite3.connect('research_history.db')
        sqlite_cursor = sqlite_conn.cursor()
        print("✅ Connected to SQLite database")
    except Exception as e:
        print(f"❌ Failed to connect to SQLite: {e}")
        return False
    
    # Connect to PostgreSQL database
    try:
        with get_db_connection() as pg_conn:
            pg_cursor = pg_conn.cursor()
            print("✅ Connected to PostgreSQL database")
            
            # Migrate research_sessions
            print("📋 Migrating research sessions...")
            sqlite_cursor.execute("SELECT * FROM research_sessions")
            sessions = sqlite_cursor.fetchall()
            
            for session in sessions:
                # Skip if already exists
                pg_cursor.execute("SELECT session_id FROM research_sessions WHERE session_id = %s", (session[1],))
                if pg_cursor.fetchone():
                    print(f"⏭️  Session {session[1]} already exists, skipping...")
                    continue
                
                pg_cursor.execute("""
                    INSERT INTO research_sessions 
                    (session_id, research_question, target_demographic, num_interviews, created_at, synthesis, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, session[1:])  # Skip the auto-increment ID
            
            # Migrate personas
            print("👥 Migrating personas...")
            sqlite_cursor.execute("SELECT * FROM personas")
            personas = sqlite_cursor.fetchall()
            
            for persona in personas:
                # Skip if already exists
                pg_cursor.execute("SELECT id FROM personas WHERE session_id = %s AND name = %s", (persona[1], persona[2]))
                if pg_cursor.fetchone():
                    continue
                
                pg_cursor.execute("""
                    INSERT INTO personas 
                    (session_id, name, age, job, traits, background, communication_style)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, persona[1:])  # Skip the auto-increment ID
            
            # Migrate interviews
            print("💬 Migrating interviews...")
            sqlite_cursor.execute("SELECT * FROM interviews")
            interviews = sqlite_cursor.fetchall()
            
            for interview in interviews:
                # Skip if already exists
                pg_cursor.execute("""
                    SELECT id FROM interviews 
                    WHERE session_id = %s AND persona_name = %s AND question_order = %s
                """, (interview[1], interview[2], interview[5]))
                if pg_cursor.fetchone():
                    continue
                
                pg_cursor.execute("""
                    INSERT INTO interviews 
                    (session_id, persona_name, question, answer, question_order)
                    VALUES (%s, %s, %s, %s, %s)
                """, interview[1:])  # Skip the auto-increment ID
            
            pg_conn.commit()
            print("✅ Data migration completed successfully!")
            
            # Show statistics
            pg_cursor.execute("SELECT COUNT(*) FROM research_sessions")
            result = pg_cursor.fetchone()
            sessions_count = result[0] if isinstance(result, tuple) else result['count']
            
            pg_cursor.execute("SELECT COUNT(*) FROM personas")
            result = pg_cursor.fetchone()
            personas_count = result[0] if isinstance(result, tuple) else result['count']
            
            pg_cursor.execute("SELECT COUNT(*) FROM interviews")
            result = pg_cursor.fetchone()
            interviews_count = result[0] if isinstance(result, tuple) else result['count']
            
            print(f"📊 Migration Summary:")
            print(f"   - Research Sessions: {sessions_count}")
            print(f"   - Personas: {personas_count}")
            print(f"   - Interviews: {interviews_count}")
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    finally:
        sqlite_conn.close()
    
    return True

def verify_environment():
    """Verify that environment is set up correctly"""
    print("🔍 Verifying environment setup...")
    
    # Check DATABASE_URL
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL not set in environment")
        return False
    
    if not database_url.startswith(("postgresql://", "postgres://")):
        print("❌ DATABASE_URL is not a PostgreSQL connection string")
        print(f"   Current: {database_url}")
        print("   Expected: postgresql://username:password@host/dbname")
        return False
    
    print("✅ DATABASE_URL is properly configured")
    
    # Check if SQLite database exists
    if not os.path.exists('research_history.db'):
        print("⚠️  No SQLite database found to migrate from")
        return True  # Not an error, just no data to migrate
    
    print("✅ SQLite database found for migration")
    return True

if __name__ == "__main__":
    print("🚀 Database Migration Tool")
    print("=" * 50)
    
    if not verify_environment():
        sys.exit(1)
    
    if migrate_data():
        print("\n🎉 Migration completed successfully!")
        print("\n📝 Next steps:")
        print("   1. Test your application with PostgreSQL")
        print("   2. Deploy to your hosting platform")
        print("   3. Update your hosting platform's environment variables")
    else:
        print("\n💥 Migration failed!")
        sys.exit(1)