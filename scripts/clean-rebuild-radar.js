// Clean metadata from directus system tables and recreate
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

async function cleanAndRebuild() {
    console.log("🔧 CLEANING METADATA & REBUILDING...\n");

    try {
        const token = await getAuthToken();
        if (!token) {
            console.error("❌ Cannot authenticate");
            return;
        }

        // 1. Delete fields first (via REST API to directus_fields)
        console.log("1. Cleaning fields metadata...");
        const fieldsResponse = await fetch(`${DIRECTUS_URL}/fields/lp_core_radar`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (fieldsResponse.ok) {
            const fieldsData = await fieldsResponse.json();
            for (const field of fieldsData.data || []) {
                if (field.field !== 'id') {
                    console.log(`   Deleting field: ${field.field}`);
                    await fetch(`${DIRECTUS_URL}/fields/lp_core_radar/${field.field}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
            }
        }

        // 2. Delete collection metadata
        console.log("2. Deleting collection metadata...");
        await fetch(`${DIRECTUS_URL}/collections/lp_core_radar`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Wait for sync
        await new Promise(r => setTimeout(r, 2000));

        // 3. Create fresh collection (without schema - metadata only first)
        console.log("3. Creating fresh collection...");
        const createColResponse = await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                collection: 'lp_core_radar',
                meta: {
                    singleton: true,
                    hidden: false,
                    icon: 'radar',
                    note: 'Silent Killer Radar Section'
                },
                schema: {}
            })
        });

        const createResult = await createColResponse.json();
        if (!createColResponse.ok) {
            console.log("   Create result:", JSON.stringify(createResult));
        } else {
            console.log("   ✓ Collection created");
        }

        // 4. Create fields one by one
        console.log("4. Creating fields...");

        const fields = [
            { field: 'section_headline', type: 'string', meta: { interface: 'input', width: 'full', sort: 1 } },
            { field: 'node_1_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 2 } },
            { field: 'node_1_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 3 } },
            { field: 'node_1_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 4 } },
            { field: 'node_1_chart_type', type: 'string', meta: { interface: 'select-dropdown', sort: 5, options: { choices: [{ text: 'Bar', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_1_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 6 } },
            { field: 'node_2_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 7 } },
            { field: 'node_2_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 8 } },
            { field: 'node_2_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 9 } },
            { field: 'node_2_chart_type', type: 'string', meta: { interface: 'select-dropdown', sort: 10, options: { choices: [{ text: 'Bar', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_2_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 11 } },
            { field: 'node_3_badge', type: 'string', meta: { interface: 'input', width: 'half', sort: 12 } },
            { field: 'node_3_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 13 } },
            { field: 'node_3_subtitle', type: 'string', meta: { interface: 'input', width: 'half', sort: 14 } },
            { field: 'node_3_chart_type', type: 'string', meta: { interface: 'select-dropdown', sort: 15, options: { choices: [{ text: 'Bar', value: 'bar_chart_decline' }, { text: 'Radial', value: 'radial_progress' }, { text: 'Alert', value: 'alert_box' }] } } },
            { field: 'node_3_bullets', type: 'json', meta: { interface: 'tags', width: 'full', sort: 16 } },
        ];

        for (const f of fields) {
            const res = await fetch(`${DIRECTUS_URL}/fields/lp_core_radar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(f)
            });
            if (res.ok) {
                console.log(`   ✓ ${f.field}`);
            } else {
                const err = await res.json();
                console.log(`   ✗ ${f.field}: ${err.errors?.[0]?.message || 'error'}`);
            }
        }

        // 5. Seed data
        console.log("5. Seeding data...");
        const seedRes = await fetch(`${DIRECTUS_URL}/items/lp_core_radar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                section_headline: "The {Silent Killer:pink} of Enterprise Valuation",
                node_1_badge: "FINANCIAL LEAK",
                node_1_title: "IDR 102M",
                node_1_subtitle: "LOSS PER EMPLOYEE",
                node_1_chart_type: "bar_chart_decline",
                node_1_bullets: ["Wasted Billable Hours", "Un-invoiced Overage"],
                node_2_badge: "ADMIN DRAIN",
                node_2_title: "40% Time",
                node_2_subtitle: "NON-BILLABLE WORK",
                node_2_chart_type: "radial_progress",
                node_2_bullets: ["Manual Data Entry", "Document Search"],
                node_3_badge: "CRITICAL LIABILITY",
                node_3_title: "High Risk",
                node_3_subtitle: "HUMAN ERROR",
                node_3_chart_type: "alert_box",
                node_3_bullets: ["Contract Loopholes", "Missed Clauses"]
            })
        });

        if (seedRes.ok) {
            console.log("   ✓ Data seeded");
        } else {
            const err = await seedRes.json();
            console.log("   ✗ Seed failed:", JSON.stringify(err.errors?.[0]?.message || err));
        }

        // 6. Set permissions
        console.log("6. Setting permissions...");
        await fetch(`${DIRECTUS_URL}/permissions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: null,
                collection: 'lp_core_radar',
                action: 'read',
                fields: ['*']
            })
        });

        console.log("\n✅ DONE! Please refresh Directus.");

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

cleanAndRebuild();
