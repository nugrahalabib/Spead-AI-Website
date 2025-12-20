import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function updateLpHeroIcons() {
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

        // 2. Define Curated Icons
        const iconChoices = [
            { text: "🚀 Rocket (Launch)", value: "rocket" },
            { text: "⚡ Zap (Speed)", value: "zap" },
            { text: "➡️ Arrow Right (Go)", value: "arrow-right" },
            { text: "▶️ Play (Demo)", value: "play" },
            { text: "📅 Calendar (Book)", value: "calendar" },
            { text: "⭐ Star (Feature)", value: "star" },
            { text: "✅ Check (Done)", value: "check" },
            { text: "⬇️ Download (Get)", value: "download" },
            { text: "📞 Phone (Call)", value: "phone" },
            { text: "✉️ Mail (Contact)", value: "mail" }
        ];

        // 3. Update Fields
        const fields = ['cta_primary_icon', 'cta_secondary_icon'];

        console.log('\n🎨 Updating Icon Fields to Dropdown...');

        for (const f of fields) {
            console.log(`   - Updating ${f}...`);
            const res = await fetch(`${DIRECTUS_URL}/fields/lp_hero/${f}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({
                    meta: {
                        interface: 'select-dropdown',
                        note: 'Select an icon to display on the button.',
                        options: {
                            choices: iconChoices,
                            allowOther: false // Strict selection
                        }
                    }
                })
            });

            if (!res.ok) {
                console.error(`     ❌ Failed: ${await res.text()}`);
            } else {
                console.log(`     ✅ Success.`);
            }
        }

        console.log('\n🎉 CTA Icons Updated to Curated Dropdowns.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

updateLpHeroIcons();
