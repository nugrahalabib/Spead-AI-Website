// Native fetch used (Node 18+)

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const PLAN_DATA = [
    {
        name: "Starter",
        price: "0",
        price_yearly: "0",
        subtitle: "Forever free",
        cta_text: "Sign Up Free",
        is_popular: false,
        sort: 1,
        visual_style: "obsidian",
        features: ["1 Seat (Personal)", "Basic Builder Access", "Limited History"]
    },
    {
        name: "Plus",
        price: "3.990k",
        price_yearly: "3.190k",
        subtitle: "Small Teams",
        cta_text: "Get Plus",
        is_popular: false,
        sort: 2,
        visual_style: "obsidian_cyan",
        features: ["10 Seats Included", "Collab Tools", "Admin Panel", "Standard Support"]
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
        features: ["25 Seats Included", "Unlimited Builder", "AI Partner Access (GPT-4o)", "Priority Support"]
    },
    {
        name: "Enterprise",
        price: "15.000k",
        price_yearly: "12.000k",
        subtitle: "Scale",
        cta_text: "Contact Sales",
        is_popular: false,
        sort: 4,
        visual_style: "obsidian_emerald",
        features: ["50 Seats", "On-Premise Deployment", "SLA Guarantee", "Dedicated Success Manager"]
    },
    {
        name: "Custom",
        price: "Contact Us",
        price_yearly: "Contact Us",
        subtitle: "The Whale",
        cta_text: "Talk to Experts",
        is_popular: false,
        sort: 5,
        visual_style: "titanium",
        features: ["Unlimited Seats", "Full Control", "Whitelabel", "Custom AI Models"]
    }
];

async function upgrade() {
    console.log('🚀 Starting Pricing Upgrade...');

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
    console.log('✅ Logged in.');

    // 2. Nuke Existing Items
    console.log('🔥 Nuking old pricing plans...');
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

    // 3. Update Schema (Add Fields)
    console.log('🛠 Updating Schema...');
    const newFields = [
        {
            field: 'price_yearly',
            type: 'string',
            meta: { interface: 'input', display: 'raw', special: null, width: 'half' }
        },
        {
            field: 'visual_style',
            type: 'string',
            meta: {
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: "Obsidian (Default)", value: "obsidian" },
                        { text: "Obsidian Cyan (Plus)", value: "obsidian_cyan" },
                        { text: "Amethyst (Pro)", value: "amethyst" },
                        { text: "Obsidian Emerald (Enterprise)", value: "obsidian_emerald" },
                        { text: "Titanium (Custom)", value: "titanium" }
                    ]
                },
                width: 'half'
            }
        }
    ];

    for (const f of newFields) {
        // Check if exists
        const check = await fetch(`${DIRECTUS_URL}/fields/pricing_plans/${f.field}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (check.status === 404 || check.status === 403) {
            // Create
            await fetch(`${DIRECTUS_URL}/fields/pricing_plans`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(f)
            });
            console.log(`   Created field: ${f.field}`);
        } else {
            console.log(`   Field ${f.field} already exists, skipping.`);
        }
    }

    // 4. Seed New Data
    console.log('🌱 Seeding 5 New Luxury Plans...');
    const createRes = await fetch(`${DIRECTUS_URL}/items/pricing_plans`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(PLAN_DATA)
    });

    if (createRes.ok) {
        console.log('✅ Upgrade Complete! 5 Luxury Plans Live.');
    } else {
        const err = await createRes.json();
        console.error('❌ Failed to insert plans:', JSON.stringify(err, null, 2));
    }
}

upgrade();
