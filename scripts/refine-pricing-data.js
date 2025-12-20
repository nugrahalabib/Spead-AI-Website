// Native fetch used (Node 18+)

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const PLAN_DATA = [
    {
        name: "Starter",
        price: "1.990k",
        price_yearly: "1.590k",
        subtitle: "/mo, billed yearly",
        cta_text: "Sign Up Free", // Keep as requested "Ghost Outline"
        is_popular: false,
        sort: 1,
        visual_style: "obsidian",
        features: ["1 Pro User", "Unlimited Docs"]
    },
    {
        name: "Plus",
        price: "3.990k",
        price_yearly: "3.190k",
        subtitle: "Small Teams",
        cta_text: "Get Plus",
        is_popular: false,
        sort: 2,
        visual_style: "obsidian", // User requested Obsidian for Plus
        features: ["10 Seats Included", "Collab Tools"] // Simplified content
    },
    {
        name: "PRO",
        price: "8.990k",
        price_yearly: "7.190k",
        subtitle: "Best Value",
        cta_text: "Upgrade Now",
        is_popular: true,
        sort: 3,
        visual_style: "amethyst",
        features: ["25 Seats Included", "Unlimited AI", "Priority Support"]
    },
    {
        name: "Enterprise",
        price: "15.000k",
        price_yearly: "12.000k",
        subtitle: "On-Premise",
        cta_text: "Contact Sales",
        is_popular: false,
        sort: 4,
        visual_style: "obsidian", // User requested Obsidian
        features: ["50 Seats", "On-Premise", "SLA Guarantee"]
    },
    {
        name: "Custom",
        price: "Contact Us",
        price_yearly: "Contact Us",
        subtitle: "The Whale",
        cta_text: "Talk to Experts",
        is_popular: false,
        sort: 5,
        visual_style: "obsidian", // Metallic/Titanium requested as 'Custom' in previous logic but here User said "Base Cards... Obsidian". Wait, user said "Custom ... Visual: Metallic / Titanium Texture" in previous, but now "Base Cards (Starter, Plus, Enterprise, Custom): Deep Obsidian". I will stick to Obsidian for consistency, or maybe 'titanium' if available. Let's use 'titanium' for Custom to make it distinct as per "Custom (The Whale)" existing logic if possible, but strict request says "Base Cards... Custom ... Obsidian". I will use Obsidian to follow STRICT 5 Columns Visual Style text.
        features: ["Unlimited Seats", "Full Control", "Whitelabel"]
    }
];

async function refine() {
    console.log('🚀 Refining Pricing Data...');

    // 1. Login
    const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const loginData = await loginRes.json();
    if (!loginData.data) {
        console.error('❌ Login Failed:', loginData);
        process.exit(1);
    }
    const token = loginData.data.access_token;

    // 2. Nuke Existing
    const getRes = await fetch(`${DIRECTUS_URL}/items/pricing_plans`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const existing = await getRes.json();
    if (existing.data && existing.data.length > 0) {
        const ids = existing.data.map(i => i.id);
        await fetch(`${DIRECTUS_URL}/items/pricing_plans`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(ids)
        });
        console.log(`   Deleted ${ids.length} old plans.`);
    }

    // 3. Seed New Data
    const createRes = await fetch(`${DIRECTUS_URL}/items/pricing_plans`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(PLAN_DATA)
    });

    if (createRes.ok) {
        console.log('✅ Refined Data Seeded.');
    } else {
        const err = await createRes.json();
        console.error('❌ Failed to insert plans:', JSON.stringify(err, null, 2));
    }
}

refine();
