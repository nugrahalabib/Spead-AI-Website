import { createDirectus, rest, staticToken, updateCollection } from '@directus/sdk';

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

async function fixMeta() {
    console.log("🛠️ Fixing 'lp_hero' Metadata...");
    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // Update Metadata to force visibility
        await client.request(updateCollection('lp_hero', {
            meta: {
                hidden: false,
                icon: 'presentation', // Icon for the sidebar
                note: 'Landing Page Hero Section',
                display_template: '{{headline}}',
                singleton: true, // Ensure it treated as Singleton in UI
                sort: 2
            }
        }));

        console.log("✅ Metadata Updated. 'lp_hero' should now appear in the App Sidebar!");

    } catch (e) {
        console.error("❌ Error updating metadata:", e);
    }
}

fixMeta();
