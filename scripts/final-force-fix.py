import urllib.request
import json
import sys
import time

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

# 2. Try PATCH with DATA wrapper
print("\n🧹 Trying PATCH with wrapper { data: ... }...")
payload = {
    "data": {
        "seo_keywords": [],
        "social_links": []
    }
}
res = request('PATCH', '/items/global_settings', payload, token)

if 'error' not in res:
    print("✅ SUCCESS! Data reset with wrapper.")
    print(json.dumps(res, indent=2))
    sys.exit(0)

print(f"❌ Failed with wrapper: {res['status']}")
print(res['body'])

# 3. Fallback: Try POST with wrapper
print("\n📦 Trying POST with wrapper...")
res_post = request('POST', '/items/global_settings', payload, token)
if 'error' not in res_post:
    print("✅ SUCCESS! Created item with wrapper.")
    sys.exit(0)
    
print(f"❌ Failed POTS with wrapper: {res_post['status']}")

# 4. Fallback: Try KEY wrapper (Batch style)
print("\n📦 Trying BATCH style { keys: [], data: ... }...")
batch_payload = {
    "keys": ["global_settings"], # Sometimes singleton ID is just the name? or 1?
    "data": {
        "seo_keywords": [],
        "social_links": []
    }
}
res_batch = request('PATCH', '/items/global_settings', batch_payload, token)
if 'error' not in res_batch:
    print("✅ SUCCESS! Batch style worked.")
    sys.exit(0)

print("❌ ALL ATTEMPTS FAILED.")
sys.exit(1)
