// Fix bullets field to have proper input configuration
const DIRECTUS_URL = 'http://localhost:8055';

async function fixBullets() {
    console.log("🔧 FIXING BULLETS FIELD INPUT...\n");

    try {
        const authRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@spead.ai', password: 'password123' })
        });
        const { data: { access_token: token } } = await authRes.json();

        // Fields to fix
        const bulletsFields = ['node_1_bullets', 'node_2_bullets', 'node_3_bullets'];

        for (const field of bulletsFields) {
            console.log(`Fixing ${field}...`);
            const res = await fetch(`${DIRECTUS_URL}/fields/lp_core_radar/${field}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    meta: {
                        interface: 'list',
                        special: ['cast-json'],
                        options: {
                            // Define the input field for each list item
                            fields: [
                                {
                                    field: 'value',
                                    name: 'Bullet Point',
                                    type: 'string',
                                    meta: {
                                        interface: 'input',
                                        width: 'full',
                                        options: {
                                            placeholder: 'Enter bullet point text...'
                                        }
                                    }
                                }
                            ],
                            template: '{{value}}',
                            addLabel: 'Add Bullet Point'
                        },
                        width: 'full'
                    }
                })
            });
            if (res.ok) {
                console.log(`   ✓ ${field} fixed`);
            } else {
                const err = await res.json();
                console.log(`   ✗ ${field}:`, JSON.stringify(err.errors?.[0]?.message || err));
            }
        }

        console.log("\n✅ DONE! Hard refresh Directus (Ctrl+Shift+R).");

    } catch (e) {
        console.error("Error:", e.message);
    }
}

fixBullets();
