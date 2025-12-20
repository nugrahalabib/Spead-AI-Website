import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function setupLpHero() {
    try {
        console.log(`🔌 Connecting to Directus at ${DIRECTUS_URL}...`);

        // 1. Authenticate
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const access_token = (await loginRes.json()).data.access_token;
        const headers = {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Authenticated.');

        // 2. Get Public Role ID
        const rolesRes = await fetch(`${DIRECTUS_URL}/roles`, { headers });
        const rolesData = await rolesRes.json();
        const publicRole = rolesData.data.find(r => r.name === 'Public') || { id: null }; // Public role is usually null, but let's check
        // Actually, creating a permission with role: null targets Public.
        console.log('ℹ️  Public Role ID:', publicRole.id); // likely null or a uuid

        // 3. Create Collection (Singleton)
        console.log('\n📦 Checking/Creating lp_hero...');
        // Check if exists
        const checkRes = await fetch(`${DIRECTUS_URL}/collections/lp_hero`, { headers });
        if (checkRes.status === 404) {
            const collRes = await fetch(`${DIRECTUS_URL}/collections`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    collection: 'lp_hero',
                    schema: {}, // <--- CRITICAL FIX
                    singleton: true,
                    note: 'Landing Page Hero Section',
                    sort: 2
                })
            });
            if (!collRes.ok) throw new Error(`Failed to create collection: ${collRes.status}`);
            console.log('   - Created lp_hero');
        } else {
            console.log('   - lp_hero already exists.');
        }

        // 4. Create Fields
        console.log('\n🏗️  Creating Fields...');

        // Helper to create field
        async function createField(payload) {
            // Check existence first to prevent 409
            const check = await fetch(`${DIRECTUS_URL}/fields/lp_hero/${payload.field}`, { headers });
            if (check.ok) {
                console.log(`   - ${payload.field} exists.`);
                return;
            }

            const res = await fetch(`${DIRECTUS_URL}/fields/lp_hero`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                console.error(`   ❌ Failed ${payload.field}:`, JSON.stringify(err));
            } else {
                console.log(`   ✅ Created ${payload.field}`);
            }
        }

        // --- GROUP 1: Main Copy ---
        await createField({
            field: 'div_main_copy',
            type: 'alias',
            meta: { interface: 'presentation-divider', options: { title: 'Main Copy' }, sort: 1, special: ['alias', 'no-data'] }
        });
        await createField({
            field: 'badge_text', type: 'string',
            meta: { interface: 'input', sort: 2, width: 'half', note: 'e.g. Enterprise V2.0' }
        });
        await createField({
            field: 'headline_prefix', type: 'string',
            meta: { interface: 'input', sort: 3, width: 'half', note: 'e.g. Stop Burning' }
        });
        await createField({
            field: 'headline_gradient', type: 'string',
            meta: { interface: 'input', sort: 4, width: 'half', note: 'e.g. Billable Hours' }
        });
        await createField({
            field: 'subheadline', type: 'text',
            meta: { interface: 'textarea', sort: 5, width: 'full', note: 'Descriptive text' }
        });

        // --- GROUP 2: CTA ---
        await createField({
            field: 'div_cta',
            type: 'alias',
            meta: { interface: 'presentation-divider', options: { title: 'Call to Actions' }, sort: 10, special: ['alias', 'no-data'] }
        });
        await createField({
            field: 'cta_primary_label', type: 'string',
            meta: { interface: 'input', sort: 11, width: 'half' }
        });
        await createField({
            field: 'cta_primary_url', type: 'string',
            meta: { interface: 'input', sort: 12, width: 'half' }
        });
        await createField({
            field: 'cta_secondary_label', type: 'string',
            meta: { interface: 'input', sort: 13, width: 'half' }
        });
        await createField({
            field: 'cta_secondary_url', type: 'string',
            meta: { interface: 'input', sort: 14, width: 'half' }
        });

        // --- GROUP 3: Visuals ---
        await createField({
            field: 'div_visuals',
            type: 'alias',
            meta: { interface: 'presentation-divider', options: { title: 'Visuals' }, sort: 20, special: ['alias', 'no-data'] }
        });

        // Image Field needs generic setup usually to just work as an ID holder
        // But for true image interface we need relation.
        // Step A: Create field
        await createField({
            field: 'hero_visual',
            type: 'uuid',
            schema: { is_primary_key: false }, // Basic schema
            meta: {
                interface: 'image',
                sort: 21,
                width: 'full',
                note: '3D Artifact Image'
            }
        });

        // Step B: Create Relation (lp_hero.hero_visual -> directus_files.id)
        // Check if relation exists? Hard to check directly easily, just try create and ignore error
        console.log('   🔗 Linking Image Relation...');
        const relRes = await fetch(`${DIRECTUS_URL}/relations`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                collection: 'lp_hero',
                field: 'hero_visual',
                related_collection: 'directus_files',
                schema: {
                    constraint_name: 'lp_hero_hero_visual_foreign' // Explicit constraint name to avoid collisions
                }
            })
        });
        if (relRes.ok) console.log('   ✅ Relation created.');
        else console.log('   ⚠️ Relation might already exist or failed.');

        // 5. Set Public Permissions 
        console.log('\n🔓 Setting Public Permissions...');
        // Check if exists
        const permCheck = await fetch(`${DIRECTUS_URL}/permissions?filter[role][_null]=true&filter[collection][_eq]=lp_hero`, { headers });
        const permData = await permCheck.json();

        if (permData.data && permData.data.length > 0) {
            console.log('   - Public permission already exists.');
        } else {
            const permRes = await fetch(`${DIRECTUS_URL}/permissions`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    role: null, // Public
                    collection: 'lp_hero',
                    action: 'read',
                    fields: ['*']
                })
            });
            if (permRes.ok) console.log('   ✅ Public Read access granted.');
            else console.error('   ❌ Failed to set permissions:', await permRes.text());
        }

        console.log('\n🎉 Setup Complete: Hero Section Admin Panel created.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

setupLpHero();
