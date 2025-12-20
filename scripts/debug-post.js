// Debug POST issue - check if it's a singleton endpoint problem
const DIRECTUS_URL = 'http://localhost:8055';

async function debug() {
    console.log("🔍 DEBUGGING POST ISSUE...\n");

    try {
        const authRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@spead.ai', password: 'password123' })
        });
        const { data: { access_token: token } } = await authRes.json();

        // Check if collection is singleton
        console.log("1. Checking collection config:");
        const colRes = await fetch(`${DIRECTUS_URL}/collections/lp_core_radar`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const colData = await colRes.json();
        console.log("   Singleton:", colData.data?.meta?.singleton);
        console.log("   Hidden:", colData.data?.meta?.hidden);

        // Check existing items
        console.log("\n2. Checking existing items (GET):");
        const getRes = await fetch(`${DIRECTUS_URL}/items/lp_core_radar`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const getData = await getRes.json();
        console.log("   Status:", getRes.status);
        console.log("   Items count:", Array.isArray(getData.data) ? getData.data.length : 'N/A (singleton returns object)');
        console.log("   Data:", JSON.stringify(getData.data)?.substring(0, 100));

        // If it's a singleton and data exists, try PATCH instead of POST
        if (colData.data?.meta?.singleton) {
            console.log("\n3. Since it's singleton, trying PATCH to update:");
            const patchRes = await fetch(`${DIRECTUS_URL}/items/lp_core_radar`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    section_headline: "The {Silent Killer:pink} of Enterprise Valuation",
                    node_1_badge: "FINANCIAL LEAK",
                    node_1_title: "IDR 102M",
                    node_1_subtitle: "LOSS PER EMPLOYEE",
                    node_1_chart_type: "bar_chart_decline",
                    node_1_bullets: ["Wasted Billable Hours", "Un-invoiced Overage"],
                    node_2_badge: "ADMIN DRAIN",
                    node_2_title: "40% Time",
                    node_2_subtitle: "NON-BILLABLE WORK",
                    node_2_chart_type: "radial_progress",
                    node_2_bullets: ["Manual Data Entry", "Document Search"],
                    node_3_badge: "CRITICAL LIABILITY",
                    node_3_title: "High Risk",
                    node_3_subtitle: "HUMAN ERROR",
                    node_3_chart_type: "alert_box",
                    node_3_bullets: ["Contract Loopholes", "Missed Clauses"]
                })
            });
            console.log("   PATCH Status:", patchRes.status);
            if (patchRes.ok) {
                console.log("   ✅ PATCH worked!");
            } else {
                const err = await patchRes.json();
                console.log("   ❌ PATCH failed:", JSON.stringify(err.errors?.[0]));
            }
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

debug();
