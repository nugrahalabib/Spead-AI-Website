import { createDirectus, rest, staticToken, updateField } from '@directus/sdk';

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

async function fixBullets() {
    console.log("🛠️ Fixing Bullet Points Interface...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        const bulletFields = ['node_1_bullets', 'node_2_bullets', 'node_3_bullets'];

        for (const field of bulletFields) {
            console.log(`   - Updating interface for: ${field} -> 'tags'`);
            await client.request(updateField('lp_silent_killer', field, {
                meta: {
                    interface: 'tags', // Much better UX for simple string arrays
                    note: 'Type text and press Enter to add a bullet point.',
                    options: {
                        placeholder: 'Add bullet point...'
                    }
                }
            }));
        }

        console.log("✅ Interfaces Updated. The error should be gone!");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

fixBullets();
