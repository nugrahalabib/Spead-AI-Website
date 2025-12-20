// Create IndustryShifter Directus Collections
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

async function createIndustryCollections() {
    console.log("🚀 CREATING INDUSTRY SHIFTER COLLECTIONS...\n");

    try {
        const token = await getAuthToken();
        if (!token) {
            console.error("❌ Auth failed");
            return;
        }

        // ==============================
        // 1. CREATE lp_industry_header (Singleton)
        // ==============================
        console.log("1. Creating lp_industry_header...");

        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collection: 'lp_industry_header',
                schema: {},
                meta: { singleton: true, icon: 'factory', note: 'Industry Section Header', hidden: false }
            })
        });
        console.log("   ✓ Collection created");

        // Header fields
        const headerFields = [
            { field: 'headline', type: 'string', meta: { interface: 'input', width: 'full', sort: 1, note: 'Use {Text:color} for highlights' } },
            { field: 'subtitle', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 2 } }
        ];

        for (const f of headerFields) {
            await fetch(`${DIRECTUS_URL}/fields/lp_industry_header`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            });
            console.log(`   ✓ Field: ${f.field}`);
        }

        // Seed header data
        await fetch(`${DIRECTUS_URL}/items/lp_industry_header`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                headline: "Engineered for the {High-Stakes:amber} Economy.",
                subtitle: "Spead AI adapts to your industry's specific workflows, compliance needs, and language."
            })
        });
        console.log("   ✓ Header data seeded");

        // ==============================
        // 2. CREATE industry_tabs (Collection)
        // ==============================
        console.log("\n2. Creating industry_tabs...");

        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collection: 'industry_tabs',
                schema: {},
                meta: { singleton: false, icon: 'domain', note: 'Industry Tabs for High-Stakes Section', hidden: false, sort_field: 'sort' }
            })
        });
        console.log("   ✓ Collection created");

        // Tab fields
        const tabFields = [
            { field: 'sort', type: 'integer', meta: { interface: 'input', width: 'half', sort: 1, hidden: true } },
            { field: 'status', type: 'string', schema: { default_value: 'published' }, meta: { interface: 'select-dropdown', width: 'half', sort: 2, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] } } },
            { field: 'label', type: 'string', meta: { interface: 'input', width: 'half', sort: 3, note: 'Tab label e.g. "Legal & Law Firms"' } },
            {
                field: 'icon', type: 'string', meta: {
                    interface: 'select-dropdown', width: 'half', sort: 4, options: {
                        choices: [
                            { text: '⚖️ Scale (Legal)', value: 'Scale' },
                            { text: '💼 Briefcase (Consulting)', value: 'Briefcase' },
                            { text: '📊 FileSpreadsheet (Audit)', value: 'FileSpreadsheet' },
                            { text: '🎨 Palette (Creative)', value: 'Palette' },
                            { text: '🏥 Heart (Healthcare)', value: 'Heart' },
                            { text: '🏭 Factory', value: 'Factory' },
                            { text: '🏦 Building (Finance)', value: 'Building' },
                            { text: '🎓 GraduationCap (Education)', value: 'GraduationCap' }
                        ]
                    }
                }
            },
            {
                field: 'color', type: 'string', meta: {
                    interface: 'select-dropdown', width: 'half', sort: 5, options: {
                        choices: [
                            { text: '🔴 Rose', value: 'rose' },
                            { text: '🔵 Indigo', value: 'indigo' },
                            { text: '🩵 Teal', value: 'teal' },
                            { text: '🩷 Fuchsia', value: 'fuchsia' },
                            { text: '🟠 Amber', value: 'amber' },
                            { text: '🟢 Emerald', value: 'emerald' },
                            { text: '🟣 Purple', value: 'purple' },
                            { text: '🔵 Cyan', value: 'cyan' }
                        ]
                    }
                }
            },
            { field: 'headline', type: 'string', meta: { interface: 'input', width: 'full', sort: 6, note: 'Content headline' } },
            { field: 'subtitle', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 7, note: 'Content description' } },
            { field: 'benefits', type: 'json', meta: { interface: 'list', width: 'full', sort: 8, special: ['cast-json'], options: { addLabel: 'Add Benefit', fields: [{ field: 'value', name: 'Benefit', type: 'string', meta: { interface: 'input', width: 'full' } }] } } }
        ];

        for (const f of tabFields) {
            await fetch(`${DIRECTUS_URL}/fields/industry_tabs`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            });
            console.log(`   ✓ Field: ${f.field}`);
        }

        // Seed default tabs
        const defaultTabs = [
            { sort: 1, status: 'published', label: 'Legal & Law Firms', icon: 'Scale', color: 'rose', headline: 'Defend Your Clients, Not Your Paperwork.', subtitle: 'Stop wasting 40% of billable hours on contract drafting and precedent research.', benefits: [{ value: 'Draft 50-page contracts in minutes' }, { value: 'Instant Case Law Discovery' }, { value: 'Data Sovereignty (No cloud leaks)' }] },
            { sort: 2, status: 'published', label: 'Management Consulting', icon: 'Briefcase', color: 'indigo', headline: 'Sell Strategy, Automate the Slides.', subtitle: "Your value is in the insight, not in formatting 100-page decks till 2 AM.", benefits: [{ value: 'Instant Market Research Synthesis' }, { value: 'Automated Proposal Generation' }, { value: 'Access firm-wide knowledge history' }] },
            { sort: 3, status: 'published', label: 'Audit & Accounting', icon: 'FileSpreadsheet', color: 'teal', headline: 'Audit at the Speed of Light.', subtitle: 'Eliminate human error in financial reporting and invoice extraction.', benefits: [{ value: 'Zero-error Data Extraction' }, { value: 'Automated Financial Reporting' }, { value: 'Fraud Detection Algorithms' }] },
            { sort: 4, status: 'published', label: 'Creative Agencies', icon: 'Palette', color: 'fuchsia', headline: 'Scale Creativity, Kill Administration.', subtitle: "Don't let admin blockers kill your creative flow.", benefits: [{ value: 'Auto-generate Client Reports' }, { value: 'Project Timeline Automation' }, { value: 'Campaign Research Assistant' }] }
        ];

        for (const tab of defaultTabs) {
            await fetch(`${DIRECTUS_URL}/items/industry_tabs`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(tab)
            });
            console.log(`   ✓ Tab: ${tab.label}`);
        }

        // ==============================
        // 3. SET PERMISSIONS
        // ==============================
        console.log("\n3. Setting permissions...");

        for (const col of ['lp_industry_header', 'industry_tabs']) {
            await fetch(`${DIRECTUS_URL}/permissions`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: null, collection: col, action: 'read', fields: ['*'] })
            });
            console.log(`   ✓ ${col}`);
        }

        console.log("\n✅ INDUSTRY SHIFTER COLLECTIONS CREATED!");

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

createIndustryCollections();
