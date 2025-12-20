import { createDirectus, rest, staticToken, createItem } from '@directus/sdk';

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

async function seedData() {
    console.log("🌱 SEEDING DATA INTO 'lp_core_radar'...");

    try {
        const token = await getAuthToken();
        if (!token) {
            console.error("❌ Failed to get auth token");
            return;
        }
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        await client.request(createItem('lp_core_radar', {
            section_headline: "The {Silent Killer:pink} of Enterprise Valuation",

            node_1_badge: "FINANCIAL LEAK",
            node_1_title: "IDR 102M",
            node_1_subtitle: "LOSS PER EMPLOYEE / YR",
            node_1_chart_type: "bar_chart_decline",
            node_1_bullets: ["Wasted Billable Hours", "Un-invoiced Overage", "Revenue Leakage"],

            node_2_badge: "ADMIN DRAIN",
            node_2_title: "40% Time",
            node_2_subtitle: "NON-BILLABLE WORK",
            node_2_chart_type: "radial_progress",
            node_2_bullets: ["Manual Data Entry", "Document Search", "Formatting & Reports"],

            node_3_badge: "CRITICAL LIABILITY",
            node_3_title: "High Risk",
            node_3_subtitle: "HUMAN ERROR",
            node_3_chart_type: "alert_box",
            node_3_bullets: ["Contract Loopholes", "Missed Clauses", "Compliance Failures"]
        }));

        console.log("✅ DATA SEEDED SUCCESSFULLY!");

    } catch (e) {
        console.error("❌ Error:", e.message || e);
    }
}

seedData();
