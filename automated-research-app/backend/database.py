"""
PostgreSQL database manager for automated research app
Production-ready database layer using Neon PostgreSQL
"""
import os
from typing import Optional, List, Dict, Any, Union
from contextlib import contextmanager
import logging
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL")
        if not self.database_url or not self.database_url.startswith(("postgresql://", "postgres://")):
            raise ValueError("DATABASE_URL must be set to a PostgreSQL connection string")
        self.db_type = "postgresql"
        self._ensure_dependencies()
        
    def _detect_db_type(self) -> str:
        """Always return postgresql"""
        return "postgresql"
    
    def _ensure_dependencies(self):
        """Check if required database drivers are available"""
        try:
            import psycopg2
        except ImportError:
            raise ImportError(
                "PostgreSQL driver not found. Install with: pip install psycopg2-binary"
            )
    
    @contextmanager
    def get_connection(self):
        """Get PostgreSQL database connection with proper context management"""
        import psycopg2
        import psycopg2.extras
        conn = psycopg2.connect(
            self.database_url,
            cursor_factory=psycopg2.extras.RealDictCursor
        )
        try:
            yield conn
        finally:
            conn.close()
    
    def execute_query(self, query: str, params: tuple = None, fetch: str = None):
        """Execute query with automatic connection management"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            if fetch == "one":
                result = cursor.fetchone()
            elif fetch == "all":
                result = cursor.fetchall()
            else:
                result = None
            
            conn.commit()
            return result
    
    def init_database(self):
        """Initialize PostgreSQL database tables"""
        logger.info(f"Initializing {self.db_type} database...")
        
        self._init_postgresql()
        
        logger.info("Database initialization completed successfully")
    
    def _init_postgresql(self):
        """Initialize PostgreSQL database"""
        queries = [
            '''
            CREATE TABLE IF NOT EXISTS research_sessions (
                id SERIAL PRIMARY KEY,
                session_id VARCHAR(255) UNIQUE,
                research_question TEXT,
                target_demographic TEXT,
                num_interviews INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                synthesis TEXT,
                status VARCHAR(50) DEFAULT 'completed'
            )
            ''',
            '''
            CREATE TABLE IF NOT EXISTS personas (
                id SERIAL PRIMARY KEY,
                session_id VARCHAR(255),
                name TEXT,
                age INTEGER,
                job TEXT,
                traits TEXT,
                background TEXT,
                communication_style TEXT,
                FOREIGN KEY (session_id) REFERENCES research_sessions (session_id)
            )
            ''',
            '''
            CREATE TABLE IF NOT EXISTS interviews (
                id SERIAL PRIMARY KEY,
                session_id VARCHAR(255),
                persona_name TEXT,
                question TEXT,
                answer TEXT,
                question_order INTEGER,
                FOREIGN KEY (session_id) REFERENCES research_sessions (session_id)
            )
            '''
        ]
        
        # Migration queries to update existing tables
        migration_queries = [
            '''
            ALTER TABLE personas 
            ALTER COLUMN name TYPE TEXT,
            ALTER COLUMN job TYPE TEXT
            ''',
            '''
            ALTER TABLE interviews
            ALTER COLUMN persona_name TYPE TEXT
            ''',
            '''
            ALTER TABLE research_sessions 
            ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT 'guest'
            '''
        ]
        
        for query in queries:
            self.execute_query(query)
            
        # Run migrations to update existing tables
        for query in migration_queries:
            try:
                self.execute_query(query)
                logger.info("Successfully applied database migration")
            except Exception as e:
                # Migration might fail if columns are already the right type
                logger.info(f"Migration skipped (likely already applied): {e}")

# Global database manager instance
db = DatabaseManager()

def get_db_connection():
    """Get database connection"""
    return db.get_connection()

def init_database():
    """Initialize database - call this at startup"""
    db.init_database()

def execute_db_query(query: str, params: tuple = None, fetch: str = None):
    """Execute database query with automatic connection management"""
    return db.execute_query(query, params, fetch)