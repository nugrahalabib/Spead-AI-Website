// Create Pricing Section Directus Collections
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

async function createPricingCollections() {
    console.log("🚀 CREATING PRICING SECTION COLLECTIONS...\n");

    try {
        const token = await getAuthToken();
        if (!token) {
            console.error("❌ Auth failed");
            return;
        }

        // ==============================
        // 1. DELETE OLD pricing_plans IF EXISTS
        // ==============================
        console.log("1. Cleaning up old collection...");
        await fetch(`${DIRECTUS_URL}/collections/pricing_plans`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("   ✓ Cleaned");

        // ==============================
        // 2. CREATE lp_pricing (Singleton - Header)
        // ==============================
        console.log("\n2. Creating lp_pricing...");

        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collection: 'lp_pricing',
                schema: {},
                meta: { singleton: true, icon: 'payments', note: 'Pricing Section Header & Settings', hidden: false }
            })
        });
        console.log("   ✓ Collection created");

        const headerFields = [
            { field: 'headline', type: 'string', schema: { default_value: 'Unlock Luxury Access' }, meta: { interface: 'input', width: 'full', sort: 1 } },
            { field: 'subtitle', type: 'text', schema: { default_value: 'Unlock exclusive access to advanced AI tools tailored for you.' }, meta: { interface: 'input-multiline', width: 'full', sort: 2 } },
            { field: 'toggle_monthly_label', type: 'string', schema: { default_value: 'Monthly' }, meta: { interface: 'input', width: 'half', sort: 3 } },
            { field: 'toggle_yearly_label', type: 'string', schema: { default_value: 'Yearly' }, meta: { interface: 'input', width: 'half', sort: 4 } },
            { field: 'discount_percentage', type: 'integer', schema: { default_value: 20 }, meta: { interface: 'input', width: 'half', sort: 5, note: 'Discount % for yearly billing' } },
            { field: 'trust_badge_text', type: 'string', schema: { default_value: 'Trusted by 500+ Luxury Brands' }, meta: { interface: 'input', width: 'full', sort: 6 } }
        ];

        for (const f of headerFields) {
            await fetch(`${DIRECTUS_URL}/fields/lp_pricing`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            });
            console.log(`   ✓ Field: ${f.field}`);
        }

        // Seed header data
        await fetch(`${DIRECTUS_URL}/items/lp_pricing`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                headline: 'Unlock Luxury Access',
                subtitle: 'Unlock exclusive access to advanced AI tools tailored for you.',
                toggle_monthly_label: 'Monthly',
                toggle_yearly_label: 'Yearly',
                discount_percentage: 20,
                trust_badge_text: 'Trusted by 500+ Luxury Brands'
            })
        });
        console.log("   ✓ Header seeded");

        // ==============================
        // 3. CREATE pricing_plans (Collection)
        // ==============================
        console.log("\n3. Creating pricing_plans...");

        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collection: 'pricing_plans',
                schema: {},
                meta: { singleton: false, icon: 'credit_card', note: 'Pricing Plan Cards', hidden: false, sort_field: 'sort' }
            })
        });
        console.log("   ✓ Collection created");

        const planFields = [
            { field: 'sort', type: 'integer', meta: { interface: 'input', width: 'half', sort: 1, hidden: true } },
            { field: 'status', type: 'string', schema: { default_value: 'published' }, meta: { interface: 'select-dropdown', width: 'half', sort: 2, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] } } },
            { field: 'name', type: 'string', meta: { interface: 'input', width: 'half', sort: 3, note: 'Plan name e.g. "Pro"' } },
            {
                field: 'color', type: 'string', schema: { default_value: 'blue' }, meta: {
                    interface: 'select-dropdown', width: 'half', sort: 4, options: {
                        choices: [
                            { text: '🩵 Cyan', value: 'cyan' },
                            { text: '🔵 Blue', value: 'blue' },
                            { text: '🟣 Purple', value: 'purple' },
                            { text: '🔵 Indigo', value: 'indigo' },
                            { text: '🟠 Amber', value: 'amber' }
                        ]
                    }
                }
            },
            { field: 'is_popular', type: 'boolean', schema: { default_value: false }, meta: { interface: 'boolean', width: 'half', sort: 5, note: 'Show "Most Popular" badge' } },
            { field: 'is_free', type: 'boolean', schema: { default_value: false }, meta: { interface: 'boolean', width: 'half', sort: 6, note: 'Free plan (shows "Free")' } },
            { field: 'is_contact', type: 'boolean', schema: { default_value: false }, meta: { interface: 'boolean', width: 'half', sort: 7, note: 'Contact sales (shows "Contact Us")' } },
            { field: 'price_monthly', type: 'integer', schema: { default_value: 0 }, meta: { interface: 'input', width: 'half', sort: 8, note: 'Price in Rupiah (e.g. 3990000)' } },
            { field: 'seat_limit', type: 'string', meta: { interface: 'input', width: 'half', sort: 9, note: 'e.g. "10 Seats" or "Unlimited"' } },
            { field: 'description', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 10 } },
            { field: 'features', type: 'json', meta: { interface: 'tags', width: 'full', sort: 11, special: ['cast-json'], note: 'Type feature and press Enter' } },
            { field: 'button_label', type: 'string', schema: { default_value: 'Get Started' }, meta: { interface: 'input', width: 'half', sort: 12 } },
            { field: 'button_url', type: 'string', schema: { default_value: '/booking' }, meta: { interface: 'input', width: 'half', sort: 13, note: 'URL for booking page' } }
        ];

        for (const f of planFields) {
            await fetch(`${DIRECTUS_URL}/fields/pricing_plans`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            });
            console.log(`   ✓ Field: ${f.field}`);
        }

        // ==============================
        // 4. SEED PRICING PLANS
        // ==============================
        console.log("\n4. Seeding pricing plans...");

        const plans = [
            {
                sort: 1, status: 'published', name: 'Freemium', color: 'cyan',
                is_popular: false, is_free: true, is_contact: false,
                price_monthly: 0, seat_limit: '1 Seat',
                description: 'Free forever package for one user to try core features.',
                features: ['Basic AI Assistant Access', '5 documents per month', '500MB Storage', 'Community Support', 'Basic Search Feature'],
                button_label: 'Start for Free', button_url: '/booking'
            },
            {
                sort: 2, status: 'published', name: 'Plus', color: 'blue',
                is_popular: false, is_free: false, is_contact: false,
                price_monthly: 3990000, seat_limit: '10 Seats',
                description: 'Paid package for teams and startups needing more credits.',
                features: ['All Freemium features', 'Up to 10 team members', '100 documents per month', '10GB Storage', 'Priority Email Support', 'Basic Team Analytics', 'Google Drive Integration'],
                button_label: 'Select Plus', button_url: '/booking'
            },
            {
                sort: 3, status: 'published', name: 'Pro', color: 'purple',
                is_popular: true, is_free: false, is_contact: false,
                price_monthly: 8990000, seat_limit: '25 Seats',
                description: 'Most popular option for medium businesses with AI customization and admin.',
                features: ['All Plus features', 'Up to 25 team members', 'Unlimited documents', '100GB Storage', 'Custom AI Models', 'Complete Admin Management', 'API Access', '24/7 Priority Support', 'Exclusive Training'],
                button_label: 'Select Pro', button_url: '/booking'
            },
            {
                sort: 4, status: 'published', name: 'Enterprise', color: 'indigo',
                is_popular: false, is_free: false, is_contact: false,
                price_monthly: 15000000, seat_limit: '50 Seats',
                description: 'Complete solution for large organizations needing many users and analytics.',
                features: ['All Pro features', 'Up to 50 team members', '500GB Storage', 'SSO & SAML', 'Complete Audit Logs', '99.9% Uptime SLA', 'Dedicated Account Manager', 'Custom Integrations', 'Compliance Reports', 'Multi-workspace'],
                button_label: 'Select Enterprise', button_url: '/booking'
            },
            {
                sort: 5, status: 'published', name: 'Custom', color: 'amber',
                is_popular: false, is_free: false, is_contact: true,
                price_monthly: 0, seat_limit: 'Unlimited',
                description: 'Fully customized package for specific needs, including on-premise.',
                features: ['All Enterprise features', 'Unlimited team members', 'Unlimited storage', 'On-premise deployment', 'Custom AI training', 'White-label option', 'Dedicated infrastructure', 'Custom SLA', 'Source code escrow', '24/7 phone support'],
                button_label: 'Contact Sales', button_url: '/booking'
            }
        ];

        for (const plan of plans) {
            await fetch(`${DIRECTUS_URL}/items/pricing_plans`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(plan)
            });
            console.log(`   ✓ Plan: ${plan.name}`);
        }

        // ==============================
        // 5. SET PERMISSIONS
        // ==============================
        console.log("\n5. Setting permissions...");

        for (const col of ['lp_pricing', 'pricing_plans']) {
            await fetch(`${DIRECTUS_URL}/permissions`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: null, collection: col, action: 'read', fields: ['*'] })
            });
            console.log(`   ✓ ${col}`);
        }

        console.log("\n✅ PRICING COLLECTIONS CREATED SUCCESSFULLY!");

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

createPricingCollections();
