// Check if the collection is accessible
const DIRECTUS_URL = 'http://localhost:8055';

async function test() {
    console.log("🔍 TESTING COLLECTION ACCESS...\n");

    try {
        // 1. Check auth
        const authRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@spead.ai', password: 'password123' })
        });
        const authData = await authRes.json();
        const token = authData.data?.access_token;

        if (!token) {
            console.log("❌ Auth failed");
            return;
        }
        console.log("✓ Auth OK\n");

        // 2. List all collections
        console.log("COLLECTIONS:");
        const colRes = await fetch(`${DIRECTUS_URL}/collections`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const colData = await colRes.json();
        colData.data?.forEach(c => {
            if (!c.collection.startsWith('directus_')) {
                console.log(`  - ${c.collection} (schema: ${c.schema ? 'YES' : 'NO'})`);
            }
        });

        // 3. Check lp_core_radar specifically
        console.log("\nlp_core_radar DETAILS:");
        const radarCol = colData.data?.find(c => c.collection === 'lp_core_radar');
        if (radarCol) {
            console.log("  Collection exists in metadata");
            console.log("  Schema object:", radarCol.schema ? JSON.stringify(radarCol.schema) : 'NULL');
        }

        // 4. Check fields
        console.log("\nlp_core_radar FIELDS:");
        const fieldsRes = await fetch(`${DIRECTUS_URL}/fields/lp_core_radar`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const fieldsData = await fieldsRes.json();
        fieldsData.data?.forEach(f => {
            console.log(`  - ${f.field} (type: ${f.type}, schema: ${f.schema ? 'YES' : 'NO'})`);
        });

        // 5. Try to access items
        console.log("\nACCESSING ITEMS:");
        const itemsRes = await fetch(`${DIRECTUS_URL}/items/lp_core_radar`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`  Status: ${itemsRes.status}`);
        if (!itemsRes.ok) {
            const err = await itemsRes.json();
            console.log(`  Error: ${JSON.stringify(err.errors?.[0]?.message)}`);
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

test();
