import sqlite3
import os
import json

DB_PATH = 'directus/database/data.db'

def audit_lp_radar():
    print(f"🕵️ AUDITING 'lp_radar' in {DB_PATH}...")
    
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found at {DB_PATH}")
        return

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # 1. Check Collection
        print("\n1. Checking 'directus_collections':")
        cursor.execute("SELECT * FROM directus_collections WHERE collection = 'lp_radar'")
        row = cursor.fetchone()
        
        if row:
            print("   ✅ Collection Record FOUND.")
            print(f"   - collection: {row['collection']}")
            print(f"   - singleton: {row['singleton']}")
            print(f"   - hidden: {row['hidden']}")
        else:
            print("   ❌ Collection Record NOT FOUND. (It does not exist in DB)")

        # 2. Check Fields
        print("\n2. Checking 'directus_fields':")
        cursor.execute("SELECT field, type, interface, sort FROM directus_fields WHERE collection = 'lp_radar' ORDER BY sort")
        fields = cursor.fetchall()
        
        if fields:
            print(f"   ✅ Found {len(fields)} fields.")
            for f in fields:
                print(f"   - [{f['sort']}] {f['field']} ({f['type']})")
        else:
            print("   ❌ No fields found.")

        conn.close()

    except Exception as e:
        print(f"❌ SQL Error: {e}")

audit_lp_radar()
