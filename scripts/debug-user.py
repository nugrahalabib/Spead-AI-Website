import urllib.request
import json

DIRECTUS_URL = 'http://localhost:8055'
ADMIN_EMAIL = 'admin@spead.ai'
ADMIN_PASSWORD = 'password123'

def request(method, endpoint, token=None):
    url = f"{DIRECTUS_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f"Bearer {token}"
    
    req = urllib.request.Request(url, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.request.HTTPError as e:
        return {'error': True, 'status': e.code, 'body': json.loads(e.read().decode('utf-8'))}

def debug():
    print("--- DEBUGGING DIRECTUS USER ---")
    
    # Login
    auth_res = urllib.request.urlopen(urllib.request.Request(
        f"{DIRECTUS_URL}/auth/login",
        data=json.dumps({'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD}).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    ))
    auth_data = json.loads(auth_res.read().decode('utf-8'))
    token = auth_data['data']['access_token']
    print("✅ Authenticated")

    # Who am I?
    me_res = request('GET', '/users/me?fields=*,role.*', token)
    if 'error' in me_res:
         print(f"❌ Failed to get /users/me: {me_res}")
    else:
         role = me_res['data']['role']
         print(f"👤 User: {me_res['data']['email']}")
         print(f"🛡️  Role: {role['name'] if role else 'NULL'} (Admin Access: {role['admin_access'] if role else 'N/A'})")

    # Collections?
    coll_res = request('GET', '/collections', token)
    if 'error' in coll_res:
        print(f"❌ Failed to list collections: {coll_res}")
    else:
        colls = [c['collection'] for c in coll_res['data']]
        print(f"📚 Collections ({len(colls)}): {', '.join(colls)}")
        
        if 'global_settings' in colls:
            print("⚠️  global_settings EXISTS in list.")

debug()
