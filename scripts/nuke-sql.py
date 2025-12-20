import sqlite3
import os
import sys

# Path to database file
DB_PATH = os.path.join(os.getcwd(), 'directus', 'database', 'data.db')

if not os.path.exists(DB_PATH):
    print(f"❌ Database not found at: {DB_PATH}")
    sys.exit(1)

print(f"🔌 Connecting to SQLite: {DB_PATH}")

try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Tables to clean
    tables = [
        'directus_collections',
        'directus_fields',
        'directus_permissions',
        'directus_relations',
        'directus_presets',
        'directus_shares',
        'directus_flows', # trigger on collection
        'directus_dashboards', 
        'directus_panels'
    ]
    
    COLLECTION = 'global_settings'

    print(f"☢️  Nuking '{COLLECTION}' from DB...")

    for table in tables:
        try:
            # Check if table has 'collection' column
            cursor.execute(f"PRAGMA table_info({table})")
            cols = [info[1] for info in cursor.fetchall()]
            
            if 'collection' in cols:
                print(f"   - Cleaning {table}...", end=" ")
                cursor.execute(f"DELETE FROM {table} WHERE collection = ?", (COLLECTION,))
                print(f"Deleted {cursor.rowcount} rows.")
        except Exception as e:
            print(f"Skipping {table}: {e}")

    conn.commit()
    conn.close()
    print("✅ Nuke successful.")

except Exception as e:
    print(f"❌ SQL Execution failed: {e}")
    sys.exit(1)
