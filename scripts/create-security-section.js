// Create SecuritySection Directus Collections
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

async function createSecurityCollections() {
    console.log("🚀 CREATING SECURITY SECTION COLLECTIONS...\n");

    try {
        const token = await getAuthToken();
        if (!token) {
            console.error("❌ Auth failed");
            return;
        }

        // ==============================
        // 1. CREATE lp_security (Singleton)
        // ==============================
        console.log("1. Creating lp_security...");

        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collection: 'lp_security',
                schema: {},
                meta: { singleton: true, icon: 'security', note: 'Security Section Settings', hidden: false }
            })
        });
        console.log("   ✓ Collection created");

        // Fields
        const fields = [
            { field: 'badge_text', type: 'string', schema: { default_value: 'Bank-Grade Security' }, meta: { interface: 'input', width: 'half', sort: 1, note: 'Badge label e.g. "Bank-Grade Security"' } },
            {
                field: 'theme_color', type: 'string', schema: { default_value: 'teal' }, meta: {
                    interface: 'select-dropdown', width: 'half', sort: 2, options: {
                        choices: [
                            { text: '🩵 Teal', value: 'teal' },
                            { text: '🔵 Cyan', value: 'cyan' },
                            { text: '🟢 Emerald', value: 'emerald' },
                            { text: '🔵 Blue', value: 'blue' },
                            { text: '🟣 Purple', value: 'purple' },
                            { text: '🔵 Indigo', value: 'indigo' }
                        ]
                    }
                }
            },
            { field: 'headline', type: 'string', meta: { interface: 'input', width: 'full', sort: 3, note: 'Use {Text:color} for highlights' } },
            { field: 'description', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 4 } }
        ];

        for (const f of fields) {
            await fetch(`${DIRECTUS_URL}/fields/lp_security`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            });
            console.log(`   ✓ Field: ${f.field}`);
        }

        // Seed data
        await fetch(`${DIRECTUS_URL}/items/lp_security`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                badge_text: 'Bank-Grade Security',
                theme_color: 'teal',
                headline: 'Your Data. Your Infrastructure. {Zero Compromises.:teal}',
                description: 'We deploy Spead AI directly onto your private cloud or on-premise servers. Your data never leaves your perimeter, ensuring 100% compliance with enterprise standards.'
            })
        });
        console.log("   ✓ Data seeded");

        // ==============================
        // 2. CREATE security_features (Collection)
        // ==============================
        console.log("\n2. Creating security_features...");

        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collection: 'security_features',
                schema: {},
                meta: { singleton: false, icon: 'verified_user', note: 'Security Feature Cards', hidden: false, sort_field: 'sort' }
            })
        });
        console.log("   ✓ Collection created");

        // Fields
        const featureFields = [
            { field: 'sort', type: 'integer', meta: { interface: 'input', width: 'half', sort: 1, hidden: true } },
            { field: 'status', type: 'string', schema: { default_value: 'published' }, meta: { interface: 'select-dropdown', width: 'half', sort: 2, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] } } },
            { field: 'title', type: 'string', meta: { interface: 'input', width: 'full', sort: 3 } },
            { field: 'subtitle', type: 'string', meta: { interface: 'input', width: 'full', sort: 4 } },
            {
                field: 'icon', type: 'string', meta: {
                    interface: 'select-dropdown', width: 'half', sort: 5, options: {
                        choices: [
                            { text: '🖥️ Server', value: 'Server' },
                            { text: '🛡️ Shield', value: 'Shield' },
                            { text: '🔒 Lock', value: 'Lock' },
                            { text: '🔑 Key', value: 'Key' },
                            { text: '👁️ Eye', value: 'Eye' },
                            { text: '🔐 ShieldCheck', value: 'ShieldCheck' },
                            { text: '🧬 Fingerprint', value: 'Fingerprint' },
                            { text: '☁️ Cloud', value: 'Cloud' },
                            { text: '📊 Database', value: 'Database' }
                        ]
                    }
                }
            }
        ];

        for (const f of featureFields) {
            await fetch(`${DIRECTUS_URL}/fields/security_features`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            });
            console.log(`   ✓ Field: ${f.field}`);
        }

        // Seed default features
        const defaultFeatures = [
            { sort: 1, status: 'published', title: 'On-Premise Deployment', subtitle: 'Docker & Kubernetes Ready', icon: 'Server' },
            { sort: 2, status: 'published', title: 'Model Armor', subtitle: 'PII Redaction & Injection Protection', icon: 'Shield' }
        ];

        for (const feature of defaultFeatures) {
            await fetch(`${DIRECTUS_URL}/items/security_features`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(feature)
            });
            console.log(`   ✓ Feature: ${feature.title}`);
        }

        // ==============================
        // 3. SET PERMISSIONS
        // ==============================
        console.log("\n3. Setting permissions...");

        for (const col of ['lp_security', 'security_features']) {
            await fetch(`${DIRECTUS_URL}/permissions`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: null, collection: col, action: 'read', fields: ['*'] })
            });
            console.log(`   ✓ ${col}`);
        }

        console.log("\n✅ SECURITY SECTION COLLECTIONS CREATED!");

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

createSecurityCollections();
