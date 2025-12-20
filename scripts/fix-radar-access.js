import { createDirectus, rest, staticToken, updateCollection, readItems, createItem } from '@directus/sdk';

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

async function fixRadarAccess() {
    console.log("🔓 UNLOCKING 'lp_core_radar' (Switching to List Mode)...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. DEMOTE TO LIST (Safe Mode)
        console.log("   - Disabling Singleton Mode...");
        await client.request(updateCollection('lp_core_radar', {
            meta: {
                singleton: false, // OFF
                hidden: false,
                icon: 'radar',
                note: 'Silent Killer Data (Click item to edit)',
                sort: 3
            }
        }));

        // 2. ENSURE DATA EXISTS
        const items = await client.request(readItems('lp_core_radar')).catch(() => []);
        if (items.length === 0) {
            console.log("   - Data missing! Creating default row...");
            await client.request(createItem('lp_core_radar', {
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
            }));
            console.log("   ✅ Default Data Created.");
        } else {
            console.log("   ✅ Data already exists (Rows: " + items.length + ")");
        }

        console.log("🏁 FIXED. Please Refresh Directus and click 'Lp Core Radar'. You will see a list.");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

fixRadarAccess();
