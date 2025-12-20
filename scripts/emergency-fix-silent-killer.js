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

async function emergencyFix() {
    console.log("🚨 Emergency Fix: Silent Killer Visibility & Data...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. FORCE GROUPS OPEN & VISIBLE
        const groups = ['group_node_1', 'group_node_2', 'group_node_3'];
        for (const group of groups) {
            console.log(`   - Opening Group: ${group}`);
            await client.request(updateField('lp_silent_killer', group, {
                meta: {
                    hidden: false,
                    interface: 'group-detail',
                    options: { startOpen: true } // Force accordion open
                }
            }));
        }

        // 2. FORCE FIELDS VISIBLE
        const fields = [
            'node_1_badge', 'node_1_title', 'node_1_subtitle', 'node_1_chart_type', 'node_1_bullets',
            'node_2_badge', 'node_2_title', 'node_2_subtitle', 'node_2_chart_type', 'node_2_bullets',
            'node_3_badge', 'node_3_title', 'node_3_subtitle', 'node_3_chart_type', 'node_3_bullets'
        ];

        for (const field of fields) {
            // console.log(`   - Unhiding: ${field}`);
            await client.request(updateField('lp_silent_killer', field, {
                meta: { hidden: false }
            }));
        }

        // 3. FORCE RE-SEED DATA (Just to be 100% sure)
        console.log("🌱 Re-injecting Data...");
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
        console.log("✅ Data Re-injected & Groups Forced Open!");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

emergencyFix();
