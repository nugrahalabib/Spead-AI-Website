const { createDirectus, rest, authentication, createField, deleteField, updateField } = await import('@directus/sdk');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const client = createDirectus(DIRECTUS_URL)
    .with(authentication())
    .with(rest());

async function main() {
    console.log('🧹 Starting Global Settings Cleanup & Organization...');

    // --- Authentication ---
    try {
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        client.setToken(loginData.data.access_token);
        console.log('✅ Authenticated as Admin');
    } catch (e) {
        console.error('❌ Authentication failed:', e.message);
        process.exit(1);
    }

    const COLLECTION = 'global_settings';

    // 1. Create/Ensure Group Field
    const GROUP_FIELD = 'branding_assets';
    try {
        console.log(`\n📂 Creating Group: ${GROUP_FIELD}...`);
        await client.request(createField(COLLECTION, {
            field: GROUP_FIELD,
            type: 'alias',
            schema: null,
            meta: {
                interface: 'presentation-divider', // or 'group-detail' / 'group-raw'
                special: ['alias', 'no-data', 'group'], // 'group' special type
                display: null,
                readonly: false,
                hidden: false,
                sort: 10, // Place it high up, maybe after basic text fields
                width: 'full',
                translations: null,
                note: null,
                conditions: null,
                required: false,
                group: null, // Root level
                options: {
                    title: 'Branding & Assets',
                    icon: 'brush',
                    color: '#6366f1',
                    marginTop: true
                }
            }
        }));
        console.log(`   ✨ Created group '${GROUP_FIELD}'`);
    } catch (e) {
        // likely already exists
        console.log(`   ℹ️  Group '${GROUP_FIELD}' might already exist: ${e.message}`);
    }

    // 2. Move Fields to Group & Sort
    const fieldsToMove = [
        { field: 'logo_light', sort: 1 },
        { field: 'logo_dark', sort: 2 },
        { field: 'favicon', sort: 3 },
        { field: 'og_image', sort: 4 }
    ];

    for (const item of fieldsToMove) {
        try {
            console.log(`📦 Moving ${item.field} to group...`);
            await client.request(updateField(COLLECTION, item.field, {
                meta: {
                    group: GROUP_FIELD,
                    sort: item.sort,
                    width: 'half' // Ensure they sit side-by-side
                }
            }));
            console.log(`   ✅ Moved & Sorted ${item.field}`);
        } catch (e) {
            console.error(`   ❌ Failed to move ${item.field}: ${e.message}`);
        }
    }

    // 3. Delete Legacy Fields
    const fieldsToDelete = ['website_logo'];
    for (const legacy of fieldsToDelete) {
        try {
            console.log(`🗑️  Deleting legacy field: ${legacy}...`);
            await client.request(deleteField(COLLECTION, legacy));
            console.log(`   ✅ Deleted ${legacy}`);
        } catch (e) {
            console.log(`   ℹ️  ${legacy} not found or already deleted.`);
        }
    }

    console.log('\nCLEANUP & ORGANIZE COMPLETE: Fields are now grouped, sorted, and legacy data removed.');
}

main();
