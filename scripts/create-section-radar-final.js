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

async function createSafeRadar() {
    console.log("🛡️ CREATING 'section_radar' (Safe Name)...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. CLEANUP (Just in case)
        try { await client.request(deleteCollection('section_radar')); } catch (e) { }

        // Wait for connection
        await new Promise(r => setTimeout(r, 1000));

        // 2. CREATE COLLECTION
        console.log("   - Creating Collection (List Mode for Safety)...");
        await client.request(createCollection({
            collection: 'section_radar',
            schema: {}, // Auto-create ID
            meta: {
                singleton: false, // OFF to prevent 404
                hidden: false,
                icon: 'radar',
                note: 'Radar Section Content',
                sort: 3
            }
        }));

        // 3. CREATE FIELDS
        // Group Dividers
        const groups = [
            { field: 'div_1', meta: { interface: 'presentation-divider', options: { title: 'Financial Leak', icon: 'paid' }, special: ['alias'], width: 'full' } },
            { field: 'div_2', meta: { interface: 'presentation-divider', options: { title: 'Admin Drain', icon: 'schedule' }, special: ['alias'], width: 'full' } },
            { field: 'div_3', meta: { interface: 'presentation-divider', options: { title: 'Critical Liability', icon: 'warning' }, special: ['alias'], width: 'full' } }
        ];

        // Data Fields
        const fields = [
            { field: 'section_headline', type: 'string', meta: { interface: 'input', width: 'full', sort: 1 } },

            // Node 1
            { field: 'node_1_badge', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_1_title', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_1_subtitle', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_1_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', options: { choices: [{ text: 'Bar', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_1_bullets', type: 'json', meta: { interface: 'tags', width: 'full' } },

            // Node 2
            { field: 'node_2_badge', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_2_title', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_2_subtitle', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_2_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', options: { choices: [{ text: 'Bar', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_2_bullets', type: 'json', meta: { interface: 'tags', width: 'full' } },

            // Node 3
            { field: 'node_3_badge', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_3_title', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_3_subtitle', type: 'string', meta: { interface: 'input', width: 'half' } },
            { field: 'node_3_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', options: { choices: [{ text: 'Bar', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_3_bullets', type: 'json', meta: { interface: 'tags', width: 'full' } },
        ];

        console.log("   - Creating Fields...");

        // Headlines & Dividers
        await client.request(createField('section_radar', fields[0])); // Headline
        await client.request(createField('section_radar', { ...groups[0], type: 'alias', schema: null }));
        // Node 1 fields
        for (let i = 1; i <= 5; i++) await client.request(createField('section_radar', fields[i]));

        await client.request(createField('section_radar', { ...groups[1], type: 'alias', schema: null }));
        // Node 2 fields
        for (let i = 6; i <= 10; i++) await client.request(createField('section_radar', fields[i]));

        await client.request(createField('section_radar', { ...groups[2], type: 'alias', schema: null }));
        // Node 3 fields
        for (let i = 11; i <= 15; i++) await client.request(createField('section_radar', fields[i]));

        // 4. SEED DATA
        console.log("   - Seeding Data...");
        await client.request(createItem('section_radar', {
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
            collection: 'section_radar',
            action: 'read',
            fields: ['*']
        }));

        console.log("✅ 'section_radar' CREATED & SEEDED.");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

createSafeRadar();
