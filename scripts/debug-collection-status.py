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
print("✅ Authenticated.")

# Check Collection
print("🔍 Checking Collection Metadata...")
res = request('GET', '/collections/global_settings', None, token)

if 'error' in res:
    print(f"❌ Failed to fetch collection: {res}")
else:
    data = res['data']
    print(f"   Collection: {data['collection']}")
    print(f"   Singleton: {data.get('singleton')}")
    print(f"   Note: {data.get('note')}")

    if data.get('singleton') != True:
        print("\n⚠️  WARNING: Collection is NOT marked as a singleton!")
    else:
        print("\n✅ Collection IS a singleton.")
