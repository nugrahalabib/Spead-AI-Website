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
            if response.status == 204: return {} # No content
            return json.loads(response.read().decode('utf-8'))
    except urllib.request.HTTPError as e:
        return {'error': True, 'status': e.code, 'body': json.loads(e.read().decode('utf-8'))}

# 1. Login
login = request('POST', '/auth/login', {'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
token = login['data']['access_token']

# 2. Get IDs
res = request('GET', '/items/pricing_plans', None, token)
ids = [item['id'] for item in res.get('data', [])]

if not ids:
    print("✅ Collection already empty.")
    sys.exit(0)

# 3. Delete
print(f"🔥 Deleting {len(ids)} items...")
del_res = request('DELETE', '/items/pricing_plans', ids, token)

if 'error' in del_res:
    print(f"❌ Delete Failed: {del_res}")
else:
    print("✅ All items deleted.")
