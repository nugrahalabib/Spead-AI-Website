const { createDirectus, rest, authentication, createCollection, createField, updateCollection, deleteCollection, readCollections, readFields, createPermission, readPermissions } = await import('@directus/sdk');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const client = createDirectus(DIRECTUS_URL)
    .with(authentication())
    .with(rest());

async function main() {
    console.log('🚀 Starting Pricing V3 Rebuild...');

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

    // --- Helpers ---
    async function safeCreateField(collection, field, type, interfaceType, opts = {}) {
        try {
            await client.request(createField(collection, {
                field: field,
                type: type,
                meta: {
                    interface: interfaceType,
                    options: opts.options || null,
                    note: opts.note || null,
                    width: opts.width || 'full',
                    data_type: opts.data_type || null // ensure data_type is handled if needed
                },
                schema: {
                    is_unique: opts.unique || false,
                }
            }));
            console.log(`      ✅ Field created: ${field}`);
        } catch (e) {
            // Check if exists? Since we are doing a rebuild, only lp_pricing might have conflicts
            console.log(`      ⚠️  Field ${field} issue: ${e.message} (might exist)`);
        }
    }

    // --- 1. Header: lp_pricing (Singleton) ---
    console.log('\n--- Part 1: Pricing Header (lp_pricing) ---');
    // Ensure collection exists (it should from previous step)
    try {
        await client.request(createCollection({
            collection: 'lp_pricing',
            schema: {},
            meta: { singleton: true, note: 'Pricing Section Header', icon: 'money_off' }
        }));
    } catch (e) { } // Ignore if exists

    await safeCreateField('lp_pricing', 'subheadline', 'string', 'input', { note: 'Default: Simple, Scalable Business Model' });
    await safeCreateField('lp_pricing', 'toggle_monthly', 'string', 'input', { note: 'Default: Monthly', width: 'half' });
    await safeCreateField('lp_pricing', 'toggle_yearly', 'string', 'input', { note: 'Default: Yearly', width: 'half' });

    // --- 2. The Cards: pricing_plans (Destructive Rebuild) ---
    console.log('\n--- Part 2: Pricing Cards (pricing_plans) ---');

    // Nuke existing
    try {
        console.log('🔥 Nuking existing pricing_plans collection...');
        await client.request(deleteCollection('pricing_plans'));
        console.log('   ✅ Deleted pricing_plans');
    } catch (e) {
        console.log('   ℹ️  pricing_plans did not exist or delete failed:', e.message);
    }

    // Recreate
    console.log('📦 Creating new pricing_plans collection...');
    await client.request(createCollection({
        collection: 'pricing_plans',
        schema: {},
        meta: {
            singleton: false,
            note: 'Pricing Plans V3',
            icon: 'card_membership',
            sort_field: 'sort'
        }
    }));

    // A. Identity & Style
    await safeCreateField('pricing_plans', 'name', 'string', 'input', { width: 'half' });
    await safeCreateField('pricing_plans', 'card_color', 'string', 'select-dropdown', {
        width: 'half',
        options: {
            choices: [
                { text: 'Cyan', value: 'cyan' },
                { text: 'Blue', value: 'blue' },
                { text: 'Purple', value: 'purple' },
                { text: 'Indigo', value: 'indigo' },
                { text: 'Sky', value: 'sky' }
            ]
        }
    });
    await safeCreateField('pricing_plans', 'is_popular', 'boolean', 'boolean', { width: 'half' });

    // B. Price & Limits
    await safeCreateField('pricing_plans', 'price_prefix', 'string', 'input', { note: 'e.g. ONLY or STARTS AT', width: 'half' });
    await safeCreateField('pricing_plans', 'price_display', 'string', 'input', { note: 'e.g. IDR 8.990 K', width: 'half' });
    await safeCreateField('pricing_plans', 'seat_limit_label', 'string', 'input', { note: 'e.g. 25 Seats' });

    // C. Content
    await safeCreateField('pricing_plans', 'description', 'text', 'input-multiline', { note: 'Summary paragraph' });
    await safeCreateField('pricing_plans', 'features_list', 'json', 'tags', { note: 'Type feature and hit Enter' });

    // D. Call to Action
    await safeCreateField('pricing_plans', 'button_label', 'string', 'input', { width: 'half' });
    await safeCreateField('pricing_plans', 'button_url', 'string', 'input', { width: 'half' });
    await safeCreateField('pricing_plans', 'sort', 'integer', 'input');

    // --- 3. Permissions (Public Read) ---
    console.log('\n--- Part 3: Setting Permissions ---');
    try {
        const collections = ['lp_pricing', 'pricing_plans'];

        // Cleanest way: Just try to create permission. If it fails due to unique constraint, we are good.
        for (const col of collections) {
            try {
                await client.request(createPermission({
                    role: null, // Public
                    collection: col,
                    action: 'read',
                    fields: ['*']
                }));
                console.log(`   ✅ Granted Public Read for ${col}`);
            } catch (e) {
                console.log(`   ℹ️  Public Read permission likely exists for ${col}`);
            }
        }
    } catch (e) {
        console.error('Error setting permissions:', e.message);
    }

    console.log('\nPRICING V3 READY: Includes Description text AND Feature List tags.');
}

main();
