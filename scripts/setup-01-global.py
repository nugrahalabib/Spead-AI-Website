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
    
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 204:
                return {}
            return json.loads(response.read().decode('utf-8'))
    except urllib.request.HTTPError as e:
        # Return error/status to caller for handling
        return {'error': True, 'status': e.code, 'body': json.loads(e.read().decode('utf-8'))}
    except Exception as e:
        return {'error': True, 'message': str(e)}

def setup():
    print(f"🔌 Connecting to Directus at {DIRECTUS_URL}...")
    
    # 1. Login
    login_res = request('POST', '/auth/login', {'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
    if 'error' in login_res:
        print(f"❌ Login failed: {login_res}")
        sys.exit(1)
        
    token = login_res['data']['access_token']
    print("✅ Authenticated.")
    
    # 2. Check & Create Collection (Idempotent via List)
    print("🔎 Checking if global_settings exists (via list)...")
    list_res = request('GET', '/collections', None, token)
    
    if 'error' in list_res:
        print(f"❌ Failed to list collections: {list_res}")
        sys.exit(1)
        
    existing_collections = [c['collection'] for c in list_res['data']]
    
    if 'global_settings' in existing_collections:
        print("⚠️  Collection global_settings already exists. Skipping creation.")
    else:
        # Only create if it truly doesn't exist
        print("📦 Creating collection: global_settings...")
        coll_data = {
            "collection": "global_settings",
            "singleton": True,
            "schema": {},
            "meta": {
                "note": "Site-wide configuration for SEO, Branding, and Integrations."
            }
        }
        coll_res = request('POST', '/collections', coll_data, token)
        
        if 'error' in coll_res:
             if coll_res.get('status') == 409:
                 print("⚠️  Collection existed (Conflict). Proceeding.")
             else:
                 print(f"❌ Failed to create collection: {coll_res}")
                 sys.exit(1)
        else:
            print("✅ Collection created.")

    # 3. Create Fields
    fields = [
            # --- GROUP 1: BRAND IDENTITY ---
            {
                "field": "divider_brand",
                "type": "alias",
                "meta": { "interface": "presentation-divider", "options": { "title": "Brand Identity", "icon": "fingerprint" }, "special": ["alias", "no-data"] },
                "schema": None
            },
            {
                "field": "site_name",
                "type": "string",
                "meta": { "interface": "input", "width": "half", "note": "Official brand name (e.g. Spead AI)" },
                "schema": {}
            },
            {
                "field": "site_tagline",
                "type": "string",
                "meta": { "interface": "input", "width": "half", "note": "Short catchphrase" },
                "schema": {}
            },
            {
                "field": "logo_light",
                "type": "uuid",
                "meta": { "interface": "file-image", "width": "half", "note": "Logo for Light Mode (Dark text)" },
                "schema": { 
                    "foreign_key_table": "directus_files", 
                    "foreign_key_column": "id",
                    "on_delete": "SET NULL" 
                }
            },
            {
                "field": "logo_dark",
                "type": "uuid",
                "meta": { "interface": "file-image", "width": "half", "note": "Logo for Dark Mode (Light text)" },
                "schema": { "foreign_key_table": "directus_files", "on_delete": "SET NULL" }
            },
            {
                "field": "favicon",
                "type": "uuid",
                "meta": { "interface": "file-image", "width": "half", "note": "Browser tab icon" },
                "schema": { "foreign_key_table": "directus_files", "on_delete": "SET NULL" }
            },
            {
                "field": "brand_color_primary",
                "type": "string",
                "meta": { "interface": "color", "width": "half", "note": "HEX code override" },
                "schema": {}
            },

            # --- GROUP 2: SEO & GEO ---
            {
                "field": "divider_seo",
                "type": "alias",
                "meta": { "interface": "presentation-divider", "options": { "title": "SEO & Knowledge Graph", "icon": "search" }, "special": ["alias", "no-data"] },
                "schema": None
            },
            {
                "field": "seo_title_template",
                "type": "string",
                "meta": { "interface": "input", "width": "half", "note": "e.g. '%s | Spead AI'" },
                "schema": {}
            },
            {
                "field": "seo_keywords",
                "type": "json",
                "meta": { "interface": "tags", "width": "half", "note": "Default keywords" },
                "schema": {}
            },
            {
                "field": "seo_description_default",
                "type": "text",
                "meta": { "interface": "textarea", "width": "full", "note": "Fallback meta description" },
                "schema": {}
            },
            {
                "field": "og_image_default",
                "type": "uuid",
                "meta": { "interface": "file-image", "width": "full", "note": "Default social sharing image" },
                "schema": { "foreign_key_table": "directus_files", "on_delete": "SET NULL" }
            },
            {
                "field": "knowledge_graph_json",
                "type": "json",
                "meta": { "interface": "input-code", "options": { "language": "json" }, "width": "full", "note": "About data optimized for LLM indexing." },
                "schema": {}
            },
            {
                "field": "organization_schema_json",
                "type": "json",
                "meta": { "interface": "input-code", "options": { "language": "json" }, "width": "full", "note": "Schema.org JSON-LD." },
                "schema": {}
            },

            # --- GROUP 3: CONTACT & LEGAL ---
            {
                "field": "divider_contact",
                "type": "alias",
                "meta": { "interface": "presentation-divider", "options": { "title": "Contact & Legal", "icon": "gavel" }, "special": ["alias", "no-data"] },
                "schema": None
            },
            {
                "field": "contact_email",
                "type": "string",
                "meta": { "interface": "input", "width": "half" },
                "schema": {}
            },
            {
                "field": "support_email",
                "type": "string",
                "meta": { "interface": "input", "width": "half" },
                "schema": {}
            },
            {
                "field": "business_address",
                "type": "text",
                "meta": { "interface": "textarea", "width": "full", "note": "Address for Local SEO" },
                "schema": {}
            },
            {
                "field": "copyright_text",
                "type": "string",
                "meta": { "interface": "input", "width": "full", "note": "e.g. '© 2025 Spead AI Inc.'" },
                "schema": {}
            },

            # --- GROUP 4: INTEGRATIONS ---
            {
                "field": "divider_tech",
                "type": "alias",
                "meta": { "interface": "presentation-divider", "options": { "title": "Technical Integrations", "icon": "code" }, "special": ["alias", "no-data"] },
                "schema": None
            },
            {
                "field": "google_analytics_id",
                "type": "string",
                "meta": { "interface": "input", "width": "half", "note": "G-XXXXXXXX" },
                "schema": {}
            },
            {
                "field": "custom_head_scripts",
                "type": "text",
                "meta": { "interface": "input-code", "options": { "language": "html" }, "width": "full", "note": "Hooks into <head>" },
                "schema": {}
            },
            {
                "field": "custom_body_scripts",
                "type": "text",
                "meta": { "interface": "input-code", "options": { "language": "html" }, "width": "full", "note": "Hooks into end of <body>" },
                "schema": {}
            },

             # --- GROUP 5: SOCIAL ---
             {
                "field": "divider_social",
                "type": "alias",
                "meta": { "interface": "presentation-divider", "options": { "title": "Social Media", "icon": "share" }, "special": ["alias", "no-data"] },
                "schema": None
            },
            {
                "field": "social_links",
                "type": "json",
                "meta": { 
                    "interface": "list", 
                    "width": "full",
                    "options": {
                        "fields": [
                            { "field": "platform", "type": "string", "name": "Platform", "meta": { "width": "half", "interface": "input" }},
                            { "field": "url", "type": "string", "name": "URL", "meta": { "width": "half", "interface": "input" }},
                            { "field": "icon_name", "type": "string", "name": "Icon Name (Lucide)", "meta": { "width": "half", "interface": "input" }}
                        ]
                    }
                },
                "schema": {}
            }
    ]

    print(f"\n🛠️  Processing {len(fields)} fields...")
    success_count = 0
    fail_count = 0

    for field in fields:
        fname = field['field']
        print(f"   - Field: {fname}...", end=" ", flush=True)
        
        # Method 1: Try Create
        res = request('POST', '/fields/global_settings', field, token)
        
        if 'error' in res:
            if res.get('status') == 409:
                # Method 2: Try Update (PATCH)
                 patch_res = request('PATCH', f"/fields/global_settings/{fname}", field, token)
                 if 'error' in patch_res:
                     print(f"⚠️  Existed (Update Failed: {patch_res['body']['errors'][0]['message']})")
                 else:
                     print("⚠️  Existed (Updated)")
                     success_count += 1
            else:
                print("❌ Failed")
                # print(res)
                fail_count += 1
        else:
            print("✅ Created")
            success_count += 1

    # 4. Updates Permissions
    print("\n🔓 Updating permissions (Public Read)...")
    perm_res = request('POST', '/permissions', {
        "role": None, 
        "collection": "global_settings",
        "action": "read",
        "fields": ["*"]
    }, token)
    
    if 'error' in perm_res:
        # Check if already exists?
        print(f"   Note: {perm_res['body']['errors'][0]['message']}")
    else:
        print("✅ Public read access enabled.")

    # 5. Verify
    print("\n🔎 Verifying Schema...")
    verify_res = request('GET', '/fields/global_settings', None, token)
    if 'error' in verify_res:
        print(f"❌ Verification fetch failed: {verify_res}")
        sys.exit(1)
        
    existing_fields = [f['field'] for f in verify_res['data']]
    print(f"   Found {len(existing_fields)} fields.")
    
    missing = [f['field'] for f in fields if f['field'] not in existing_fields]
    
    if missing:
        print(f"\n❌ CRITICAL: Missing fields: {', '.join(missing)}")
        sys.exit(1)
    else:
        print("\n✅ VERIFICATION PASSED: All fields present.")
        print("🎉 Global Settings Setup COMPLETE.")

if __name__ == "__main__":
    setup()
