// Diagnostic script - check what collections exist
const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
    const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@spead.ai', password: 'password123' })
    });
    const data = await response.json();
    return data.data?.access_token;
}

async function diagnose() {
    console.log("🔍 DIAGNOSING DIRECTUS STATE...\n");

    try {
        const token = await getAuthToken();
        if (!token) {
            console.error("❌ Cannot authenticate. Is Directus running?");
            return;
        }

        // 1. Check all collections
        console.log("1. EXISTING COLLECTIONS:");
        const colResponse = await fetch(`${DIRECTUS_URL}/collections`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const colData = await colResponse.json();

        if (colData.data) {
            colData.data.forEach(col => {
                if (!col.collection.startsWith('directus_')) {
                    console.log(`   - ${col.collection} ${col.meta?.singleton ? '(singleton)' : '(list)'}`);
                }
            });
        }

        // 2. Check for any radar-related tables
        console.log("\n2. RADAR-RELATED COLLECTIONS:");
        const radarCols = colData.data?.filter(c =>
            c.collection.includes('radar') ||
            c.collection.includes('silent') ||
            c.collection.includes('section')
        ) || [];

        if (radarCols.length === 0) {
            console.log("   None found!");
        } else {
            radarCols.forEach(col => console.log(`   - ${col.collection}`));
        }

        // 3. Try to access lp_core_radar directly
        console.log("\n3. TESTING lp_core_radar ACCESS:");
        const testResponse = await fetch(`${DIRECTUS_URL}/items/lp_core_radar`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`   Status: ${testResponse.status} ${testResponse.statusText}`);

        if (!testResponse.ok) {
            const errorData = await testResponse.json();
            console.log(`   Error: ${JSON.stringify(errorData.errors?.[0]?.message || errorData)}`);
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

diagnose();
