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
        print(f"HTTP Error {e.code} on {method} {endpoint}")
        print(e.read().decode('utf-8'))
        sys.exit(1)

# Login
login = request('POST', '/auth/login', {'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
token = login['data']['access_token']
print("✅ Login success")

# Create Test Collection
print("📦 Creating test_collection...")
res = request('POST', '/collections', {
    "collection": "test_collection",
    "schema": {},
    "meta": { "note": "Test" }
}, token)
print("✅ Collection created:", res['data']['collection'])

# Delete it
print("🗑️  Deleting test_collection...")
request('DELETE', '/collections/test_collection', None, token)
print("✅ Deleted")
