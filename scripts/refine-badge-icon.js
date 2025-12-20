import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function refineBadgeIcon() {
    try {
        console.log(`🔌 Connecting to Directus at ${DIRECTUS_URL}...`);

        // 1. Authenticate
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const token = (await loginRes.json()).data.access_token;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Authenticated.');

        // 2. Delete Old Field
        console.log('\n🗑️  Deleting old badge_show_pulse...');
        const delRes = await fetch(`${DIRECTUS_URL}/fields/lp_hero/badge_show_pulse`, {
            method: 'DELETE',
            headers
        });
        if (delRes.ok) console.log('   ✅ Deleted badge_show_pulse.');
        else if (delRes.status === 404) console.log('   - Field already deleted.');
        else console.log(`   ❌ Failed delete: ${delRes.status}`);

        // 3. Create New Field
        console.log('\n📦 Creating badge_icon (Dropdown)...');

        const iconChoices = [
            { text: "Green Pulse Dot", value: "pulse" },
            { text: "✨ AI Sparkles", value: "ai_sparkle" },
            { text: "🤖 Tech Chip", value: "tech_cpu" },
            { text: "🚀 Rocket Launch", value: "rocket" },
            { text: "None", value: "none" }
        ];

        const createRes = await fetch(`${DIRECTUS_URL}/fields/lp_hero`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                field: 'badge_icon',
                type: 'string',
                schema: {
                    default_value: "pulse"
                },
                meta: {
                    interface: 'select-dropdown',
                    sort: 2, // Check master script, this takes the slot of the old bool
                    width: 'half',
                    note: 'Select the icon to display before the badge text.',
                    options: {
                        choices: iconChoices
                    }
                }
            })
        });

        if (!createRes.ok) {
            console.error(`❌ Failed: ${await createRes.text()}`);
        } else {
            console.log('✅ Success: badge_icon created.');
        }

        console.log('\n🎉 Badge Icon Updated to Dropdown.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

refineBadgeIcon();
