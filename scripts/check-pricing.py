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

# 1. Login
login = request('POST', '/auth/login', {'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
if 'error' in login:
    print(f"❌ Login Failed: {login}")
    sys.exit(1)

token = login['data']['access_token']

# 2. Fetch Pricing Plans
print("🕵️ Checking 'pricing_plans'...")
res = request('GET', '/items/pricing_plans', None, token)

if 'error' in res:
    if res['status'] == 403:
        print("❌ Permission Denied (403). Collection might be private.")
    elif res['status'] == 404:
        print("❌ Collection 'pricing_plans' NOT FOUND (404).")
    else:
        print(f"❌ Error: {res}")
else:
    data = res['data']
    print(f"✅ Found {len(data)} Pricing Plans.")
    if len(data) == 0:
        print("   ⚠️ Collection is EMPTY.")
    else:
        for item in data:
            print(f"   - {item.get('name')}: {item.get('price')} (Subtitle: {item.get('subtitle')})")
