import { createDirectus, rest, staticToken, createCollection, deleteCollection, createField, createItem, updateCollection, readItems } from '@directus/sdk';

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

async function absoluteFix() {
    console.log("☢️ STARTING ABSOLUTE DB REPAIR FOR 'lp_silent_killer'...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. DELETE EXISTING (Attempt to clear SQLite schema)
        console.log("   1. Deleting Corrupted Collection...");
        try {
            await client.request(deleteCollection('lp_silent_killer'));
            console.log("      (Deleted)");
        } catch (e) {
            console.log("      (Not found or already deleted)");
        }

        // Wait for SQLite to breathe
        await new Promise(r => setTimeout(r, 2000));

        // 2. CREATE FRESH COLLECTION (Standard first to verify table creation)
        console.log("   2. Creating New Table...");
        await client.request(createCollection({
            collection: 'lp_silent_killer',
            schema: {}, // Force DB table creation
            meta: {
                singleton: false, // Start as List to be safe
                hidden: false,
                icon: 'radar',
                note: 'Silent Killer Data',
                sort: 3
            }
        }));

        // 3. ADD FIELDS (One by one to ensure columns are created)
        const fields = [
            // Headline
            { field: 'section_headline', type: 'string', meta: { interface: 'input', width: 'full', sort: 1 } },

            // Group 1 Divider
            { field: 'div_1', type: 'alias', meta: { interface: 'presentation-divider', options: { title: 'Financial Leak', icon: 'paid' }, special: ['alias'], width: 'full', sort: 10 }, schema: null },
            { field: 'node_1_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 11 } },
            { field: 'node_1_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 12 } },
            { field: 'node_1_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 13 } },
            { field: 'node_1_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 14, options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_1_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 15 } },

            // Group 2 Divider
            { field: 'div_2', type: 'alias', meta: { interface: 'presentation-divider', options: { title: 'Admin Drain', icon: 'schedule' }, special: ['alias'], width: 'full', sort: 20 }, schema: null },
            { field: 'node_2_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 21 } },
            { field: 'node_2_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 22 } },
            { field: 'node_2_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 23 } },
            { field: 'node_2_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 24, options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_2_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 25 } },

            // Group 3 Divider
            { field: 'div_3', type: 'alias', meta: { interface: 'presentation-divider', options: { title: 'Critical Liability', icon: 'warning' }, special: ['alias'], width: 'full', sort: 30 }, schema: null },
            { field: 'node_3_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 31 } },
            { field: 'node_3_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 32 } },
            { field: 'node_3_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 33 } },
            { field: 'node_3_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 34, options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_3_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 35 } },
        ];

        console.log("   3. Defining Schema...");
        for (const f of fields) {
            await client.request(createField('lp_silent_killer', f));
        }

        // 4. TEST INSERT (Verify SQLite works)
        console.log("   4. Testing Write Access...");
        await client.request(createItem('lp_silent_killer', {
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

        // 5. CONVERT TO SINGLETON (Optional, but user prefers it)
        // Actually, let's keep it as a LIST for now to stop the "Page Not Found" loop risk.
        // If the user wants singleton later, we can flip the switch.
        // But the previous error was SQLITE_ERROR which is worse.
        // Let's keep it as LIST (singleton: false) but limit: 1 in frontend.
        console.log("   ✅ REPAIR COMPLETE. Collection is active as a clean LIST.");
        console.log("   Please refresh Directus. You should see 1 item in the list.");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

absoluteFix();
