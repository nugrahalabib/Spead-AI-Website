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

# Login
login = request('POST', '/auth/login', {'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
token = login['data']['access_token']

# Check Fields
print("🔍 Checking Fields for lp_hero...")
res = request('GET', '/fields/lp_hero', None, token)

if 'error' in res:
    print(f"❌ Failed to list fields: {res}")
    sys.exit(1)

fields = res['data']
existing = [f['field'] for f in fields]

required = ['badge_text', 'div_main_copy', 'div_cta', 'div_visuals', 'hero_visual']
missing = [r for r in required if r not in existing]

print(f"{'Field':<25} | {'Type':<10} | {'Sort':<5}")
print("-" * 50)
for f in sorted(fields, key=lambda x: x['meta']['sort'] if x['meta'] and x['meta']['sort'] else 999):
    sort = f['meta']['sort'] if f['meta'] else 'N/A'
    print(f"{f['field']:<25} | {f['type']:<10} | {sort:<5}")

if missing:
    print(f"\n❌ MISSING FIELDS: {', '.join(missing)}")
    sys.exit(1)
else:
    print("\n✅ ALL REQUIRED FIELDS PRESENT.")
