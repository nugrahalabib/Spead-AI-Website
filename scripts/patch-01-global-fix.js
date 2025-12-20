import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function patchGlobalSettings() {
    try {
        console.log(`🔌 Connecting to Directus at ${DIRECTUS_URL}...`);

        // 1. Authenticate
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const loginData = await loginRes.json();
        const access_token = loginData.data.access_token;

        const headers = {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Authenticated.');

        // =========================================================
        // FIX 1: seo_keywords (Switch from Tags to Repeater)
        // =========================================================
        console.log('\n🔧 Fixing: seo_keywords...');

        // Delete existing field to allow type change (Tags -> JSON List is incompatible usually)
        const delRes = await fetch(`${DIRECTUS_URL}/fields/global_settings/seo_keywords`, {
            method: 'DELETE',
            headers
        });

        if (delRes.ok || delRes.status === 404) {
            console.log('   - Deleted existing seo_keywords (or not found).');
        } else {
            console.error(`   - Failed to delete seo_keywords: ${delRes.status}`);
        }

        // Re-create as JSON List (Repeater)
        const newSeoField = {
            field: 'seo_keywords',
            type: 'json',
            schema: {},
            meta: {
                interface: 'list',
                width: 'half',
                note: 'Add keywords individually',
                options: {
                    addLabel: 'Add Keyword',
                    fields: [
                        {
                            field: 'keyword',
                            type: 'string',
                            name: 'Keyword',
                            meta: {
                                interface: 'input',
                                width: 'full'
                            }
                        }
                    ]
                }
            }
        };

        const createRes = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
            method: 'POST',
            headers,
            body: JSON.stringify(newSeoField)
        });

        if (!createRes.ok) {
            const err = await createRes.json();
            console.error(`❌ Failed to recreate seo_keywords: ${JSON.stringify(err)}`);
        } else {
            console.log('✅ Recreated seo_keywords as Repeater (List).');
        }

        // =========================================================
        // FIX 2: social_links (Force JSON Type compatibility)
        // =========================================================
        console.log('\n🔧 Fixing: social_links...');

        const socialUpdate = {
            type: 'json', // Force type
            schema: {},   // Ensure DB column is JSON
            meta: {
                interface: 'list',
                options: {
                    addLabel: 'Add Social Link',
                    fields: [
                        { field: 'platform', type: 'string', name: 'Platform', meta: { width: 'half', interface: 'input' } },
                        { field: 'url', type: 'string', name: 'URL', meta: { width: 'half', interface: 'input' } },
                        { field: 'icon_name', type: 'string', name: 'Icon Name (Lucide)', meta: { width: 'half', interface: 'input' } }
                    ]
                }
            }
        };

        const patchRes = await fetch(`${DIRECTUS_URL}/fields/global_settings/social_links`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(socialUpdate)
        });

        if (!patchRes.ok) {
            const err = await patchRes.json();
            console.error(`❌ Failed to patch social_links: ${JSON.stringify(err)}`);
        } else {
            console.log('✅ Patched social_links schema.');
        }

        console.log('\n🎉 Patch Complete: SEO Keywords and Social Links fixed.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

patchGlobalSettings();
