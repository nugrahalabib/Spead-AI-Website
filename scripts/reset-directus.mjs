import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

const args = process.argv.slice(2);
const forceYes = args.includes('--yes') || args.includes('-y');

async function resetDirectus() {
    try {
        console.log(`🔌 Connecting to Directus at ${DIRECTUS_URL}...`);

        // 1. Authenticate
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) {
            const err = await loginRes.json().catch(() => ({}));
            throw new Error(`Login failed: ${loginRes.status} ${JSON.stringify(err)}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.data?.access_token;
        if (!token) throw new Error("No access token received.");

        console.log('✅ Authenticated successfully.');

        // 2. Fetch Collections
        const collectionsRes = await fetch(`${DIRECTUS_URL}/collections`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!collectionsRes.ok) throw new Error("Failed to fetch collections.");
        const collectionsData = await collectionsRes.json();

        // Filter: Exclude 'directus_' system collections
        const customCollections = collectionsData.data
            .filter(c => !c.collection.startsWith('directus_'))
            .map(c => c.collection);

        if (customCollections.length === 0) {
            console.log('🎉 No custom collections found to delete.');
            process.exit(0);
        }

        console.log('\n⚠️  WARNING: The following collections will be PERMANENTLY DELETED:');
        customCollections.forEach(c => console.log(`   - ${c}`));
        console.log(`\nTotal: ${customCollections.length} collections.`);

        // 3. Confirmation
        if (!forceYes) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const answer = await new Promise(resolve => rl.question('\n❓ Are you sure? (y/n): ', resolve));
            rl.close();
            if (answer.toLowerCase() !== 'y') {
                console.log('❌ Operation cancelled.');
                process.exit(0);
            }
        } else {
            console.log('\n👉 --yes flag detected. Skipping confirmation.');
        }

        console.log('\n🚀 Starting clean-up process...\n');

        // 4. Delete Collections
        for (const collection of customCollections) {
            process.stdout.write(`🗑️  Deleting: ${collection}... `);
            const deleteRes = await fetch(`${DIRECTUS_URL}/collections/${collection}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (deleteRes.ok || deleteRes.status === 204) {
                console.log('✅ Success');
            } else {
                console.log('❌ Failed');
                const err = await deleteRes.json().catch(() => ({}));
                console.error(`   Error: ${JSON.stringify(err)}`);
            }
        }

        console.log('\n✨ Directus reset complete. Custom collections wiped.');

    } catch (error) {
        console.error('\n❌ Script failed:', error.message);
        process.exit(1);
    }
}

resetDirectus();
