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
print("\n📦 FORCE CREATING 'lp_radar'...")
coll_payload = {
    "collection": "lp_radar",
    "schema": {},  # <--- CRITICAL
    "meta": {
        "singleton": True,
        "note": "Radar / Pain Points Section",
        "sort": 3,
        "hidden": False,
        "icon": "radar"
    }
}

res = request('POST', '/collections', coll_payload, token)
if 'error' in res:
    if res['status'] == 409: 
         print("   ⚠️  Collection already exists (409).")
    else:
         print(f"❌ Failed to create collection: {res}")
         sys.exit(1)
else:
    print("✅ Collection 'lp_radar' Created.")


# 3. Create Fields
print("\n🏗️  Creating Fields...")

statusChoices = [
    { "text": "Critical (Red)", "value": "red" },
    { "text": "Warning (Orange)", "value": "orange" },
    { "text": "Safe (Green)", "value": "green" }
]

fields = [
    # Group 1: Header
    { "field": "div_header", "type": "alias", "meta": { "interface": "presentation-divider", "options": {"title": "Section Header"}, "sort": 1, "special": ["alias","no-data"] } },
    { "field": "section_headline", "type": "string", "meta": { "interface": "input", "sort": 2, "width": "full", "note": "The scary title above the metrics." } },
    { "field": "section_subheadline", "type": "text", "meta": { "interface": "input-multiline", "sort": 3, "width": "full" } },

    # Group 2: Money
    { "field": "div_money", "type": "alias", "meta": { "interface": "presentation-divider", "options": {"title": "Metric 1: Financial Impact"}, "sort": 10, "special": ["alias","no-data"] } },
    { "field": "metric_money_value", "type": "string", "meta": { "interface": "input", "sort": 11, "width": "half" } },
    { "field": "metric_money_label", "type": "string", "meta": { "interface": "input", "sort": 12, "width": "half" } },
    { "field": "metric_money_status", "type": "string", "meta": { "interface": "select-dropdown", "sort": 13, "width": "full", "options": { "choices": statusChoices } } },

    # Group 3: Time
    { "field": "div_time", "type": "alias", "meta": { "interface": "presentation-divider", "options": {"title": "Metric 2: Operational Velocity"}, "sort": 20, "special": ["alias","no-data"] } },
    { "field": "metric_time_value", "type": "string", "meta": { "interface": "input", "sort": 21, "width": "half" } },
    { "field": "metric_time_label", "type": "string", "meta": { "interface": "input", "sort": 22, "width": "half" } },
    { "field": "metric_time_status", "type": "string", "meta": { "interface": "select-dropdown", "sort": 23, "width": "full", "options": { "choices": statusChoices } } },

    # Group 4: Risk
    { "field": "div_risk", "type": "alias", "meta": { "interface": "presentation-divider", "options": {"title": "Metric 3: Legal Risk"}, "sort": 30, "special": ["alias","no-data"] } },
    { "field": "metric_risk_value", "type": "string", "meta": { "interface": "input", "sort": 31, "width": "half" } },
    { "field": "metric_risk_label", "type": "string", "meta": { "interface": "input", "sort": 32, "width": "half" } },
    { "field": "metric_risk_status", "type": "string", "meta": { "interface": "select-dropdown", "sort": 33, "width": "full", "options": { "choices": statusChoices } } }
]

for f in fields:
    payload = {
        "field": f['field'],
        "type": f['type'],
        "schema": {},
        "meta": f['meta']
    }
    
    f_res = request('POST', '/fields/lp_radar', payload, token)
    if 'error' in f_res:
         if f_res['status'] != 409:
              print(f"   ❌ Failed {f['field']}: {f_res}")
         else:
              print(f"   ⚠️  {f['field']} exists.")
    else:
         print(f"   ✅ Created {f['field']}")

# 4. Permissions
print("\n🔓 Setting Public Read...")
perm_payload = {
    "role": None, 
    "collection": "lp_radar",
    "action": "read",
    "fields": ["*"]
}
perm_res = request('POST', '/permissions', perm_payload, token)
if 'error' in perm_res:
     print(f"   ⚠️  Permission failed (likely exists): {perm_res['body']}")
else:
     print("   ✅ Permission granted.")

print("\n🎉 Emergency Setup Complete.")
