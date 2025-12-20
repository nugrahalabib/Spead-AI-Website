import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function verifyLpHero() {
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

        // 2. List Fields
        console.log('\n🔍 Listing Fields for lp_hero...');
        const res = await fetch(`${DIRECTUS_URL}/fields/lp_hero`, { headers });
        const data = await res.json();

        if (!res.ok) {
            console.error('❌ Failed to list fields:', JSON.stringify(data));
            process.exit(1);
        }

        const fields = data.data.map(f => ({
            field: f.field,
            type: f.type,
            interface: f.meta?.interface,
            sort: f.meta?.sort
        })).sort((a, b) => (a.sort || 999) - (b.sort || 999));

        console.table(fields);

        // Check for specific fields
        const missing = ['badge_text', 'div_main_copy', 'div_cta', 'div_visuals', 'hero_visual']
            .filter(req => !fields.find(f => f.field === req));

        if (missing.length > 0) {
            console.error('\n❌ MISSING FIELDS:', missing.join(', '));
            process.exit(1);
        } else {
            console.log('\n✅ ALL REQUIRED FIELDS PRESENT.');
        }

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

verifyLpHero();
