// Create Command Center Directus Collections
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

async function createCommandCenterCollections() {
    console.log("🚀 CREATING COMMAND CENTER COLLECTIONS...\n");

    try {
        const token = await getAuthToken();
        if (!token) {
            console.error("❌ Auth failed");
            return;
        }

        // ==============================
        // 1. CREATE lp_solutions_header (Singleton)
        // ==============================
        console.log("1. Creating lp_solutions_header...");

        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collection: 'lp_solutions_header',
                schema: {},
                meta: {
                    singleton: true,
                    icon: 'grid_view',
                    note: 'Command Center Section Header',
                    hidden: false
                }
            })
        });
        console.log("   ✓ Collection created");

        // Header fields
        const headerFields = [
            { field: 'headline', type: 'string', meta: { interface: 'input', width: 'full', sort: 1, note: 'Use {Text:color} for highlights' } },
            { field: 'subtitle', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 2 } }
        ];

        for (const f of headerFields) {
            await fetch(`${DIRECTUS_URL}/fields/lp_solutions_header`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            });
            console.log(`   ✓ Field: ${f.field}`);
        }

        // Seed header data
        await fetch(`${DIRECTUS_URL}/items/lp_solutions_header`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                headline: "Command Center {Capabilities.:cyan}",
                subtitle: "A unified operating system. The ecosystem that breathes with your business."
            })
        });
        console.log("   ✓ Header data seeded");

        // ==============================
        // 2. CREATE solution_cards (Collection)
        // ==============================
        console.log("\n2. Creating solution_cards...");

        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collection: 'solution_cards',
                schema: {},
                meta: {
                    singleton: false,
                    icon: 'view_module',
                    note: 'Feature Cards for Command Center',
                    hidden: false,
                    sort_field: 'sort'
                }
            })
        });
        console.log("   ✓ Collection created");

        // Card fields
        const cardFields = [
            { field: 'sort', type: 'integer', meta: { interface: 'input', width: 'half', sort: 1, hidden: true } },
            { field: 'status', type: 'string', schema: { default_value: 'published' }, meta: { interface: 'select-dropdown', width: 'half', sort: 2, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] } } },
            { field: 'title', type: 'string', meta: { interface: 'input', width: 'half', sort: 3 } },
            { field: 'description', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 4 } },
            {
                field: 'icon', type: 'string', meta: {
                    interface: 'select-dropdown', width: 'half', sort: 5, options: {
                        choices: [
                            { text: '🤖 Bot', value: 'Bot' },
                            { text: '📅 Calendar', value: 'Calendar' },
                            { text: '📄 FileText', value: 'FileText' },
                            { text: '✨ Sparkles', value: 'Sparkles' },
                            { text: '🛡️ Shield', value: 'Shield' },
                            { text: '📊 BarChart', value: 'BarChart' },
                            { text: '💬 MessageSquare', value: 'MessageSquare' },
                            { text: '🔒 Lock', value: 'Lock' },
                            { text: '⚡ Zap', value: 'Zap' },
                            { text: '🎯 Target', value: 'Target' }
                        ]
                    }
                }
            },
            { field: 'card_size', type: 'string', schema: { default_value: 'small' }, meta: { interface: 'select-dropdown', width: 'half', sort: 6, options: { choices: [{ text: 'Large (Hero Card)', value: 'large' }, { text: 'Small', value: 'small' }] } } },
            {
                field: 'color', type: 'string', schema: { default_value: 'cyan' }, meta: {
                    interface: 'select-dropdown', width: 'half', sort: 7, options: {
                        choices: [
                            { text: '🔵 Cyan', value: 'cyan' },
                            { text: '🟠 Amber', value: 'amber' },
                            { text: '🟣 Purple', value: 'purple' },
                            { text: '🩷 Pink', value: 'pink' },
                            { text: '🟢 Emerald', value: 'emerald' }
                        ]
                    }
                }
            },
            { field: 'badge_text', type: 'string', meta: { interface: 'input', width: 'half', sort: 8, note: 'Optional badge like "87% Faster"' } },
            { field: 'cta_text', type: 'string', meta: { interface: 'input', width: 'half', sort: 9, note: 'Optional CTA like "Start Building"' } },
            { field: 'cta_link', type: 'string', meta: { interface: 'input', width: 'full', sort: 10, note: 'Optional link URL' } }
        ];

        for (const f of cardFields) {
            await fetch(`${DIRECTUS_URL}/fields/solution_cards`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            });
            console.log(`   ✓ Field: ${f.field}`);
        }

        // Seed default cards
        const defaultCards = [
            { sort: 1, status: 'published', title: 'Builder Generator', description: 'Draft complex legal contracts, audit reports, and proposals in minutes.', icon: 'Bot', card_size: 'large', color: 'cyan', badge_text: '87% Faster', cta_text: 'Start Building' },
            { sort: 2, status: 'published', title: 'Daily Planner', description: 'Automated schedule optimization.', icon: 'Calendar', card_size: 'small', color: 'amber' },
            { sort: 3, status: 'published', title: 'Docs Assistant', description: 'Chat with knowledge.', icon: 'FileText', card_size: 'small', color: 'purple' },
            { sort: 4, status: 'published', title: 'AI Partner', description: 'Strategic Fusion.', icon: 'Sparkles', card_size: 'small', color: 'pink' },
            { sort: 5, status: 'published', title: 'Digital Vault', description: 'Sovereign Infrastructure.', icon: 'Shield', card_size: 'small', color: 'emerald' }
        ];

        for (const card of defaultCards) {
            await fetch(`${DIRECTUS_URL}/items/solution_cards`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(card)
            });
            console.log(`   ✓ Card: ${card.title}`);
        }

        // ==============================
        // 3. SET PERMISSIONS
        // ==============================
        console.log("\n3. Setting permissions...");

        for (const col of ['lp_solutions_header', 'solution_cards']) {
            await fetch(`${DIRECTUS_URL}/permissions`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: null, collection: col, action: 'read', fields: ['*'] })
            });
            console.log(`   ✓ ${col}`);
        }

        console.log("\n✅ COMMAND CENTER COLLECTIONS CREATED!");

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

createCommandCenterCollections();
