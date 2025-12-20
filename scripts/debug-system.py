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
             if response.status == 204: return {}
             return json.loads(response.read().decode('utf-8'))
    except urllib.request.HTTPError as e:
        return {'error': True, 'status': e.code, 'body': json.loads(e.read().decode('utf-8'))}

# Login
login = request('POST', '/auth/login', {'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
if 'error' in login:
    print(f"Login failed: {login}")
    sys.exit(1)
token = login['data']['access_token']
print("✅ Login success")

# 1. Check directus_collections
print("🔎 Checking directus_collections for 'global_settings'...")
res = request('GET', '/items/directus_collections?filter[collection][_eq]=global_settings', None, token)
if 'error' in res:
    print(f"❌ Failed to check system collections: {res}")
else:
    items = res['data']
    if len(items) > 0:
        print(f"⚠️  FOUND existing record in directus_collections: {items[0]}")
    else:
        print("✅ No record found in directus_collections.")

# 2. Try create ALTERNATE name
print("📦 Attempting to create 'global_settings_test'...")
res2 = request('POST', '/collections', {
    "collection": "global_settings_test",
    "singleton": True,
    "note": "debug"
}, token)

if 'error' in res2:
    print(f"❌ Failed to create global_settings_test: {res2}")
else:
    print("✅ Created global_settings_test successfully. Script logic is fine.")
    request('DELETE', '/collections/global_settings_test', None, token) # Cleanup

# 3. Try create TARGET name (again)
print("📦 Attempting to create 'global_settings' (final check)...")
res3 = request('POST', '/collections', {
    "collection": "global_settings",
    "singleton": True,
    "note": "real"
}, token)

if 'error' in res3:
    print(f"❌ Failed to create global_settings: {res3}")
else:
    print("✅ Created global_settings successfully!")
