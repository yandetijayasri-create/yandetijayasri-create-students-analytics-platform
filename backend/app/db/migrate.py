"""
ElevAlte Database Migration CLI Tool
Connects to Supabase PostgreSQL using DIRECT_URL or DATABASE_URL,
applies database/supabase/schema.sql and database/supabase/seed.sql,
and verifies tables and row counts.
"""

import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

# Ensure Windows terminal doesn't crash on UTF-8 characters
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from app.config import settings
from app.db.postgres import SupabasePostgresClient, get_db_url


def run_migration():
    print("=" * 70)
    print(" ELEVALTE -- Supabase PostgreSQL Database Migration")
    print("=" * 70)

    url = get_db_url(prefer_direct=True)
    if not url:
        print("\n[!] ERROR: No valid database connection URL found.")
        print("    Please set DATABASE_URL or DIRECT_URL in backend/.env or your environment:")
        print("    Example:")
        print('    DATABASE_URL="postgresql://postgres.odjxspxozykmmoavwlic:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"')
        print('    DIRECT_URL="postgresql://postgres.odjxspxozykmmoavwlic:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"')
        return False

    # Mask password for display
    masked_url = url
    if "@" in url and "://" in url:
        prefix, rest = url.split("://", 1)
        user_info, host_info = rest.split("@", 1)
        user = user_info.split(":")[0] if ":" in user_info else user_info
        masked_url = f"{prefix}://{user}:*****@{host_info}"
    print(f"Connecting to: {masked_url}")

    client = SupabasePostgresClient(connection_url=url)
    if not client.is_connected:
        print("\n[!] ERROR: Connection to Supabase PostgreSQL could not be established.")
        print("    Ensure your password is correct and your Supabase project allows incoming connections.")
        return False

    print("[✓] Successfully connected to Supabase PostgreSQL!")

    # Locate schema and seed files
    project_root = backend_dir.parent
    schema_path = project_root / "database" / "supabase" / "schema.sql"
    seed_path = project_root / "database" / "supabase" / "seed.sql"

    if not schema_path.exists():
        print(f"[!] Schema file missing at: {schema_path}")
        return False

    print(f"\n[1/3] Applying schema from: {schema_path}...")
    with open(schema_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    if client.run_script(schema_sql):
        print("      ✓ Schema tables, constraints, and indexes created successfully!")
    else:
        print("      ✗ Error applying schema.")
        return False

    if seed_path.exists():
        print(f"\n[2/3] Applying seed data from: {seed_path}...")
        with open(seed_path, "r", encoding="utf-8") as f:
            seed_sql = f.read()

        if client.run_script(seed_sql):
            print("      ✓ Seed demo data loaded successfully!")
        else:
            print("      ✗ Error applying seed data.")
            return False
    else:
        print("      [i] Seed file not found, skipping seeding.")

    # Verification of tables & row counts
    print("\n[3/3] Verifying database tables and row counts in Supabase:")
    print("-" * 70)
    print(f"{'TABLE NAME':<26} | {'STATUS':<10} | {'ROW COUNT':<10}")
    print("-" * 70)

    tables_to_check = [
        "users",
        "students",
        "subjects",
        "topics",
        "student_topic_mastery",
        "questions",
        "quiz_attempts",
        "quiz_attempt_answers",
        "mistakes",
        "learning_gaps",
        "recommendations",
        "study_plans",
        "study_tasks",
        "activities",
        "resources",
        "progress_history"
    ]

    for table in tables_to_check:
        try:
            res = client.execute_query(f"SELECT COUNT(*) as cnt FROM {table};")
            count = res[0]["cnt"] if res else 0
            print(f"{table:<26} | {'EXISTS':<10} | {count:<10}")
        except Exception:
            print(f"{table:<26} | {'MISSING':<10} | {'0':<10}")

    print("-" * 70)
    print("Migration completed successfully! ElevAlte is ready with Supabase PostgreSQL.")
    return True


if __name__ == "__main__":
    success = run_migration()
    sys.exit(0 if success else 1)
