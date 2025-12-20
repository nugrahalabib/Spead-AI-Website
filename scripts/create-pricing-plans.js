// Create Pricing Plans Collection
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

async function createPricingPlans() {
    console.log("🚀 CREATING PRICING PLANS COLLECTION...\n");

    try {
        const token = await getAuthToken();
        if (!token) {
            console.error("❌ Auth failed");
            return;
        }

        // ==============================
        // 1. CREATE pricing_plans COLLECTION
        // ==============================
        console.log("1. Creating pricing_plans...");

        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collection: 'pricing_plans',
                schema: {},
                meta: { singleton: false, icon: 'payments', note: 'Pricing Plans Cards', hidden: false, sort_field: 'sort' }
            })
        });
        console.log("   ✓ Collection created");

        // Fields
        const fields = [
            { field: 'sort', type: 'integer', meta: { interface: 'input', width: 'half', sort: 1, hidden: true } },
            { field: 'status', type: 'string', schema: { default_value: 'published' }, meta: { interface: 'select-dropdown', width: 'half', sort: 2, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] } } },
            { field: 'name', type: 'string', meta: { interface: 'input', width: 'half', sort: 3, note: 'Plan name e.g. "Starter"' } },
            {
                field: 'card_color', type: 'string', schema: { default_value: 'indigo' }, meta: {
                    interface: 'select-dropdown', width: 'half', sort: 4, options: {
                        choices: [
                            { text: '🩵 Cyan', value: 'cyan' },
                            { text: '🔵 Blue', value: 'blue' },
                            { text: '🔵 Indigo', value: 'indigo' },
                            { text: '🟣 Purple (Featured)', value: 'purple' },
                            { text: '🔵 Sky', value: 'sky' }
                        ]
                    }
                }
            },
            { field: 'is_popular', type: 'boolean', schema: { default_value: false }, meta: { interface: 'boolean', width: 'half', sort: 5, note: 'Show "Most Popular" badge?' } },
            { field: 'price_prefix', type: 'string', meta: { interface: 'input', width: 'half', sort: 6, note: 'Text above price e.g. "Starting From"' } },
            { field: 'price_display', type: 'string', meta: { interface: 'input', width: 'half', sort: 7, note: 'Price display e.g. "$99/mo" or "Custom"' } },
            { field: 'seat_limit_label', type: 'string', meta: { interface: 'input', width: 'half', sort: 8, note: 'e.g. "Up to 5 seats"' } },
            { field: 'description', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 9 } },
            { field: 'features_list', type: 'json', meta: { interface: 'tags', width: 'full', sort: 10, special: ['cast-json'], note: 'Type feature and press Enter' } },
            { field: 'button_label', type: 'string', schema: { default_value: 'Get Started' }, meta: { interface: 'input', width: 'half', sort: 11 } },
            { field: 'button_url', type: 'string', meta: { interface: 'input', width: 'half', sort: 12 } }
        ];

        for (const f of fields) {
            await fetch(`${DIRECTUS_URL}/fields/pricing_plans`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            });
            console.log(`   ✓ Field: ${f.field}`);
        }

        // ==============================
        // 2. SEED DEFAULT PLANS
        // ==============================
        console.log("\n2. Seeding default plans...");

        const defaultPlans = [
            {
                sort: 1,
                status: 'published',
                name: 'Starter',
                card_color: 'cyan',
                is_popular: false,
                price_prefix: 'Perfect for',
                price_display: '$49/mo',
                seat_limit_label: 'Up to 3 seats',
                description: 'Ideal for small teams and individual professionals getting started with AI.',
                features_list: ['3 Team Members', 'Basic AI Assistant', '10GB Document Storage', 'Email Support', 'Standard Analytics'],
                button_label: 'Start Free Trial',
                button_url: '#'
            },
            {
                sort: 2,
                status: 'published',
                name: 'Professional',
                card_color: 'purple',
                is_popular: true,
                price_prefix: 'Most Value',
                price_display: '$199/mo',
                seat_limit_label: 'Up to 15 seats',
                description: 'For growing teams that need advanced AI capabilities and priority support.',
                features_list: ['15 Team Members', 'Advanced AI Models', '100GB Document Storage', 'Priority Support', 'Advanced Analytics', 'Custom Workflows', 'API Access'],
                button_label: 'Get Professional',
                button_url: '#'
            },
            {
                sort: 3,
                status: 'published',
                name: 'Enterprise',
                card_color: 'indigo',
                is_popular: false,
                price_prefix: 'Custom Pricing',
                price_display: 'Contact Us',
                seat_limit_label: 'Unlimited seats',
                description: 'Full-scale deployment with dedicated infrastructure and white-glove support.',
                features_list: ['Unlimited Team Members', 'Custom AI Training', 'Unlimited Storage', 'Dedicated Account Manager', 'SLA Guarantee', 'On-Premise Option', 'Custom Integrations'],
                button_label: 'Contact Sales',
                button_url: '#'
            }
        ];

        for (const plan of defaultPlans) {
            await fetch(`${DIRECTUS_URL}/items/pricing_plans`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(plan)
            });
            console.log(`   ✓ Plan: ${plan.name}`);
        }

        // ==============================
        // 3. SET PERMISSIONS
        // ==============================
        console.log("\n3. Setting permissions...");

        await fetch(`${DIRECTUS_URL}/permissions`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: null, collection: 'pricing_plans', action: 'read', fields: ['*'] })
        });
        console.log("   ✓ pricing_plans");

        console.log("\n✅ PRICING PLANS COLLECTION CREATED!");

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

createPricingPlans();
