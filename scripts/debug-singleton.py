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
token = login['data']['access_token']
print("✅ Login success")

# Test 1: Normal Collection
print("TEST 1: Creating 'debug_normal' (singleton: false/missing)...", end=" ")
res1 = request('POST', '/collections', {
    "collection": "debug_normal",
    "schema": {},
    "meta": { "note": "Normal" }
}, token)
if 'error' in res1:
    print(f"❌ Failed: {res1['status']}")
else:
    print("✅ Success")
    request('DELETE', '/collections/debug_normal', None, token)

# Test 2: Singleton Collection
print("TEST 2: Creating 'debug_singleton' (singleton: true)...", end=" ")
res2 = request('POST', '/collections', {
    "collection": "debug_singleton",
    "singleton": True,
    "schema": {},
    "meta": { "note": "Singleton" }
}, token)
if 'error' in res2:
    print(f"❌ Failed: {res2['status']} - {res2['body']['errors'][0]['message']}")
else:
    print("✅ Success")
    request('DELETE', '/collections/debug_singleton', None, token)
