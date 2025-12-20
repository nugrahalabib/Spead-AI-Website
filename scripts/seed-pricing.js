// Native fetch used (Node 18+)

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const PLAN_DATA = [
    {
        name: "Starter",
        price: "0",
        subtitle: "Forever free",
        cta_text: "Sign Up Free",
        is_popular: false,
        sort: 1,
        features: ["1 Seat (Personal)", "Basic Builder Access", "Limited History"]
    },
    {
        name: "Plus",
        price: "3.990k",
        subtitle: "Small Teams",
        cta_text: "Get Plus",
        is_popular: false,
        sort: 2,
        features: ["10 Seats Included", "Collab Tools", "Admin Panel", "Standard Support"]
    },
    {
        name: "PRO",
        price: "8.990k",
        subtitle: "Best Value",
        cta_text: "Upgrade Now",
        is_popular: true,
        sort: 3,
        features: ["25 Seats Included", "Unlimited Builder", "AI Partner Access (GPT-4o)", "Priority Support"]
    }
];

async function seed() {
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

    // 2. Insert Items
    console.log('🌱 Seeding Pricing Plans...');
    const createRes = await fetch(`${DIRECTUS_URL}/items/pricing_plans`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(PLAN_DATA)
    });

    if (createRes.ok) {
        console.log('✅ 3 Plans Inserted Successfully.');
    } else {
        const err = await createRes.json();
        console.error('❌ Failed to insert plans:', JSON.stringify(err, null, 2));
    }
}

seed();
