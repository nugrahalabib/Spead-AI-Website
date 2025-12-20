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
login = request('POST', '/auth/login', {'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
token = login['data']['access_token']

# 2. Update Site Name
print("📝 Updating Site Name to 'Spead AI [UPDATED]'...")

# Fetch ID first to be safe
get_res = request('GET', '/items/global_settings', None, token)
print(f"DEBUG RESPONSE: {json.dumps(get_res, indent=2)}")
sys.exit(0) # Stop here to analyze

if 'error' in get_res or not get_res.get('data'):
    print("   ❌ Could not fetch singleton to get ID.")
    sys.exit(1)

item_id = get_res['data']['id']
# print(f"   ℹ️  Singleton ID: {item_id}")

# Update by ID
res = request('PATCH', f'/items/global_settings/{item_id}', { "site_name": "Spead AI [UPDATED]" }, token)

if 'error' in res:
    print(f"❌ Update Failed: {res}")
else:
    print("✅ Site Name Updated in Backend.")
