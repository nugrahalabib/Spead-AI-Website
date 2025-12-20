import sqlite3
import os

DB_PATH = 'directus/database/data.db'

def nuke_lp_hero():
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found at {DB_PATH}")
        return

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        print(f"🔌 Connected to {DB_PATH}")
        
        # Tables to clean
        target = 'lp_hero'
        
        # 1. directus_collections
        cursor.execute("DELETE FROM directus_collections WHERE collection = ?", (target,))
        print(f"   - Deleted {cursor.rowcount} from directus_collections")
        
        # 2. directus_fields
        cursor.execute("DELETE FROM directus_fields WHERE collection = ?", (target,))
        print(f"   - Deleted {cursor.rowcount} from directus_fields")
        
        # 3. directus_permissions
        cursor.execute("DELETE FROM directus_permissions WHERE collection = ?", (target,))
        print(f"   - Deleted {cursor.rowcount} from directus_permissions")

        # 4. directus_relations
        cursor.execute("DELETE FROM directus_relations WHERE many_collection = ?", (target,))
        print(f"   - Deleted {cursor.rowcount} from directus_relations (many)")

        conn.commit()
        print("✅ Nuke Complete. 'lp_hero' traces removed.")
        conn.close()

    except Exception as e:
        print(f"❌ SQL Error: {e}")
        try:
            conn.rollback()
        except:
            pass

nuke_lp_hero()
