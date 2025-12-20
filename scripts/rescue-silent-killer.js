import { createDirectus, rest, staticToken, updateField, updateSingleton } from '@directus/sdk';

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

async function rescueSilentKiller() {
    console.log("🚑 Rescuing 'lp_silent_killer' (Ungrouping & Seeding)...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        const fieldsToRescue = [
            'node_1_badge', 'node_1_title', 'node_1_subtitle', 'node_1_chart_type', 'node_1_bullets',
            'node_2_badge', 'node_2_title', 'node_2_subtitle', 'node_2_chart_type', 'node_2_bullets',
            'node_3_badge', 'node_3_title', 'node_3_subtitle', 'node_3_chart_type', 'node_3_bullets'
        ];

        // 1. UNGROUP FIELDS (Bring to Top Level)
        for (const field of fieldsToRescue) {
            console.log(`   - Ungrouping: ${field}`);
            try {
                await client.request(updateField('lp_silent_killer', field, {
                    meta: {
                        group: null, // BREAK FREE FROM GROUP
                        hidden: false,
                        width: 'half',
                        interface: field.includes('chart') ? 'select-dropdown' : (field.includes('bullets') ? 'list' : 'input')
                    }
                }));
            } catch (e) {
                console.log(`     (Skipped/Error on ${field})`);
            }
        }

        // 2. SEED DATA (Force Update Singleton)
        console.log("🌱 Seeding Data...");
        const defaultData = {
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
        };

        await client.request(updateSingleton('lp_silent_killer', defaultData));
        console.log("✅ Data Seeded Successfully via updateSingleton!");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

rescueSilentKiller();
