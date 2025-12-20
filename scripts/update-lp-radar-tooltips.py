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

# 2. Add Tooltip Fields
print("\n🏗️  Adding Tooltip Fields to Radar...")

fields = [
    { 
        "field": "metric_money_tooltip", "type": "text", 
        "meta": { "interface": "input-multiline", "sort": 14, "width": "full", "note": "Explanation shown on hover." } 
    },
    { 
        "field": "metric_time_tooltip", "type": "text", 
        "meta": { "interface": "input-multiline", "sort": 24, "width": "full", "note": "Explanation shown on hover." } 
    },
    { 
        "field": "metric_risk_tooltip", "type": "text", 
        "meta": { "interface": "input-multiline", "sort": 34, "width": "full", "note": "Explanation shown on hover." } 
    }
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
              print(f"   ⚠️  {f['field']} exists. PATCHing...")
              # Optional: Update sort/note if it exists
              request('PATCH', f"/fields/lp_radar/{f['field']}", {"meta": f['meta']}, token)
              print(f"   ✅ Updated {f['field']}")
    else:
         print(f"   ✅ Created {f['field']}")

print("\n🎉 Radar Tooltips Added.")
