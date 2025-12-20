import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function addSocialExtras() {
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

        // 2. Add New Fields
        console.log('\n📦 Adding Extra Social Fields...');

        const newFields = [
            { field: 'social_github', icon: 'github', sort: 29 },
            { field: 'social_tiktok', icon: 'video', sort: 30 } // 'video' is a safe fallback for tiktok
        ];

        for (const s of newFields) {
            // Check if exists first to avoid error spam
            const checkRes = await fetch(`${DIRECTUS_URL}/fields/global_settings/${s.field}`, { headers });

            if (checkRes.ok) {
                console.log(`   ⚠️  ${s.field} already exists. Skipping.`);
                continue;
            }

            const res = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    field: s.field,
                    type: 'string',
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
                console.log(`✅ Success: ${s.field} created (Sort ${s.sort}).`);
            }
        }

        console.log('\n🎉 Extras Added: Github & Tiktok.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

addSocialExtras();
