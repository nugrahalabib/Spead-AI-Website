import { createDirectus, rest, staticToken, createField, updateField } from '@directus/sdk';

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

async function regroupSilentKiller() {
    console.log("🗂️ Regrouping 'lp_silent_killer' Fields...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. Ensure Group Fields Exist (Aliases)
        const groups = [
            { field: 'group_node_1', meta: { interface: 'group-detail', special: ['group'], width: 'full', note: 'Financial Leak (Left)' } },
            { field: 'group_node_2', meta: { interface: 'group-detail', special: ['group'], width: 'full', note: 'Admin Drain (Right)' } },
            { field: 'group_node_3', meta: { interface: 'group-detail', special: ['group'], width: 'full', note: 'Critical Liability (Bottom)' } }
        ];

        for (const group of groups) {
            try {
                console.log(`   + Creating Group: ${group.field}`);
                await client.request(createField('lp_silent_killer', {
                    field: group.field,
                    type: 'alias',
                    meta: group.meta,
                    schema: null // Important for alias
                }));
            } catch (e) {
                console.log(`     (Group ${group.field} likely exists, updating meta...)`);
                await client.request(updateField('lp_silent_killer', group.field, { meta: group.meta }));
            }
        }

        // 2. Assign Fields to Groups
        const assignments = {
            'group_node_1': ['node_1_badge', 'node_1_title', 'node_1_subtitle', 'node_1_chart_type', 'node_1_bullets'],
            'group_node_2': ['node_2_badge', 'node_2_title', 'node_2_subtitle', 'node_2_chart_type', 'node_2_bullets'],
            'group_node_3': ['node_3_badge', 'node_3_title', 'node_3_subtitle', 'node_3_chart_type', 'node_3_bullets']
        };

        for (const [groupName, fields] of Object.entries(assignments)) {
            console.log(`   > Moving text fields into ${groupName}...`);
            for (const field of fields) {
                await client.request(updateField('lp_silent_killer', field, {
                    meta: {
                        group: groupName,
                        width: 'half' // Keep them side-by-side inside the group
                    }
                }));
            }
            // Bullets full width for better UX
            await client.request(updateField('lp_silent_killer', fields[4], { meta: { width: 'full' } }));
        }

        console.log("✅ Regrouping Complete! Check Directus.");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

regroupSilentKiller();
