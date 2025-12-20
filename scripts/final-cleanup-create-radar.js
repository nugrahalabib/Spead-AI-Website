import { createDirectus, rest, staticToken, deleteCollection, createCollection, createField, createItem, createPermission, updateCollection } from '@directus/sdk';

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

async function cleanAndCreate() {
    console.log("🧹 FINAL CLEANUP & CREATE 'lp_core_radar'...");

    try {
        const token = await getAuthToken();
        if (!token) {
            console.error("❌ Failed to get auth token. Is Directus running?");
            return;
        }
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. DELETE ALL BROKEN COLLECTIONS
        const toDelete = [
            'lp_silent_killer',
            'lp_radar',
            'lp_core_radar',
            'section_radar',
            'radar_section'
        ];

        console.log("   1. Deleting broken collections...");
        for (const col of toDelete) {
            try {
                await client.request(deleteCollection(col));
                console.log(`      ✓ Deleted: ${col}`);
            } catch (e) {
                console.log(`      - Skipped: ${col} (not found)`);
            }
        }

        // Wait for DB to settle
        await new Promise(r => setTimeout(r, 2000));

        // 2. CREATE SINGLE CLEAN COLLECTION: lp_core_radar
        console.log("   2. Creating 'lp_core_radar'...");
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

        // 3. CREATE FIELDS WITH GROUPS (Dividers for organization)
        console.log("   3. Creating fields with groups...");

        // Section Headline
        await client.request(createField('lp_core_radar', {
            field: 'section_headline',
            type: 'string',
            meta: { interface: 'input', width: 'full', sort: 1, note: 'Use {Text:Color} syntax' }
        }));

        // Group 1: Financial Leak
        await client.request(createField('lp_core_radar', {
            field: 'group_financial',
            type: 'alias',
            schema: null,
            meta: {
                interface: 'group-detail',
                special: ['alias', 'group'],
                options: { start: 'open' },
                width: 'full',
                sort: 10
            }
        }));
        await client.request(createField('lp_core_radar', { field: 'node_1_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 11, group: 'group_financial' } }));
        await client.request(createField('lp_core_radar', { field: 'node_1_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 12, group: 'group_financial' } }));
        await client.request(createField('lp_core_radar', { field: 'node_1_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 13, group: 'group_financial' } }));
        await client.request(createField('lp_core_radar', { field: 'node_1_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 14, group: 'group_financial', options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } }));
        await client.request(createField('lp_core_radar', { field: 'node_1_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 15, group: 'group_financial' } }));

        // Group 2: Admin Drain
        await client.request(createField('lp_core_radar', {
            field: 'group_admin',
            type: 'alias',
            schema: null,
            meta: {
                interface: 'group-detail',
                special: ['alias', 'group'],
                options: { start: 'open' },
                width: 'full',
                sort: 20
            }
        }));
        await client.request(createField('lp_core_radar', { field: 'node_2_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 21, group: 'group_admin' } }));
        await client.request(createField('lp_core_radar', { field: 'node_2_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 22, group: 'group_admin' } }));
        await client.request(createField('lp_core_radar', { field: 'node_2_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 23, group: 'group_admin' } }));
        await client.request(createField('lp_core_radar', { field: 'node_2_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 24, group: 'group_admin', options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } }));
        await client.request(createField('lp_core_radar', { field: 'node_2_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 25, group: 'group_admin' } }));

        // Group 3: Critical Liability
        await client.request(createField('lp_core_radar', {
            field: 'group_liability',
            type: 'alias',
            schema: null,
            meta: {
                interface: 'group-detail',
                special: ['alias', 'group'],
                options: { start: 'open' },
                width: 'full',
                sort: 30
            }
        }));
        await client.request(createField('lp_core_radar', { field: 'node_3_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 31, group: 'group_liability' } }));
        await client.request(createField('lp_core_radar', { field: 'node_3_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 32, group: 'group_liability' } }));
        await client.request(createField('lp_core_radar', { field: 'node_3_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 33, group: 'group_liability' } }));
        await client.request(createField('lp_core_radar', { field: 'node_3_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', sort: 34, group: 'group_liability', options: { choices: [{ text: 'Bar Chart', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } }));
        await client.request(createField('lp_core_radar', { field: 'node_3_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 35, group: 'group_liability' } }));

        // 4. SEED DATA
        console.log("   4. Seeding default data...");
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

        // 5. SET PERMISSIONS
        console.log("   5. Setting public read permissions...");
        await client.request(createPermission({
            role: null,
            collection: 'lp_core_radar',
            action: 'read',
            fields: ['*']
        })).catch(() => { });

        console.log("\n✅ SUCCESS! 'lp_core_radar' created with grouped fields and data.");
        console.log("   Please refresh Directus to see the collection.");

    } catch (e) {
        console.error("❌ Error:", e.message || e);
    }
}

cleanAndCreate();
