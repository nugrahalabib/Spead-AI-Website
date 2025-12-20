import { createDirectus, rest, staticToken, readCollections } from '@directus/sdk';

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

async function checkCollections() {
    console.log("🔍 Checking Collections...");
    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        const collections = await client.request(readCollections());
        console.log("📂 Found Collections:");

        const hero = collections.find(c => c.collection === 'lp_hero');

        collections.forEach(c => {
            if (c.collection.startsWith('lp_') || c.collection.startsWith('global')) {
                console.log(` - ${c.collection} (${c.meta?.singleton ? 'Singleton' : 'List'})`);
            }
        });

        if (hero) {
            console.log("\n✅ SUCCESS: 'lp_hero' exists!");
            console.log(JSON.stringify(hero, null, 2));
        } else {
            console.error("\n❌ ERROR: 'lp_hero' NOT FOUND.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

checkCollections();
