"""
ElevAlte Backend: Supabase PostgreSQL Connection & Data Access Layer
Provides resilient connection pooling, query execution, and migration execution
for Supabase PostgreSQL (transaction pooler on port 6543, session/direct on 5432).
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, date

logger = logging.getLogger("elevalte.postgres")

try:
    import psycopg2
    from psycopg2 import pool
    from psycopg2.extras import RealDictCursor
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False
    logger.warning("psycopg2-binary not installed; running in zero-dependency fallback mode")


def get_db_url(prefer_direct: bool = False) -> Optional[str]:
    """
    Returns active database connection URL.
    Checks DIRECT_URL or DATABASE_URL based on prefer_direct flag.
    """
    if prefer_direct:
        url = os.getenv("DIRECT_URL") or os.getenv("DATABASE_URL")
    else:
        url = os.getenv("DATABASE_URL") or os.getenv("DIRECT_URL")

    if url and "[YOUR-PASSWORD]" not in url and "[PASSWORD]" not in url and len(url.strip()) > 0:
        return url.strip()
    return None


class SupabasePostgresClient:
    def __init__(self, connection_url: Optional[str] = None):
        self.connection_url = connection_url or get_db_url()
        self._pool: Optional[Any] = None
        self._connected = False

        if self.connection_url and PSYCOPG2_AVAILABLE:
            self.connect()

    def connect(self) -> bool:
        if not PSYCOPG2_AVAILABLE or not self.connection_url:
            self._connected = False
            return False

        try:
            from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
            u = urlparse(self.connection_url)
            valid_params = {"sslmode", "connect_timeout", "application_name", "options", "keepalives", "keepalives_idle"}
            q = parse_qs(u.query)
            filtered = {k: v[0] for k, v in q.items() if k.lower() in valid_params}
            if "sslmode" not in filtered:
                filtered["sslmode"] = "require"
            conn_str = urlunparse((u.scheme, u.netloc, u.path, u.params, urlencode(filtered), u.fragment))


            # Create connection pool (min 1, max 10)
            self._pool = pool.ThreadedConnectionPool(
                minconn=1,
                maxconn=10,
                dsn=conn_str,
                connect_timeout=10
            )
            # Test a connection
            conn = self._pool.getconn()
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
            self._pool.putconn(conn)
            self._connected = True
            logger.info("Successfully connected to Supabase PostgreSQL!")
            return True
        except Exception as e:
            # Mask password in log output
            masked = self.connection_url
            if "@" in masked and "://" in masked:
                try:
                    pre, post = masked.split("://", 1)
                    creds, host = post.split("@", 1)
                    user = creds.split(":")[0] if ":" in creds else creds
                    masked = f"{pre}://{user}:*****@{host}"
                except Exception:
                    masked = "[MASKED_URL]"
            logger.error(f"Could not connect to Supabase PostgreSQL at {masked}: {e}")
            self._connected = False
            self._pool = None
            return False

    def test_connection(self) -> Dict[str, Any]:
        """Runs SELECT current_database(), current_user, version() to test connectivity."""
        if not self.is_connected:
            return {"connected": False, "error": "Not connected to database"}
        try:
            res = self.execute_query("SELECT current_database() as db, current_user as user, version() as version;")
            if res:
                return {
                    "connected": True,
                    "database": res[0]["db"],
                    "user": res[0]["user"],
                    "version": res[0]["version"]
                }
            return {"connected": False, "error": "No rows returned"}
        except Exception as e:
            return {"connected": False, "error": str(e)}

    def execute_scalar(self, query: str, params: Optional[tuple] = None) -> Any:
        """Executes a query and returns the first column of the first row."""
        rows = self.execute_query(query, params)
        if rows and len(rows) > 0:
            first_row = rows[0]
            if isinstance(first_row, dict):
                return next(iter(first_row.values()))
        return None

    @property
    def is_connected(self) -> bool:
        return self._connected and self._pool is not None

    def execute_query(self, query: str, params: Optional[tuple] = None) -> List[Dict[str, Any]]:
        """Executes a SELECT query and returns rows as dictionaries."""
        if not self.is_connected or not self._pool:
            return []

        conn = None
        try:
            conn = self._pool.getconn()
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, params or ())
                rows = cur.fetchall()
                # Convert RealDictRow to standard Python dict
                return [dict(row) for row in rows]
        except Exception as e:
            logger.error(f"PostgreSQL Query Error: {e} | Query: {query[:100]}")
            if conn:
                conn.rollback()
            return []
        finally:
            if conn and self._pool:
                self._pool.putconn(conn)

    def execute_non_query(self, query: str, params: Optional[tuple] = None) -> int:
        """Executes INSERT, UPDATE, DELETE and commits."""
        if not self.is_connected or not self._pool:
            return 0

        conn = None
        try:
            conn = self._pool.getconn()
            with conn.cursor() as cur:
                cur.execute(query, params or ())
                affected = cur.rowcount
            conn.commit()
            return affected
        except Exception as e:
            logger.error(f"PostgreSQL Non-Query Error: {e} | Query: {query[:100]}")
            if conn:
                conn.rollback()
            return 0
        finally:
            if conn and self._pool:
                self._pool.putconn(conn)

    def run_script(self, sql_script: str) -> bool:
        """Executes a multi-statement DDL/DML SQL script."""
        if not self.is_connected or not self._pool:
            return False

        conn = None
        try:
            conn = self._pool.getconn()
            conn.autocommit = True
            with conn.cursor() as cur:
                cur.execute(sql_script)
            return True
        except Exception as e:
            logger.error(f"PostgreSQL Script Execution Error: {e}")
            return False
        finally:
            if conn and self._pool:
                self._pool.putconn(conn)


# Default singleton client instance
pg_client = SupabasePostgresClient()
