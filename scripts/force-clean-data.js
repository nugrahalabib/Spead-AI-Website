import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function forceCleanData() {
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

        // 2. Inspect Current Data
        console.log('\n🔍 Inspecting current data...');
        const itemRes = await fetch(`${DIRECTUS_URL}/items/global_settings`, { headers });
        const itemData = await itemRes.json();

        if (itemData.data) {
            console.log('   Current seo_keywords:', JSON.stringify(itemData.data.seo_keywords));
            console.log('   Current social_links:', JSON.stringify(itemData.data.social_links));
        } else {
            console.log('   ❌ Could not fetch global_settings item.');
        }

        // 3. Force Update to Empty Arrays
        console.log('\n🧹 Force-cleaning data to [] (Empty JSON Arrays)...');
        const updateRes = await fetch(`${DIRECTUS_URL}/items/global_settings`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
                seo_keywords: [],
                social_links: []
            })
        });

        if (updateRes.ok) {
            const updated = await updateRes.json();
            console.log('✅ Success! Data reset.');
            console.log('   New seo_keywords:', JSON.stringify(updated.data.seo_keywords));
            console.log('   New social_links:', JSON.stringify(updated.data.social_links));
        } else {
            const err = await updateRes.json();
            console.error(`❌ Failed to update item: ${JSON.stringify(err)}`);
        }

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
    }
}

forceCleanData();
