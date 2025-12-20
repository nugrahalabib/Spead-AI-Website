// Check field configuration for lp_core_radar
const DIRECTUS_URL = 'http://localhost:8055';

async function checkFields() {
    console.log("🔍 CHECKING lp_core_radar FIELD CONFIGURATION...\n");

    try {
        const authRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@spead.ai', password: 'password123' })
        });
        const { data: { access_token: token } } = await authRes.json();

        // Get all fields
        const fieldsRes = await fetch(`${DIRECTUS_URL}/fields/lp_core_radar`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const fieldsData = await fieldsRes.json();

        console.log("FIELDS CONFIGURATION:");
        fieldsData.data?.forEach(f => {
            if (f.field.includes('chart') || f.field.includes('bullet')) {
                console.log(`\n📌 ${f.field}:`);
                console.log(`   Type: ${f.type}`);
                console.log(`   Interface: ${f.meta?.interface || 'NONE'}`);
                console.log(`   Special: ${f.meta?.special ? JSON.stringify(f.meta.special) : 'NONE'}`);
                console.log(`   Options: ${f.meta?.options ? JSON.stringify(f.meta.options) : 'NONE'}`);
                console.log(`   Schema: ${f.schema ? 'YES' : 'NO'}`);
            }
        });

    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkFields();
