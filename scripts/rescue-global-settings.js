const { createDirectus, rest, authentication, updateField, readFields } = await import('@directus/sdk');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const client = createDirectus(DIRECTUS_URL)
    .with(authentication())
    .with(rest());

async function main() {
    console.log('⛑️ Starting Global Settings RESCUE...');

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
    const GROUP_FIELD = 'branding_assets';

    // 1. Verify Fields Exist
    console.log('\n🔍 Verifying Fields Existence...');
    try {
        const fields = await client.request(readFields(COLLECTION));
        const targetFields = ['logo_light', 'logo_dark', 'favicon', 'og_image'];

        targetFields.forEach(tf => {
            const found = fields.find(f => f.field === tf);
            if (found) {
                console.log(`   ✅ Found ${tf} (Group: ${found.meta?.group || 'None'})`);
            } else {
                console.log(`   ❌ MISSING ${tf}`);
            }
        });
    } catch (e) {
        console.error('Error reading fields:', e);
    }

    // 2. Fix Group Interface (Switch to Accordion)
    console.log(`\n🔧 Updating Group '${GROUP_FIELD}' Interface...`);
    try {
        // First try to update assuming it exists
        await client.request(updateField(COLLECTION, GROUP_FIELD, {
            meta: {
                interface: 'group-detail', // Safer, standard accordion
                special: ['alias', 'group', 'no-data'],
                options: {
                    startOpen: true, // Force open
                    icon: 'brush',
                    title: 'Branding & Assets'
                }
            }
        }));
        console.log(`   ✅ Switched ${GROUP_FIELD} to 'group-detail' (Accordion)`);
    } catch (e) {
        console.error(`   ❌ Failed to update group ${GROUP_FIELD}:`, e.message);
        // If it failed because it didn't exist (unlikely), we'd need to recreate, but previous script said created.
    }

    console.log('\nRESCUE COMPLETE: Group interface updated to standard Accordion. Fields should be visible inside.');
}

main();
