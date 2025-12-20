// Fix chart_type and bullets field interfaces
const DIRECTUS_URL = 'http://localhost:8055';

async function fixFields() {
    console.log("🔧 FIXING lp_core_radar FIELD INTERFACES...\n");

    try {
        const authRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@spead.ai', password: 'password123' })
        });
        const { data: { access_token: token } } = await authRes.json();

        // Fields to fix - bullets need 'cast-json' special
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
                        interface: 'list',  // Changed from 'tags' to 'list' for better array editing
                        special: ['cast-json'],
                        options: {
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
                console.log(`   ✗ ${field}:`, JSON.stringify(err.errors?.[0]?.message));
            }
        }

        // Fix chart_type fields to ensure dropdown works
        const chartFields = ['node_1_chart_type', 'node_2_chart_type', 'node_3_chart_type'];

        for (const field of chartFields) {
            console.log(`Fixing ${field}...`);
            const res = await fetch(`${DIRECTUS_URL}/fields/lp_core_radar/${field}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    meta: {
                        interface: 'select-dropdown',
                        options: {
                            choices: [
                                { text: 'Bar Chart (Decline)', value: 'bar_chart_decline' },
                                { text: 'Radial Progress', value: 'radial_progress' },
                                { text: 'Alert Box', value: 'alert_box' }
                            ]
                        },
                        width: 'half'
                    }
                })
            });
            if (res.ok) {
                console.log(`   ✓ ${field} fixed`);
            } else {
                const err = await res.json();
                console.log(`   ✗ ${field}:`, JSON.stringify(err.errors?.[0]?.message));
            }
        }

        console.log("\n✅ DONE! Please hard refresh Directus (Ctrl+Shift+R).");

    } catch (e) {
        console.error("Error:", e.message);
    }
}

fixFields();
