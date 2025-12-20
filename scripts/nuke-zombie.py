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

# NUKE IT
print("☢️  Nuking 'global_settings' from system tables...")
# Delete from directus_collections using primary key (collection name)
res = request('DELETE', '/items/directus_collections/global_settings', token)

if 'error' in res:
    if res['status'] == 404: # Doesn't exist? Good.
         print("⚠️  Not found (already clean).")
    else:
         print(f"❌ Failed to nuke: {res}")
         sys.exit(1)
else:
    print("✅ Nuke successful. Zombie record deleted.")

print("✨ Ready for fresh setup.")
