import { createDirectus, rest, staticToken, createField, readFields, updateItem, createItem } from '@directus/sdk';

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

async function repairSilentKiller() {
    console.log("🔧 Repairing 'lp_silent_killer' Fields & Data...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. Get Existing Fields
        const existingFields = await client.request(readFields('lp_silent_killer')).catch(() => []);
        const existingNames = existingFields.map(f => f.field);
        console.log("   Found fields:", existingNames.join(', '));

        // 2. Define Missing Fields (Flattened for safety first, then we can group later if needed)
        // We will try to re-create them if missing.
        const requiredFields = [
            // Node 1
            { field: 'node_1_badge', type: 'string', meta: { interface: 'input', width: 'half', note: 'Group 1' } },
            { field: 'node_1_title', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_1_subtitle', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_1_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', options: { choices: [{ text: 'Bar Chart Decline', value: 'bar_chart_decline' }, { text: 'Radial Progress', value: 'radial_progress' }, { text: 'Alert Box', value: 'alert_box' }] } } },
            { field: 'node_1_bullets', type: 'json', meta: { interface: 'list', width: 'full' } },

            // Node 2
            { field: 'node_2_badge', type: 'string', meta: { interface: 'input', width: 'half', note: 'Group 2' } },
            { field: 'node_2_title', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_2_subtitle', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_2_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', options: { choices: [{ text: 'Bar Chart Decline', value: 'bar_chart_decline' }, { text: 'Radial Progress', value: 'radial_progress' }, { text: 'Alert Box', value: 'alert_box' }] } } },
            { field: 'node_2_bullets', type: 'json', meta: { interface: 'list', width: 'full' } },

            // Node 3
            { field: 'node_3_badge', type: 'string', meta: { interface: 'input', width: 'half', note: 'Group 3' } },
            { field: 'node_3_title', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_3_subtitle', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_3_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', options: { choices: [{ text: 'Bar Chart Decline', value: 'bar_chart_decline' }, { text: 'Radial Progress', value: 'radial_progress' }, { text: 'Alert Box', value: 'alert_box' }] } } },
            { field: 'node_3_bullets', type: 'json', meta: { interface: 'list', width: 'full' } },
        ];

        for (const field of requiredFields) {
            if (!existingNames.includes(field.field)) {
                console.log(`   + Re-creating: ${field.field}`);
                await client.request(createField('lp_silent_killer', field));
            }
        }

        // 3. SEED DATA (Crucial so it's not empty)
        console.log("🌱 Seeding Content...");
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

        // Check if singleton has a row (ID 1 usually) or create it
        // Note: Singletons are just a collection. Often user needs to create the first item.
        // We will try to update ID=1, if fail, create.
        try {
            await client.request(updateItem('lp_silent_killer', 1, defaultData));
            console.log("   ✅ Data Updated (Row 1)");
        } catch (e) {
            console.log("   ⚠️ Row not found, creating new...");
            await client.request(createItem('lp_silent_killer', defaultData));
            console.log("   ✅ Data Created");
        }

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

repairSilentKiller();
