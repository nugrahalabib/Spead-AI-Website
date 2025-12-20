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

# 1. Login
print("🔌 Authenticating...")
login_res = request('POST', '/auth/login', {'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
if 'error' in login_res:
    print(f"❌ Login failed: {login_res}")
    sys.exit(1)
token = login_res['data']['access_token']
print("✅ Authenticated.")

# 2. Check Data
print("\n🔍 Checking Singleton Item...")
get_res = request('GET', '/items/global_settings', None, token)

exists = False
if 'error' not in get_res:
    exists = True
    print("   Item FOUND.")
    print(f"   Current Data: {json.dumps(get_res.get('data', {}), indent=2)}")
else:
    print(f"   Item NOT found or error: {get_res['status']}")

# 3. Clean Data
payload = {
    "seo_keywords": [],
    "social_links": []
}

if exists:
    print("\n🧹 Updating (PATCH)...")
    res = request('PATCH', '/items/global_settings', payload, token)
else:
    print("\n📦 Creating (POST)...")
    res = request('POST', '/items/global_settings', payload, token)

if 'error' in res:
    print(f"❌ Failed: {res}")
    sys.exit(1)
else:
    print("✅ Success! Data reset to empty arrays.")
    print(f"   New Data: {json.dumps(res.get('data', {}), indent=2)}")

