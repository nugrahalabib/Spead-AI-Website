import urllib.request
import json
import sys

DIRECTUS_URL = 'http://localhost:8055'
ADMIN_EMAIL = 'admin@spead.ai'
ADMIN_PASSWORD = 'password123'

def request(method, endpoint, token=None):
    url = f"{DIRECTUS_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f"Bearer {token}"
    
    try:
        req = urllib.request.Request(url, headers=headers, method=method)
        with urllib.request.urlopen(req) as response:
            if response.status == 204: return {}
            return json.loads(response.read().decode('utf-8'))
    except urllib.request.HTTPError as e:
        return {'error': True, 'status': e.code, 'body': json.loads(e.read().decode('utf-8'))}

# Login
auth = urllib.request.urlopen(urllib.request.Request(
    f"{DIRECTUS_URL}/auth/login",
    data=json.dumps({'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD}).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
))
token = json.loads(auth.read().decode('utf-8'))['data']['access_token']
print("✅ Authenticated")

# Check permissions for global_settings
print("🔎 Checking permissions for 'global_settings'...")
res = request('GET', '/items/directus_permissions?filter[collection][_eq]=global_settings', token)

if 'error' in res:
    print(f"❌ Failed to list permissions: {res}")
else:
    perms = res['data']
    print(f"   Found {len(perms)} permission rules.")
    for p in perms:
        print(f"   - ID: {p['id']}, Role: {p['role']}, Action: {p['action']}")
        
    if len(perms) > 0:
        print("☢️  Deleting found permissions...")
        ids = [p['id'] for p in perms]
        del_res = request('DELETE', '/items/directus_permissions', token) # Batch delete requires body with keys
        # Simple loop delete
        for pid in ids:
            print(f"     Deleting {pid}...", end=" ")
            r = request('DELETE', f"/items/directus_permissions/{pid}", token)
            if 'error' in r:
                print("Failed")
            else:
                print("Success")
