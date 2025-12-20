import { createDirectus, rest, staticToken, createCollection, deleteCollection, createField, createItem, createPermission } from '@directus/sdk';

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

async function rebuildClean() {
    console.log("☢️ NUKING & REBUILDING 'lp_silent_killer'...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. DELETE EXISTING (Clean Slate)
        try {
            console.log("   - Deleting old collection...");
            await client.request(deleteCollection('lp_silent_killer'));
            console.log("     (Deleted)");
        } catch (e) {
            console.log("     (Collection didn't exist, proceeding)");
        }

        // Wait a moment for DB sync
        await new Promise(r => setTimeout(r, 1000));

        // 2. CREATE COLLECTION
        console.log("   - Creating fresh Singleton...");
        await client.request(createCollection({
            collection: 'lp_silent_killer',
            schema: {}, // Let Directus handle primary key
            meta: {
                singleton: true,
                hidden: false,
                icon: 'radar',
                note: 'Silent Killer Section',
                sort: 3
            }
        }));

        // 3. CREATE FIELDS (Flat Divider Layout)
        const fields = [
            // Headline
            { field: 'section_headline', type: 'string', meta: { interface: 'input', width: 'full', sort: 1 } },

            // Group 1 Divider
            { field: 'div_1', type: 'alias', meta: { interface: 'presentation-divider', options: { title: 'Financial Leak', icon: 'paid' }, special: ['alias'], width: 'full', sort: 10 }, schema: null },
            { field: 'node_1_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 11 } },
            { field: 'node_1_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 12 } },
            { field: 'node_1_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 13 } },
            { field: 'node_1_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 14, options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_1_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 15, note: 'Type and Enter' } },

            // Group 2 Divider
            { field: 'div_2', type: 'alias', meta: { interface: 'presentation-divider', options: { title: 'Admin Drain', icon: 'schedule' }, special: ['alias'], width: 'full', sort: 20 }, schema: null },
            { field: 'node_2_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 21 } },
            { field: 'node_2_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 22 } },
            { field: 'node_2_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 23 } },
            { field: 'node_2_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 24, options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_2_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 25, note: 'Type and Enter' } },

            // Group 3 Divider
            { field: 'div_3', type: 'alias', meta: { interface: 'presentation-divider', options: { title: 'Critical Liability', icon: 'warning' }, special: ['alias'], width: 'full', sort: 30 }, schema: null },
            { field: 'node_3_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 31 } },
            { field: 'node_3_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 32 } },
            { field: 'node_3_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 33 } },
            { field: 'node_3_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 34, options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_3_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 35, note: 'Type and Enter' } },
        ];

        for (const f of fields) {
            await client.request(createField('lp_silent_killer', f));
        }
        console.log("   - Fields Created.");

        // 4. SEED DATA
        console.log("   - Seeding Data...");
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

        // 5. PERMISSIONS
        await client.request(createPermission({
            role: null,
            collection: 'lp_silent_killer',
            action: 'read',
            fields: ['*']
        })).catch(() => { });

        console.log("✅ REBUILD COMPLETE. IT SHOULD WORK NOW.");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

rebuildClean();
