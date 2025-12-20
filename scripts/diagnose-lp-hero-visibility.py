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

print("🔍 Checking 'lp_hero' metadata...")
res = request('GET', '/collections/lp_hero', None, token)

if 'error' in res:
    if res['status'] == 404:
        print("❌ Collection 'lp_hero' DOES NOT EXIST.")
    elif res['status'] == 403:
         print("❌ Access FORBIDDEN (403). It might exist but be hidden from Admin?")
    else:
        print(f"❌ Error: {res}")
else:
    d = res['data']
    print(f"✅ Found 'lp_hero'!")
    print(f"   - singleton: {d.get('singleton')}")
    print(f"   - hidden: {d.get('hidden')}")
    print(f"   - group: {d.get('group')}")
    
    if d.get('hidden') == True:
        print("\n⚠️  Collection is HIDDEN. Attempting to UNHIDE...")
        patch = request('PATCH', '/collections/lp_hero', {'hidden': False}, token)
        if 'error' in patch:
            print(f"   ❌ Failed to unhide: {patch}")
        else:
            print("   ✅ Successfully UNHIDDEN.")
