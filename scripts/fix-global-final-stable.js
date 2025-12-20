import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function fixGlobalFinalStable() {
    try {
        console.log(`🔌 Connecting to Directus at ${DIRECTUS_URL}...`);

        // 1. Authenticate
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const access_token = (await loginRes.json()).data.access_token;
        const headers = {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Authenticated.');

        // 2. Delete Old Fields (Cleanup)
        console.log('\n🗑️  Cleaning up old fields...');
        const fieldsToDelete = ['seo_keywords', 'social_links'];
        for (const f of fieldsToDelete) {
            const res = await fetch(`${DIRECTUS_URL}/fields/global_settings/${f}`, {
                method: 'DELETE',
                headers
            });
            if (res.ok) console.log(`   - Deleted ${f}`);
            else if (res.status === 404) console.log(`   - ${f} already gone.`);
            else console.log(`   - Error deleting ${f}: ${res.status}`);
        }

        // 3. Create seo_keywords (Type: CSV, Interface: TAGS)
        console.log('\n📦 Creating seo_keywords (Type: CSV, Interface: TAGS)...');
        const seoRes = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                field: 'seo_keywords',
                type: 'csv', // <--- STABLE FOR SQLITE
                schema: {},
                meta: {
                    interface: 'tags',
                    special: ['cast-csv'], // Helper for array-like behavior
                    sort: 5,
                    width: 'half',
                    note: 'Press Enter to add tags',
                    options: {
                        placeholder: 'Add keyword...'
                    }
                }
            })
        });

        if (!seoRes.ok) {
            console.error(`❌ Failed seo_keywords: ${JSON.stringify(await seoRes.json())}`);
        } else {
            console.log('✅ Success: seo_keywords created (CSV).');
        }

        // 4. Create Fixed Social Fields
        console.log('\n📦 Creating Fixed Social Fields...');

        const socialFields = [
            { field: 'social_linkedin', icon: 'linkedin', sort: 20 },
            { field: 'social_twitter', icon: 'twitter', sort: 21 },
            { field: 'social_instagram', icon: 'instagram', sort: 22 }
        ];

        for (const s of socialFields) {
            const res = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    field: s.field,
                    type: 'string', // Simple String
                    schema: {},
                    meta: {
                        interface: 'input',
                        sort: s.sort,
                        width: 'half',
                        icon: s.icon,
                        note: `${s.field.replace('social_', '')} URL`
                    }
                })
            });

            if (!res.ok) {
                console.error(`❌ Failed ${s.field}: ${JSON.stringify(await res.json())}`);
            } else {
                console.log(`✅ Success: ${s.field} created.`);
            }
        }

        console.log('\n🎉 STABLE FIX COMPLETE: CSV Tags + Fixed Strings.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

fixGlobalFinalStable();
