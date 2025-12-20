import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function setupLpHeroMaster() {
    try {
        console.log(`🔌 Connecting to Directus at ${DIRECTUS_URL}...`);

        // 1. Authenticate
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const token = (await loginRes.json()).data.access_token;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Authenticated.');

        // 2. Ensure Collection Exists
        console.log('\n📦 Checking Collection lp_hero...');
        const checkColl = await fetch(`${DIRECTUS_URL}/collections/lp_hero`, { headers });
        if (checkColl.status === 404) {
            console.log('   - Not found. Creating...');
            const createColl = await fetch(`${DIRECTUS_URL}/collections`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    collection: 'lp_hero',
                    schema: {},
                    singleton: true,
                    note: 'Landing Page Hero Section',
                    meta: { icon: 'rocket', sort: 2 }
                })
            });
            if (!createColl.ok) throw new Error(`Failed to create collection: ${await createColl.text()}`);
            console.log('   ✅ Created lp_hero');
        } else {
            console.log('   - Collection exists.');
        }

        // 3. Define Master Field List
        const fields = [
            // --- Group 1: Badge & Headline ---
            {
                field: 'div_group_1', type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Badge & Headline' }, sort: 1, special: ['alias', 'no-data'] }
            },
            {
                field: 'badge_show_pulse', type: 'boolean',
                meta: { interface: 'boolean', sort: 2, width: 'half', note: "Show Green Pulse Dot", options: { label: "Active" } },
                schema: { default_value: true }
            },
            {
                field: 'badge_text', type: 'string',
                meta: { interface: 'input', sort: 3, width: 'half', note: "e.g. ENTERPRISE V2.0 LIVE" }
            },
            {
                field: 'hero_headline', type: 'text',
                meta: {
                    interface: 'input-multiline', sort: 4, width: 'full',
                    note: "Magic Syntax: Wrap text in { } for color. Options: {Word} (Default), {Word:red}, {Word:gold}, {Word:blue}. Use Enter for line breaks."
                }
            },

            // --- Group 2: Subheadline & Visuals ---
            {
                field: 'div_group_2', type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Subheadline & Visuals' }, sort: 10, special: ['alias', 'no-data'] }
            },
            {
                field: 'subheadline', type: 'text',
                meta: { interface: 'input-multiline', sort: 11, width: 'full' }
            },
            {
                field: 'hero_visual', type: 'string',
                meta: {
                    interface: 'select-dropdown', sort: 12, width: 'full',
                    note: "Select the 3D element to display.",
                    options: {
                        choices: [
                            { text: "3D Dashboard Mockup (Current)", value: "dashboard_tilt_v1" },
                            { text: "Flat Interface View", value: "dashboard_flat" },
                            { text: "Abstract Glass Cards", value: "abstract_glass" }
                        ]
                    }
                },
                schema: { default_value: "dashboard_tilt_v1" }
            },

            // --- Group 3: Primary Button ---
            {
                field: 'div_group_3', type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Primary Button (Start Functioning)' }, sort: 20, special: ['alias', 'no-data'] }
            },
            {
                field: 'cta_primary_label', type: 'string',
                meta: { interface: 'input', sort: 21, width: 'half' }
            },
            {
                field: 'cta_primary_url', type: 'string',
                meta: { interface: 'input', sort: 22, width: 'half' }
            },
            {
                field: 'cta_primary_icon', type: 'string',
                meta: { interface: 'icon', sort: 23, width: 'full' }
            },

            // --- Group 4: Secondary Button ---
            {
                field: 'div_group_4', type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Secondary Button (Book Demo)' }, sort: 30, special: ['alias', 'no-data'] }
            },
            {
                field: 'cta_secondary_label', type: 'string',
                meta: { interface: 'input', sort: 31, width: 'half' }
            },
            {
                field: 'cta_secondary_url', type: 'string',
                meta: { interface: 'input', sort: 32, width: 'half' }
            },
            {
                field: 'cta_secondary_icon', type: 'string',
                meta: { interface: 'icon', sort: 33, width: 'full' }
            }
        ];

        // 4. Create/Update Fields
        console.log('\n🏗️  Applying Master Schema Fields...');

        for (const f of fields) {
            // Check if exists
            const check = await fetch(`${DIRECTUS_URL}/fields/lp_hero/${f.field}`, { headers });

            if (check.ok) {
                // Update (PATCH) to ensure Meta is correct
                console.log(`   - Updating ${f.field}...`);
                await fetch(`${DIRECTUS_URL}/fields/lp_hero/${f.field}`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({
                        meta: f.meta,
                        schema: f.schema // Update schema (defaults) if needed
                    })
                });
            } else {
                // Create (POST)
                console.log(`   - Creating ${f.field}...`);
                const res = await fetch(`${DIRECTUS_URL}/fields/lp_hero`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        field: f.field,
                        type: f.type,
                        meta: f.meta,
                        schema: f.schema || {}
                    })
                });
                if (!res.ok) {
                    console.error(`     ❌ Failed: ${await res.text()}`);
                }
            }
        }

        // 5. Cleanup Obsolete Fields
        console.log('\n🗑️  Cleaning up obsolete fields...');
        const validNames = fields.map(f => f.field);
        // Also keep system fields just in case, though usually hidden from /fields endpoint unless specified?
        // Actually /fields/lp_hero returns user fields usually.
        // Let's be manual for safety based on previous iterations.
        const obsolete = [
            'headline_prefix', 'headline_gradient', // Old split headline
            'div_main_copy', 'div_cta', 'div_visuals', // Old dividers
            // 'hero_visual' wasuuid, new is string. DIRECTUS MIGHT ERROR ON TYPE CHANGE via PATCH.
            // If hero_visual exists as UUID, we must delete it first.
        ];

        // Check hero_visual type
        const checkVis = await fetch(`${DIRECTUS_URL}/fields/lp_hero/hero_visual`, { headers });
        if (checkVis.ok) {
            const visData = await checkVis.json();
            if (visData.data.type === 'uuid') {
                console.log('   ⚠️  Found hero_visual as UUID (Old). Deleting to replace with String...');
                await fetch(`${DIRECTUS_URL}/fields/lp_hero/hero_visual`, { method: 'DELETE', headers });
                // It will be re-created in the loop above? No, loop happened already.
                // Uh oh. Loop order matters.
                // RE-RUN FIELD LOOP for hero_visual specifically if we deleted it?
                // Better strategy: run cleanup BEFORE creation?
                // But we need to know what to keep.
            }
        }

        for (const obs of obsolete) {
            const del = await fetch(`${DIRECTUS_URL}/fields/lp_hero/${obs}`, { method: 'DELETE', headers });
            if (del.ok) console.log(`   - Deleted ${obs}`);
        }

        // Re-run hero_visual creation just in case it was deleted
        const visDef = fields.find(x => x.field === 'hero_visual');
        const checkVis2 = await fetch(`${DIRECTUS_URL}/fields/lp_hero/hero_visual`, { headers });
        if (!checkVis2.ok) {
            console.log('   - Re-creating hero_visual (String)...');
            await fetch(`${DIRECTUS_URL}/fields/lp_hero`, {
                method: 'POST', headers, body: JSON.stringify({
                    field: visDef.field, type: visDef.type, meta: visDef.meta, schema: visDef.schema
                })
            });
        }


        // 6. Public Access
        console.log('\n🔓 Ensuring Public Access...');
        const permRes = await fetch(`${DIRECTUS_URL}/permissions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                role: null,
                collection: 'lp_hero',
                action: 'read',
                fields: ['*']
            })
        });
        if (permRes.ok) console.log('   ✅ Public Read granted.');
        else console.log('   - Permission likely already exists.');

        console.log('\n🎉 LP Hero Master Schema Built Successfully.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

setupLpHeroMaster();
