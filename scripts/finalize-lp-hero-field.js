import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function finalizeLpHeroField() {
    try {
        console.log(`🔌 Connecting to Directus at ${DIRECTUS_URL}...`);

        // 1. Authenticate
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const access_token = (await loginRes.json()).data.access_token;
        const headers = {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Authenticated.');

        // 2. Cleanup Old Fields
        console.log('\n🗑️  Cleaning up old headline fields...');
        const toDelete = ['headline_prefix', 'headline_gradient'];

        for (const f of toDelete) {
            const res = await fetch(`${DIRECTUS_URL}/fields/lp_hero/${f}`, {
                method: 'DELETE',
                headers
            });
            if (res.ok) console.log(`   - Deleted ${f}`);
            else if (res.status === 404) console.log(`   - ${f} already deleted.`);
            else console.log(`   - Error deleting ${f}: ${res.status}`);
        }

        // 3. Create 'hero_headline'
        console.log('\n📦 Creating hero_headline (Smart Syntax)...');

        const payload = {
            field: 'hero_headline',
            type: 'text', // Text for unlimited length
            schema: {},
            meta: {
                interface: 'input-multiline', // Textarea
                sort: 3,
                width: 'full',
                note: "Use 'Enter' for line breaks. Use {Text:color} for gradients. Available: :red, :gold, :blue, :indigo.",
                options: {
                    placeholder: "Stop Burning\n{Billable Hours:red}"
                }
            }
        };

        const createRes = await fetch(`${DIRECTUS_URL}/fields/lp_hero`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!createRes.ok) {
            const err = await createRes.json();
            // If it exists, we might want to patch it to ensure settings are correct
            if (createRes.status === 409 || (err.errors && err.errors[0].code === 'FIELD_ALREADY_EXISTS')) {
                console.log('   ⚠️  Field exists. Updating Metadata...');
                const patchRes = await fetch(`${DIRECTUS_URL}/fields/lp_hero/hero_headline`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ meta: payload.meta })
                });
                if (patchRes.ok) console.log('   ✅ Updated hero_headline metadata.');
                else console.error(`   ❌ Failed to update: ${JSON.stringify(await patchRes.json())}`);
            } else {
                console.error(`❌ Failed to create hero_headline: ${JSON.stringify(err)}`);
                process.exit(1);
            }
        } else {
            console.log('✅ Success: hero_headline created.');
        }

        console.log('\n🎉 Hero Field Updated: Ready for Smart Syntax & Multi-line Input.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

finalizeLpHeroField();
