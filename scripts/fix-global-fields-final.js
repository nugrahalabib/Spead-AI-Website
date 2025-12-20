import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function fixGlobalFieldsFinal() {
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
        // DELETE FIELDS
        // =========================================================
        console.log('\n🗑️  Deleting old fields...');

        const fieldsToDelete = ['seo_keywords', 'social_links'];
        for (const field of fieldsToDelete) {
            const delRes = await fetch(`${DIRECTUS_URL}/fields/global_settings/${field}`, {
                method: 'DELETE',
                headers
            });
            if (delRes.ok) console.log(`   - Deleted ${field}`);
            else if (delRes.status === 404) console.log(`   - ${field} not found (already clean)`);
            else console.error(`   - Failed to delete ${field}: ${delRes.status}`);
        }

        // =========================================================
        // CREATE: seo_keywords (Sort: 5)
        // =========================================================
        console.log('\n📦 Re-Creating: seo_keywords (JSON Repeater, Sort: 5)...');

        const seoField = {
            field: 'seo_keywords',
            type: 'json', // CRITICAL: Must be json
            schema: {},
            meta: {
                interface: 'list', // Repeater
                width: 'half',
                sort: 5, // Position under SEO divider
                note: 'Add keywords one by one',
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

        const seoRes = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
            method: 'POST',
            headers,
            body: JSON.stringify(seoField)
        });

        if (!seoRes.ok) {
            const err = await seoRes.json();
            console.error(`❌ Failed to create seo_keywords: ${JSON.stringify(err)}`);
        } else {
            console.log('✅ Created seo_keywords');
        }

        // =========================================================
        // CREATE: social_links (Sort: 20)
        // =========================================================
        console.log('\n📦 Re-Creating: social_links (JSON Repeater, Sort: 20)...');

        const socialField = {
            field: 'social_links',
            type: 'json', // CRITICAL: Must be json
            schema: {},
            meta: {
                interface: 'list', // Repeater
                width: 'full',
                sort: 20, // Position at bottom
                note: 'Social Media Links',
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

        const socialRes = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
            method: 'POST',
            headers,
            body: JSON.stringify(socialField)
        });

        if (!socialRes.ok) {
            const err = await socialRes.json();
            console.error(`❌ Failed to create social_links: ${JSON.stringify(err)}`);
        } else {
            console.log('✅ Created social_links');
        }

        console.log('\n🎉 Repair Complete: Fields re-created with Type JSON.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

fixGlobalFieldsFinal();
