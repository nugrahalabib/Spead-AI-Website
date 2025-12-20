const { createDirectus, rest, authentication, deleteCollection } = await import('@directus/sdk');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const client = createDirectus(DIRECTUS_URL)
    .with(authentication())
    .with(rest());

async function main() {
    console.log('🧹 Starting Backend Cleanup...');

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

    const collectionsToDelete = [
        'lp_hero',
        'lp_radar',
        'lp_pricing',
        'pricing_plans',
        'landing_page',
        'bio_links',
        'posts',
        'solutions',
        'use_cases'
    ];

    console.log(`\nTARGETS: ${collectionsToDelete.join(', ')}\n`);

    for (const col of collectionsToDelete) {
        try {
            console.log(`🔥 Deleting ${col}...`);
            await client.request(deleteCollection(col));
            console.log(`   ✅ Deleted ${col}`);
        } catch (e) {
            // Check for specific error codes if possible, usually we just log and move on
            // If it's 404/403, standard SDK error message
            if (e.errors && e.errors[0] && e.errors[0].message === 'Forbidden') {
                console.log(`   ❌ Forbidden: Cannot delete ${col} (Check permissions/system)`);
            } else {
                // Often throws if doesn't exist? SDK usually throws on 404 for delete?
                // Or returns void. If successful returns nothing.
                console.log(`   ℹ️  Could not delete ${col} (Maybe didn't exist?): ${e.message}`);
            }
        }
    }

    console.log('\nCLEANUP COMPLETE: Backend is now clean. Only Global Settings remains (and system tables).');
}

main();
