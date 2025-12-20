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

async function createCoreRadar() {
    console.log("🛡️ CREATING 'lp_core_radar' (Fresh & Safe)...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. CLEANUP OLD MESS (Try to delete broken tables)
        const broken = ['lp_silent_killer', 'lp_radar'];
        for (const b of broken) {
            console.log(`   - Removing broken collection: ${b}`);
            try { await client.request(deleteCollection(b)); } catch (e) { }
        }

        // Wait for DB to settle
        await new Promise(r => setTimeout(r, 1000));

        // 2. CREATE NEW COLLECTION
        console.log("   - Creating 'lp_core_radar'...");
        await client.request(createCollection({
            collection: 'lp_core_radar',
            schema: {},
            meta: {
                singleton: true,
                hidden: false,
                icon: 'radar',
                note: 'Silent Killer / Radar Section',
                display_template: '{{section_headline}}',
                sort: 3
            }
        }));

        // 3. CREATE FIELDS (Standard Layout)
        const fields = [
            { field: 'section_headline', type: 'string', meta: { interface: 'input', width: 'full', sort: 1 } },

            // DIVIDERS (Aliases) - They are usually safe.
            { field: 'div_1', type: 'alias', meta: { interface: 'presentation-divider', options: { title: 'Financial Leak', icon: 'paid' }, special: ['alias'], width: 'full', sort: 10 }, schema: null },
            { field: 'div_2', type: 'alias', meta: { interface: 'presentation-divider', options: { title: 'Admin Drain', icon: 'schedule' }, special: ['alias'], width: 'full', sort: 20 }, schema: null },
            { field: 'div_3', type: 'alias', meta: { interface: 'presentation-divider', options: { title: 'Critical Liability', icon: 'warning' }, special: ['alias'], width: 'full', sort: 30 }, schema: null },

            // NODE 1
            { field: 'node_1_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 11 } },
            { field: 'node_1_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 12 } },
            { field: 'node_1_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 13 } },
            { field: 'node_1_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 14, options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            // Using JSON for tags should be fine if table is fresh
            { field: 'node_1_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 15 } },

            // NODE 2
            { field: 'node_2_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 21 } },
            { field: 'node_2_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 22 } },
            { field: 'node_2_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 23 } },
            { field: 'node_2_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 24, options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_2_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 25 } },

            // NODE 3
            { field: 'node_3_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 31 } },
            { field: 'node_3_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 32 } },
            { field: 'node_3_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 33 } },
            { field: 'node_3_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 34, options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_3_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 35 } },
        ];

        console.log("   - Defining Fields...");
        for (const f of fields) {
            await client.request(createField('lp_core_radar', f));
        }

        // 4. SEED DATA
        console.log("   - Seeding Data...");
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

        // 5. PERMISSIONS
        await client.request(createPermission({
            role: null,
            collection: 'lp_core_radar',
            action: 'read',
            fields: ['*']
        })).catch(() => { });

        console.log("✅ DONE. 'lp_core_radar' established.");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

createCoreRadar();
