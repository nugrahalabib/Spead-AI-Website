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

candidates = ['site_identity', 'brand_main', 'global_data', 'app_master', 'site_settings', 'main_config']

for name in candidates:
    print(f"Testing '{name}'...", end=" ")
    res = request('POST', '/collections', {
        "collection": name,
        "singleton": True,
        "note": "Test Name"
    }, token)
    
    if 'error' in res:
        print(f"❌ {res['status']} {res['body']['errors'][0]['message']}")
    else:
        print("✅ SUCCESS!")
        print(f"🏆 Winner: {name}")
        # Clean up
        request('DELETE', f'/collections/{name}', None, token)
        sys.exit(0)

print("❌ All candidates failed.")
sys.exit(1)
