import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function fixGlobalUiStrategy() {
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

        // 2. Delete Old Fields
        console.log('\n🗑️  Deleting fields to prepare for UI switch...');
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

        // 3. Create seo_keywords (Interface: TAGS)
        console.log('\n📦 Creating seo_keywords (Interface: TAGS)...');
        const seoRes = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                field: 'seo_keywords',
                type: 'json',
                schema: {},
                meta: {
                    interface: 'tags',  // <--- KEY CHANGE
                    special: null,
                    sort: 5,
                    width: 'half',
                    note: 'Type keyword and hit Enter',
                    options: {
                        placeholder: 'Add keyword...'
                    }
                }
            })
        });

        if (!seoRes.ok) {
            const err = await seoRes.json();
            console.error(`❌ Failed seo_keywords: ${JSON.stringify(err)}`);
        } else {
            console.log('✅ Success: seo_keywords created as TAGS.');
        }

        // 4. Create social_links (Interface: LIST - Fresh Start)
        console.log('\n📦 Creating social_links (Interface: LIST)...');
        const socialRes = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                field: 'social_links',
                type: 'json',
                schema: {},
                meta: {
                    interface: 'list',
                    special: null,
                    sort: 20,
                    width: 'full',
                    note: 'Social Media Links',
                    options: {
                        addLabel: 'Add Social Link',
                        fields: [
                            { field: 'platform', type: 'string', name: 'Platform', meta: { width: 'half', interface: 'input' } },
                            { field: 'url', type: 'string', name: 'URL', meta: { width: 'half', interface: 'input' } }
                        ]
                    }
                }
            })
        });

        if (!socialRes.ok) {
            const err = await socialRes.json();
            console.error(`❌ Failed social_links: ${JSON.stringify(err)}`);
        } else {
            console.log('✅ Success: social_links created as LIST.');
        }

        console.log('\n🎉 UI Strategy Updated: SEO Keywords is now Tags.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

fixGlobalUiStrategy();
