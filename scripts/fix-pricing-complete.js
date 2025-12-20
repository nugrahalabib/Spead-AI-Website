const { createDirectus, rest, authentication, createCollection, createField, updateCollection, readCollections, readFields, createPermission, readPermissions } = await import('@directus/sdk');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const client = createDirectus(DIRECTUS_URL)
    .with(authentication())
    .with(rest());

async function main() {
    console.log('🚀 Starting Pricing Ecosystem Fix...');

    try {
        // Fallback to fetch because SDK login signature might vary across versions
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.data.access_token;

        client.setToken(token);
        console.log('✅ Authenticated as Admin (via fetch)');
    } catch (e) {
        console.error('❌ Authentication failed:', e.message);
        process.exit(1);
    }

    // --- Helper to safely create/update collection ---
    async function ensureCollection(name, opts = {}) {
        try {
            await client.request(createCollection({
                collection: name,
                schema: {},
                meta: {
                    ...opts.meta
                },
                ...opts.other
            }));
            console.log(`✅ Collection created: ${name}`);
        } catch (e) {
            // Error code for "collection already exists" might vary, but usually status 409 or specific code
            // We'll assume if it fails it might exist, or we check specifically.
            // Simplified: try update/check.
            const exists = await client.request(readCollections()).then(cols => cols.find(c => c.collection === name));
            if (exists) {
                console.log(`ℹ️ Collection ${name} already exists.`);
                if (opts.meta) {
                    await client.request(updateCollection(name, { meta: opts.meta }));
                    console.log(`   Updated meta for ${name}`);
                }
            } else {
                console.error(`❌ Failed to create collection ${name}:`, e.message);
            }
        }
    }

    // --- Helper to safely create field ---
    async function ensureField(collection, field, type, interfaceType, opts = {}) {
        try {
            await client.request(createField(collection, {
                field: field,
                type: type,
                meta: {
                    interface: interfaceType,
                    options: opts.options || null,
                    note: opts.note || null,
                    width: opts.width || 'full'
                },
                schema: {
                    is_unique: opts.unique || false,
                }
            }));
            console.log(`   ✅ Field created: ${collection}.${field}`);
        } catch (e) {
            const exists = await client.request(readFields(collection)).then(fields => fields.find(f => f.field === field));
            if (exists) {
                console.log(`   ℹ️ Field ${collection}.${field} already exists. Skipping.`);
            } else {
                console.error(`   ❌ Failed to create field ${collection}.${field}:`, e.message);
            }
        }
    }

    // 1. Singleton: lp_pricing
    console.log('\n--- Part 1: Pricing Header (lp_pricing) ---');
    await ensureCollection('lp_pricing', {
        meta: { singleton: true, note: 'Pricing Section Header', icon: 'money_off' }
    });

    await ensureField('lp_pricing', 'headline', 'string', 'input', { note: 'Default: LUXURY DYNAMIC PRICING' });
    await ensureField('lp_pricing', 'toggle_text_monthly', 'string', 'input', { note: 'Default: MONTHLY', width: 'half' });
    await ensureField('lp_pricing', 'toggle_text_yearly', 'string', 'input', { note: 'Default: YEARLY', width: 'half' });
    await ensureField('lp_pricing', 'discount_badge', 'string', 'input', { note: 'Default: SAVE 20%' });

    // 2. Collection: pricing_plans
    console.log('\n--- Part 2: Pricing Cards (pricing_plans) ---');
    await ensureCollection('pricing_plans', {
        meta: { singleton: false, note: 'Pricing Plans & Logic', icon: 'card_membership', sort_field: 'sort' }
    });

    await ensureField('pricing_plans', 'name', 'string', 'input', { width: 'half' });
    await ensureField('pricing_plans', 'is_popular', 'boolean', 'boolean', { width: 'half' });

    // Price Logic
    await ensureField('pricing_plans', 'price_monthly_display', 'string', 'input', { note: 'e.g. IDR 3.990k', width: 'half' });
    await ensureField('pricing_plans', 'price_yearly_display', 'string', 'input', { note: 'e.g. IDR 39.000k', width: 'half' });
    await ensureField('pricing_plans', 'billing_cycle_text', 'string', 'input', { note: 'e.g. /mo, billed monthly' });

    // Features
    await ensureField('pricing_plans', 'features_list', 'json', 'tags', { note: 'Type feature and hit Enter' });

    // CTA
    await ensureField('pricing_plans', 'button_label', 'string', 'input', { width: 'half' });
    await ensureField('pricing_plans', 'button_url', 'string', 'input', { width: 'half' });

    await ensureField('pricing_plans', 'sort', 'integer', 'input', { note: 'Sort Order' });

    // 3. Permissions
    console.log('\n--- Part 3: Setting Permissions ---');
    try {
        // Public Role (role is null)
        const collections = ['lp_pricing', 'pricing_plans'];

        // This is tricky via SDK as explicit Null role handling can be vague.
        // We'll standard read existing permissions and add if missing.
        const existingPerms = await client.request(readPermissions({
            filter: { role: { _null: true } },
            limit: -1
        }));

        for (const col of collections) {
            const hasPerm = existingPerms.find(p => p.collection === col && p.action === 'read');
            if (hasPerm) {
                console.log(`   ℹ️ Public Read already exists for ${col}`);
            } else {
                await client.request(createPermission({
                    role: null,
                    collection: col,
                    action: 'read',
                    fields: ['*']
                }));
                console.log(`   ✅ Granted Public Read for ${col}`);
            }
        }
    } catch (e) {
        console.error('   ❌ Error setting permissions:', e.message);
    }

    console.log('\nPricing Ecosystem Fixed: Header & Dual-Price Logic ready.');
}

main();
