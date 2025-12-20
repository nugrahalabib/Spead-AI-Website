import urllib.request
import json
import sys

DIRECTUS_URL = 'http://localhost:8055'
ADMIN_EMAIL = 'admin@spead.ai'
ADMIN_PASSWORD = 'password123'

def request(method, endpoint, data=None, token=None):
    url = f"{DIRECTUS_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f"Bearer {token}"
    body = json.dumps(data).encode('utf-8') if data else None
    
    try:
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.request.HTTPError as e:
        return {'error': True, 'status': e.code, 'body': json.loads(e.read().decode('utf-8'))}

# 1. Login
print("🔌 Authenticating...")
login = request('POST', '/auth/login', {'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
token = login['data']['access_token']
print("✅ Authenticated.")

# 2. Create Collection (Singleton)
print("\n📦 FORCE CREATING 'lp_hero'...")
coll_payload = {
    "collection": "lp_hero",
    "schema": {},  # <--- Ensure this is here
    "meta": {
        "singleton": True,
        "note": "Landing Page Hero Section",
        "sort": 2,
        "hidden": False
    }
}

# Try creating
res = request('POST', '/collections', coll_payload, token)

if 'error' in res:
    if res['status'] == 409: # Conflict, already exists? (Audit said no, but maybe?)
         print("   ⚠️  Collection already exists (409). Skipping create.")
    else:
         print(f"❌ Failed to create collection: {res}")
         sys.exit(1)
else:
    print("✅ Collection 'lp_hero' Created.")


# 3. Create Fields
print("\n🏗️  Creating Fields...")

fields = [
    # Group 1
    { "field": "div_main_copy", "type": "alias", "meta": { "interface": "presentation-divider", "options": {"title": "Main Copy"}, "sort": 1, "special": ["alias","no-data"] } },
    { "field": "badge_text", "type": "string", "meta": { "interface": "input", "sort": 2, "width": "half", "note": "e.g. Enterprise V2.0" } },
    { "field": "headline_prefix", "type": "string", "meta": { "interface": "input", "sort": 3, "width": "half", "note": "e.g. Stop Burning" } },
    { "field": "headline_gradient", "type": "string", "meta": { "interface": "input", "sort": 4, "width": "half", "note": "e.g. Billable Hours" } },
    { "field": "subheadline", "type": "text", "meta": { "interface": "textarea", "sort": 5, "width": "full", "note": "Descriptive text" } },
    
    # Group 2
    { "field": "div_cta", "type": "alias", "meta": { "interface": "presentation-divider", "options": {"title": "Call to Actions"}, "sort": 10, "special": ["alias","no-data"] } },
    { "field": "cta_primary_label", "type": "string", "meta": { "interface": "input", "sort": 11, "width": "half" } },
    { "field": "cta_primary_url", "type": "string", "meta": { "interface": "input", "sort": 12, "width": "half" } },
    { "field": "cta_secondary_label", "type": "string", "meta": { "interface": "input", "sort": 13, "width": "half" } },
    { "field": "cta_secondary_url", "type": "string", "meta": { "interface": "input", "sort": 14, "width": "half" } },

    # Group 3
    { "field": "div_visuals", "type": "alias", "meta": { "interface": "presentation-divider", "options": {"title": "Visuals"}, "sort": 20, "special": ["alias","no-data"] } },
    { "field": "hero_visual", "type": "uuid", "meta": { "interface": "image", "sort": 21, "width": "full", "note": "3D Artifact Image" } }
]

for f in fields:
    # Check if exists
    # If the collection was missing, likely all fields are missing too.
    # Just try POST
    payload = {
        "field": f['field'],
        "type": f['type'],
        "schema": {},
        "meta": f['meta']
    }
    
    # Special: Relation for hero_visual
    # We will do relations separately or if needed.
    # For now, create the field first.
    
    f_res = request('POST', '/fields/lp_hero', payload, token)
    if 'error' in f_res:
         if f_res['status'] != 409: # Ignore already exists
              print(f"   ❌ Failed {f['field']}: {f_res}")
         else:
              print(f"   ⚠️  {f['field']} exists.")
    else:
         print(f"   ✅ Created {f['field']}")


# 4. Permissions
print("\n🔓 Setting Public Read...")
perm_payload = {
    "role": None, 
    "collection": "lp_hero",
    "action": "read",
    "fields": ["*"]
}
perm_res = request('POST', '/permissions', perm_payload, token)
if 'error' in perm_res:
     print(f"   ⚠️  Permission failed (likely exists): {perm_res['body']}")
else:
     print("   ✅ Permission granted.")

print("\n🎉 Emergency Setup Complete.")
