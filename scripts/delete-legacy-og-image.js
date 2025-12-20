const { createDirectus, rest, authentication, deleteField } = await import('@directus/sdk');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const client = createDirectus(DIRECTUS_URL)
    .with(authentication())
    .with(rest());

async function main() {
    console.log('🗑️  Starting Deletion of Legacy "og_image_default"...');

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
    const FIELD_TO_DELETE = 'og_image_default';

    try {
        await client.request(deleteField(COLLECTION, FIELD_TO_DELETE));
        console.log(`✅ Successfully deleted legacy field: ${FIELD_TO_DELETE}`);
    } catch (e) {
        if (e.message.includes('NOT_FOUND') || e.errors?.[0]?.extensions?.code === 'FIELD_NOT_FOUND') {
            console.log(`ℹ️  Field ${FIELD_TO_DELETE} was not found (maybe already deleted).`);
        } else {
            console.error(`❌ Failed to delete ${FIELD_TO_DELETE}:`, e.message);
        }
    }
}

main();
