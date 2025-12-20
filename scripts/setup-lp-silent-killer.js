import { createDirectus, rest, staticToken, createCollection, createField, createPermission, readCollections, updateCollection } from '@directus/sdk';

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

async function setupSilentKiller() {
    console.log("🚀 Setting up 'lp_silent_killer' Singleton...");

    try {
        const token = await getAuthToken();
        if (!token) throw new Error("Authentication failed");

        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. Check if collection exists
        const collections = await client.request(readCollections());
        const exists = collections.some(c => c.collection === 'lp_silent_killer');

        if (!exists) {
            console.log("📦 Creating Collection 'lp_silent_killer'...");
            await client.request(createCollection({
                collection: 'lp_silent_killer',
                schema: {},
                meta: {
                    singleton: true,
                    hidden: false,
                    icon: 'radar',
                    note: 'Problem Agitation Section (Radar)',
                    display_template: '{{section_headline}}',
                    sort: 3
                }
            }));
        } else {
            console.log("ℹ️ Collection already exists. Updating meta...");
            await client.request(updateCollection('lp_silent_killer', {
                meta: { singleton: true, hidden: false, icon: 'radar', sort: 3 }
            }));
        }

        // 2. Create Fields
        const fields = [
            // A. Global
            { field: 'section_headline', type: 'text', meta: { interface: 'input', display: 'raw', width: 'full', note: 'Use {Text:Color} syntax.' } },

            // B. Node 1 (Left - Financial)
            { field: 'group_node_1', type: 'alias', meta: { interface: 'group-detail', special: ['group'], width: 'full' }, schema: null },
            { field: 'node_1_badge', type: 'string', meta: { interface: 'input', width: 'half', group: 'group_node_1' } },
            { field: 'node_1_title', type: 'string', meta: { interface: 'input', width: 'half', group: 'group_node_1' } },
            { field: 'node_1_subtitle', type: 'string', meta: { interface: 'input', width: 'half', group: 'group_node_1' } },
            { field: 'node_1_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', group: 'group_node_1', options: { choices: [{ text: 'Bar Chart Decline', value: 'bar_chart_decline' }, { text: 'Radial Progress', value: 'radial_progress' }, { text: 'Alert Box', value: 'alert_box' }] } } },
            { field: 'node_1_bullets', type: 'json', meta: { interface: 'list', width: 'full', group: 'group_node_1' } },

            // C. Node 2 (Right - Admin)
            { field: 'group_node_2', type: 'alias', meta: { interface: 'group-detail', special: ['group'], width: 'full' }, schema: null },
            { field: 'node_2_badge', type: 'string', meta: { interface: 'input', width: 'half', group: 'group_node_2' } },
            { field: 'node_2_title', type: 'string', meta: { interface: 'input', width: 'half', group: 'group_node_2' } },
            { field: 'node_2_subtitle', type: 'string', meta: { interface: 'input', width: 'half', group: 'group_node_2' } },
            { field: 'node_2_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', group: 'group_node_2', options: { choices: [{ text: 'Bar Chart Decline', value: 'bar_chart_decline' }, { text: 'Radial Progress', value: 'radial_progress' }, { text: 'Alert Box', value: 'alert_box' }] } } },
            { field: 'node_2_bullets', type: 'json', meta: { interface: 'list', width: 'full', group: 'group_node_2' } },

            // D. Node 3 (Bottom - Liability)
            { field: 'group_node_3', type: 'alias', meta: { interface: 'group-detail', special: ['group'], width: 'full' }, schema: null },
            { field: 'node_3_badge', type: 'string', meta: { interface: 'input', width: 'half', group: 'group_node_3' } },
            { field: 'node_3_title', type: 'string', meta: { interface: 'input', width: 'half', group: 'group_node_3' } },
            { field: 'node_3_subtitle', type: 'string', meta: { interface: 'input', width: 'half', group: 'group_node_3' } },
            { field: 'node_3_chart_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', group: 'group_node_3', options: { choices: [{ text: 'Bar Chart Decline', value: 'bar_chart_decline' }, { text: 'Radial Progress', value: 'radial_progress' }, { text: 'Alert Box', value: 'alert_box' }] } } },
            { field: 'node_3_bullets', type: 'json', meta: { interface: 'list', width: 'full', group: 'group_node_3' } },
        ];

        console.log("🔧 Configuring Fields...");
        for (const field of fields) {
            try {
                await client.request(createField('lp_silent_killer', field));
                console.log(`   + Field created: ${field.field}`);
            } catch (err) {
                if (err?.errors?.[0]?.extensions?.code === 'FIELD_DUPLICATE') {
                    // console.log(`   = Field exists: ${field.field}`);
                } else {
                    console.error(`   ! Error creating ${field.field}:`, err.message);
                }
            }
        }

        // 3. Permissions (Public Read)
        console.log("🔓 Configuring Public Access...");
        await client.request(createPermission({
            role: null,
            collection: 'lp_silent_killer',
            action: 'read',
            fields: ['*']
        })).catch(() => console.log("   = Permission likely exists"));

        console.log("✅ SETUP COMPLETE! 'lp_silent_killer' is ready.");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

setupSilentKiller();
