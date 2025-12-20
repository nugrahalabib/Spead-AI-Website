const { createDirectus, rest, authentication, createField, deleteField, createRelation } = await import('@directus/sdk');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const client = createDirectus(DIRECTUS_URL)
    .with(authentication())
    .with(rest());

async function main() {
    console.log('🖼️  Starting Global Images Fix...');

    // --- Authentication ---
    try {
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.data.access_token;

        client.setToken(token);
        console.log('✅ Authenticated as Admin');
    } catch (e) {
        console.error('❌ Authentication failed:', e.message);
        process.exit(1);
    }

    const fields = ['logo_light', 'logo_dark', 'favicon', 'og_image'];
    const COLLECTION = 'global_settings';

    for (const field of fields) {
        console.log(`\n🔧 Fixing ${field}...`);

        // 1. Delete existing (Try/Catch)
        try {
            await client.request(deleteField(COLLECTION, field));
            console.log(`   🗑️  Deleted old ${field}`);
        } catch (e) {
            console.log(`   ℹ️  Old ${field} not found (or delete failed), proceeding to create.`);
        }

        // 2. Create Field (UUID)
        try {
            await client.request(createField(COLLECTION, {
                field: field,
                type: 'uuid',
                meta: {
                    interface: 'image',
                    special: ['file'],
                    note: 'Upload image (PNG/SVG recommended)',
                    width: 'half'
                },
                schema: {
                    // We define simplistic schema here, relation comes next
                    is_nullable: true
                }
            }));
            console.log(`   ✨ Created field ${field}`);
        } catch (e) {
            console.error(`   ❌ Failed to create field ${field}:`, e.message);
            continue; // Skip relation if field failed
        }

        // 3. Create Relation (The Critical Fix)
        try {
            await client.request(createRelation({
                collection: COLLECTION, // "Many" side (where the FK is)
                field: field,           // The FK column
                related_collection: 'directus_files', // "One" side
                schema: {
                    // Optional constraint settings
                    on_delete: 'SET NULL'
                }
            }));
            console.log(`   🔗 Linked ${field} to directus_files`);
        } catch (e) {
            console.error(`   ❌ Failed to create relation for ${field}:`, e.message);
        }
    }

    console.log('\nFIX COMPLETE: Global Settings images are now connected to File Storage.');
}

main();
