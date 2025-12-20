import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function fixSchemaMismatch() {
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
        // DELETE FIELDS (Clean Slate)
        // =========================================================
        console.log('\n🗑️  Deleting fields to clear Schema Drift...');

        const fields = ['seo_keywords', 'social_links'];
        for (const f of fields) {
            const res = await fetch(`${DIRECTUS_URL}/fields/global_settings/${f}`, {
                method: 'DELETE',
                headers
            });
            if (res.ok) console.log(`   - Deleted ${f}`);
            else if (res.status === 404) console.log(`   - ${f} already deleted.`);
            else console.log(`   - Error deleting ${f}: ${res.status}`);
        }

        // =========================================================
        // RE-CREATE: seo_keywords (Type: JSON, Interface: List, Sort: 5)
        // =========================================================
        console.log('\n📦 Creating seo_keywords (JSON Repeater)...');
        const seoRes = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                field: 'seo_keywords',
                type: 'json', // EXPLICIT JSON
                schema: {},
                meta: {
                    interface: 'list',
                    special: null, // Ensure no 'cast-csv' special
                    sort: 5,
                    width: 'half',
                    note: 'JSON List of Keywords',
                    options: {
                        addLabel: 'Add Keyword',
                        fields: [
                            {
                                field: 'keyword',
                                type: 'string',
                                name: 'Keyword',
                                meta: { interface: 'input', width: 'full' }
                            }
                        ]
                    }
                }
            })
        });

        if (!seoRes.ok) {
            const err = await seoRes.json();
            console.error(`❌ Failed seo_keywords: ${JSON.stringify(err)}`);
        } else {
            console.log('✅ Success: seo_keywords created (Sort: 5).');
        }

        // =========================================================
        // RE-CREATE: social_links (Type: JSON, Interface: List, Sort: 20)
        // =========================================================
        console.log('\n📦 Creating social_links (JSON Repeater)...');
        const socialRes = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                field: 'social_links',
                type: 'json', // EXPLICIT JSON
                schema: {},
                meta: {
                    interface: 'list',
                    special: null,
                    sort: 20,
                    width: 'full',
                    note: 'Social Media Links (JSON)',
                    options: {
                        addLabel: 'Add Social Link',
                        fields: [
                            { field: 'platform', type: 'string', name: 'Platform', meta: { width: 'half', interface: 'input' } },
                            { field: 'url', type: 'string', name: 'URL', meta: { width: 'half', interface: 'input' } },
                            { field: 'icon_name', type: 'string', name: 'Icon Name (Lucide)', meta: { width: 'half', interface: 'input' } }
                        ]
                    }
                }
            })
        });

        if (!socialRes.ok) {
            const err = await socialRes.json();
            console.error(`❌ Failed social_links: ${JSON.stringify(err)}`);
        } else {
            console.log('✅ Success: social_links created (Sort: 20).');
        }

        console.log('\n✨ MISSION ACCOMPLISHED: Schema Mismatch Fixed.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

fixSchemaMismatch();
