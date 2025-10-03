"""
Flexible database manager for smooth SQLite to PostgreSQL transition
Supports both development (SQLite) and production (PostgreSQL) environments
"""
import os
import sqlite3
from typing import Optional, List, Dict, Any, Union
from contextlib import contextmanager
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL", "sqlite:///./research_history.db")
        self.db_type = self._detect_db_type()
        self._ensure_dependencies()
        
    def _detect_db_type(self) -> str:
        """Detect database type from DATABASE_URL"""
        if self.database_url.startswith(("postgresql://", "postgres://")):
            return "postgresql"
        else:
            return "sqlite"
    
    def _ensure_dependencies(self):
        """Check if required database drivers are available"""
        if self.db_type == "postgresql":
            try:
                import psycopg2
            except ImportError:
                raise ImportError(
                    "PostgreSQL driver not found. Install with: pip install psycopg2-binary"
                )
    
    @contextmanager
    def get_connection(self):
        """Get database connection with proper context management"""
        if self.db_type == "sqlite":
            # Extract path from sqlite:///path format
            db_path = self.database_url.replace("sqlite:///", "").replace("sqlite://", "")
            conn = sqlite3.connect(db_path)
            # Enable foreign keys for SQLite
            conn.execute("PRAGMA foreign_keys = ON")
            try:
                yield conn
            finally:
                conn.close()
                
        elif self.db_type == "postgresql":
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
        """Initialize database tables for any supported database type"""
        logger.info(f"Initializing {self.db_type} database...")
        
        if self.db_type == "sqlite":
            self._init_sqlite()
        elif self.db_type == "postgresql":
            self._init_postgresql()
        
        logger.info("Database initialization completed successfully")
    
    def _init_sqlite(self):
        """Initialize SQLite database (current implementation)"""
        queries = [
            '''
            CREATE TABLE IF NOT EXISTS research_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT UNIQUE,
                research_question TEXT,
                target_demographic TEXT,
                num_interviews INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                synthesis TEXT,
                status TEXT DEFAULT 'completed'
            )
            ''',
            '''
            CREATE TABLE IF NOT EXISTS personas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
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
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                persona_name TEXT,
                question TEXT,
                answer TEXT,
                question_order INTEGER,
                FOREIGN KEY (session_id) REFERENCES research_sessions (session_id)
            )
            '''
        ]
        
        for query in queries:
            self.execute_query(query)
    
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
                name VARCHAR(255),
                age INTEGER,
                job VARCHAR(255),
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
                persona_name VARCHAR(255),
                question TEXT,
                answer TEXT,
                question_order INTEGER,
                FOREIGN KEY (session_id) REFERENCES research_sessions (session_id)
            )
            '''
        ]
        
        for query in queries:
            self.execute_query(query)

# Global database manager instance
db = DatabaseManager()

def get_db_connection():
    """Get database connection - use this instead of direct sqlite3.connect()"""
    return db.get_connection()

def init_database():
    """Initialize database - call this at startup"""
    db.init_database()

def execute_db_query(query: str, params: tuple = None, fetch: str = None):
    """Execute database query with automatic connection management"""
    return db.execute_query(query, params, fetch)