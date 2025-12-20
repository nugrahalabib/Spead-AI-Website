import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function verifyGlobalSettings() {
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

        // 2. Check Collection
        const collRes = await fetch(`${DIRECTUS_URL}/collections/global_settings`, { headers });
        if (collRes.status === 404) {
            console.error('❌ Collection global_settings DOES NOT EXIST.');
            process.exit(1);
        } else if (!collRes.ok) {
            console.error('❌ Failed to fetch collection info.');
            process.exit(1);
        } else {
            console.log('✅ Collection global_settings found.');
        }

        // 3. fetch Fields
        const fieldsRes = await fetch(`${DIRECTUS_URL}/fields/global_settings`, { headers });
        const fieldsData = await fieldsRes.json();
        const existingFields = fieldsData.data.map(f => f.field);

        console.log(`\n🔎 Found ${existingFields.length} fields total.`);

        // Expected fields
        const expected = [
            'site_name', 'site_tagline', 'logo_light', 'logo_dark', 'favicon', 'brand_color_primary',
            'seo_title_template', 'seo_keywords', 'seo_description_default', 'og_image_default',
            'knowledge_graph_json', 'organization_schema_json',
            'contact_email', 'support_email', 'business_address', 'copyright_text',
            'google_analytics_id', 'custom_head_scripts', 'custom_body_scripts',
            'social_links'
        ];

        const missing = expected.filter(f => !existingFields.includes(f));

        if (missing.length > 0) {
            console.error('\n❌ MISSING FIELDS:');
            missing.forEach(f => console.error(`   - ${f}`));
            console.log('\n⚠️  Setup is INCOMPLETE.');
        } else {
            console.log('\n✅ ALL REQUIRED FIELDS ARE PRESENT.');
            console.log('   (site_name, seo_*, contact_*, etc.)');
        }

    } catch (err) {
        console.error('\n❌ Verification failed:', err.message);
    }
}

verifyGlobalSettings();
