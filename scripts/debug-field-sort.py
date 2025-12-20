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

# Get Fields
res = request('GET', '/fields/global_settings', None, token)
if 'error' in res:
    print(res)
    sys.exit(1)

fields = res['data']
print(f"{'Field':<25} | {'Type':<10} | {'Sort':<5} | {'Group'}")
print("-" * 60)
for f in sorted(fields, key=lambda x: x['meta']['sort'] if x['meta'] and x['meta']['sort'] else 999):
    sort = f['meta']['sort'] if f['meta'] else 'N/A'
    group = f['meta']['group'] if f['meta'] else 'None'
    print(f"{f['field']:<25} | {f['type']:<10} | {sort:<5} | {group}")
