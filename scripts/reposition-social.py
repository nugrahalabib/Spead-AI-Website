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

# Updates
updates = [
    {'field': 'social_linkedin', 'sort': 26},
    {'field': 'social_twitter', 'sort': 27},
    {'field': 'social_instagram', 'sort': 28}
]

print("\n📦 Repositioning Fields...")
for u in updates:
    payload = {
        "meta": {
            "sort": u['sort']
        }
    }
    res = request('PATCH', f"/fields/global_settings/{u['field']}", payload, token)
    
    if 'error' in res:
        print(f"❌ Failed to move {u['field']}: {res}")
    else:
        print(f"✅ Moved {u['field']} to Sort {u['sort']}")

print("\n🎉 Repositioning Complete.")
