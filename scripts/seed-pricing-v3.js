const { createDirectus, rest, authentication, createItem, updateSingleton } = await import('@directus/sdk');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const client = createDirectus(DIRECTUS_URL)
    .with(authentication())
    .with(rest());

async function main() {
    console.log('🌱 Starting Pricing V3 Seeding...');

    // --- Authentication ---
    try {
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.data.access_token;

        client.setToken(token);
        console.log('✅ Authenticated as Admin');
    } catch (e) {
        console.error('❌ Authentication failed:', e.message);
        process.exit(1);
    }

    // --- 1. Seed Header (lp_pricing) ---
    console.log('\n--- Seeding Header (lp_pricing) ---');
    try {
        await client.request(updateSingleton('lp_pricing', {
            headline: 'Unlock Luxury Access',
            subheadline: 'Simple, Scalable Business Model',
            toggle_monthly: 'Monthly',
            toggle_yearly: 'Yearly',
            discount_badge: 'Save 20%'
        }));
        console.log('   ✅ Updated lp_pricing');
    } catch (e) {
        // If singleton doesn't exist yet as a row (unlikely but possible if fresh), updateSingleton might fail or work depending on version.
        // Assuming it works or we catch. 
        // If it sends a 403/404, we might need to "create" it implicitly but usually updateSingleton handles it if collection exists.
        console.error('   ❌ Error seeding lp_pricing:', e.message);
    }

    // --- 2. Seed Plans (pricing_plans) ---
    console.log('\n--- Seeding Plans (pricing_plans) ---');

    const plans = [
        {
            name: "Starter",
            card_color: "cyan",
            is_popular: false,
            price_prefix: "STARTS AT",
            price_display: "IDR 3.990 K",
            seat_limit_label: "5 Seats",
            description: "Essential AI access for small agile teams ready to scale.",
            features_list: ["Basic Analytics", "5 Projects", "Email Support", "Community Access"],
            button_label: "Get Started",
            button_url: "/signup",
            sort: 1
        },
        {
            name: "Professional",
            card_color: "indigo",
            is_popular: true,
            price_prefix: "ONLY",
            price_display: "IDR 8.990 K",
            seat_limit_label: "25 Seats",
            description: "The complete toolkit for growing businesses and power users.",
            features_list: ["Advanced Analytics", "Unlimited Projects", "Priority Support", "API Access", "Custom Integration"],
            button_label: "Go Pro",
            button_url: "/signup?plan=pro",
            sort: 2
        },
        {
            name: "Enterprise",
            card_color: "purple",
            is_popular: false,
            price_prefix: "CUSTOM",
            price_display: "Lets Talk",
            seat_limit_label: "Unlimited Seats",
            description: "Full control, security, and white-glove service for large orgs.",
            features_list: ["Dedicated Manager", "SSO & Audit Logs", "On-premise Deployment", "Custom SLA", "24/7 Phone Support"],
            button_label: "Contact Sales",
            button_url: "/contact",
            sort: 3
        }
    ];

    for (const plan of plans) {
        try {
            await client.request(createItem('pricing_plans', plan));
            console.log(`   ✅ Created Plan: ${plan.name}`);
        } catch (e) {
            console.error(`   ❌ Failed to create ${plan.name}:`, e.message);
        }
    }

    console.log('\n✅ Pricing V3 Data Seeded Successfully!');
}

main();
