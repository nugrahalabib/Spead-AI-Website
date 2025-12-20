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

# 2. Promote to Singleton
print("\n🔧 Promoting 'global_settings' to Singleton...")
coll_res = request('PATCH', '/collections/global_settings', {'singleton': True}, token)

if 'error' in coll_res:
    print(f"❌ Failed to promote: {coll_res}")
    sys.exit(1)
else:
    print("✅ Collection updated: singleton = true")

# 3. Clean Data via Singleton Endpoint
print("\n🧹 Cleaning data (seo_keywords, social_links)...")
# Note: Now that it's a singleton, simple PATCH to /items/global_settings works
data_res = request('PATCH', '/items/global_settings', {
    "seo_keywords": [],
    "social_links": []
}, token)

if 'error' in data_res:
    # Fallback: If it doesn't exist yet, try POST (Create)
    if data_res.get('status') == 404 or data_res.get('status') == 403:
         print("   ⚠️  Item Update failed/missing. Trying POST (Create)...")
         create_res = request('POST', '/items/global_settings', {
            "seo_keywords": [],
            "social_links": []
         }, token)
         if 'error' in create_res:
             print(f"❌ Failed to create item: {create_res}")
             sys.exit(1)
         else:
             print("✅ Initial Singleton Item Created.")
    else:
         print(f"❌ Failed to clean data: {data_res}")
         sys.exit(1)
else:
    print("✅ Success! Data reset to [].")
    # Verify return data
    d = data_res.get('data', {})
    print(f"   seo_keywords: {d.get('seo_keywords')}")
    print(f"   social_links: {d.get('social_links')}")

print("\n🎉 REPAIR COMPLETE.")
