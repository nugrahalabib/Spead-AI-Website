import { createDirectus, rest, staticToken, createField, updateField, deleteField } from '@directus/sdk';

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

async function fixLayoutDividers() {
    console.log("📐 Switching to Divider-based Layout (Guaranteed Visibility)...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. UNGROUP EVERYTHING FIRST (Rescue)
        const allFields = [
            'node_1_badge', 'node_1_title', 'node_1_subtitle', 'node_1_chart_type', 'node_1_bullets',
            'node_2_badge', 'node_2_title', 'node_2_subtitle', 'node_2_chart_type', 'node_2_bullets',
            'node_3_badge', 'node_3_title', 'node_3_subtitle', 'node_3_chart_type', 'node_3_bullets'
        ];

        console.log("   - Ungrouping all fields...");
        for (const field of allFields) {
            await client.request(updateField('lp_silent_killer', field, {
                meta: { group: null, hidden: false, width: 'half' }
            }));
        }

        // 2. DELETE OLD GROUPS (Clean up)
        const oldGroups = ['group_node_1', 'group_node_2', 'group_node_3'];
        for (const group of oldGroups) {
            try {
                // await client.request(deleteField('lp_silent_killer', group)); 
                // Commented out delete to be safe, just in case user added something inside we missed (though we ungrouped). 
                // Let's just ignore them or leave them empty. Actually better to delete to avoid confusion.
                // But Directus errors if you delete a field that has children. We ungrouped, so it should be fine.
                console.log(`   - Removing old group wrapper: ${group}`);
                await client.request(deleteField('lp_silent_killer', group));
            } catch (e) {
                // Ignore if not found
            }
        }

        // 3. CREATE DIVIDERS (Visual Separation)
        const dividers = [
            { field: 'divider_node_1', meta: { interface: 'presentation-divider', options: { title: 'Financial Leak (Left)', icon: 'paid' }, special: ['alias'], width: 'full', sort: 10 } },
            { field: 'divider_node_2', meta: { interface: 'presentation-divider', options: { title: 'Admin Drain (Right)', icon: 'schedule' }, special: ['alias'], width: 'full', sort: 20 } },
            { field: 'divider_node_3', meta: { interface: 'presentation-divider', options: { title: 'Critical Liability (Bottom)', icon: 'warning' }, special: ['alias'], width: 'full', sort: 30 } }
        ];

        for (const div of dividers) {
            try {
                await client.request(createField('lp_silent_killer', {
                    field: div.field,
                    type: 'alias',
                    meta: div.meta,
                    schema: null
                }));
                console.log(`   + Created Divider: ${div.meta.options.title}`);
            } catch (e) {
                console.log(`     (Divider ${div.field} exists, updating...)`);
                await client.request(updateField('lp_silent_killer', div.field, { meta: div.meta }));
            }
        }

        // 4. SORT FIELDS UNDER DIVIDERS
        console.log("   - Sorting fields...");

        // Headline at top
        await client.request(updateField('lp_silent_killer', 'section_headline', { meta: { sort: 1 } }));

        // Node 1 (Sort 11-15)
        let i = 11;
        for (const f of allFields.slice(0, 5)) await client.request(updateField('lp_silent_killer', f, { meta: { sort: i++, width: f.includes('bullets') ? 'full' : 'half' } }));

        // Node 2 (Sort 21-25)
        i = 21;
        for (const f of allFields.slice(5, 10)) await client.request(updateField('lp_silent_killer', f, { meta: { sort: i++, width: f.includes('bullets') ? 'full' : 'half' } }));

        // Node 3 (Sort 31-35)
        i = 31;
        for (const f of allFields.slice(10, 15)) await client.request(updateField('lp_silent_killer', f, { meta: { sort: i++, width: f.includes('bullets') ? 'full' : 'half' } }));

        console.log("✅ Layout Fixed: Flat & Organized with Dividers!");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

fixLayoutDividers();
