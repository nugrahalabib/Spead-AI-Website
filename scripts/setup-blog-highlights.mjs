const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@nugrahalabib.com';
const PASSWORD = 'password123';

async function setupBlogHighlights() {
    console.log('🚀 Setting up Blog Highlights...');

    // 1. Login
    console.log('🔑 Authenticating...');
    let token;
    try {
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        token = loginData.data.access_token;
        console.log('✅ Authenticated!');
    } catch (error) {
        console.error('❌ Authentication Error:', error.message);
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    // Helper to check/create collection
    async function ensureCollection(name, type = 'table', singleton = false) {
        process.stdout.write(`   🔹 Checking collection ${name}... `);
        const res = await fetch(`${DIRECTUS_URL}/collections/${name}`, { headers });
        if (res.ok) {
            console.log(`✅ Exists.`);
            return;
        }

        console.log(`⚠️ Missing. Creating...`);
        const payload = {
            collection: name,
            schema: {},
            meta: {
                singleton: singleton,
                hidden: false,
            }
        };
        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
        console.log(`      ✨ Created ${name}.`);
    }

    // Helper to ensure field
    async function ensureField(collection, field, type, interfaceType = null, options = {}) {
        process.stdout.write(`   🔹 Checking ${collection}.${field}... `);
        const checkRes = await fetch(`${DIRECTUS_URL}/fields/${collection}/${field}`, { headers });
        if (checkRes.ok) {
            console.log(`✅ Exists.`);
            return;
        }

        console.log(`⚠️ Missing. Creating...`);
        const payload = {
            field,
            type,
            meta: {
                interface: interfaceType,
                options: options.interfaceOptions || null,
                width: options.width || 'full',
                hidden: options.hidden || false,
            },
            schema: {
                default_value: options.defaultValue || undefined,
            }
        };

        const res = await fetch(`${DIRECTUS_URL}/fields/${collection}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json();
            console.error(`      ❌ Error creating ${field}:`, JSON.stringify(err, null, 2));
        } else {
            console.log(`      ✨ Created ${field}.`);
        }
    }

    // 1. Create Main Collection (Singleton)
    await ensureCollection('blog_highlights', 'table', true);
    await ensureField('blog_highlights', 'headline', 'string', 'input', { defaultValue: 'Latest Insights' });

    // 2. Create Junction Collection
    await ensureCollection('blog_highlights_posts', 'table', false);

    // 3. Create Fields in Junction
    // FK to Blog Highlights
    await ensureField('blog_highlights_posts', 'blog_highlights_id', 'integer', null, { hidden: true });
    // FK to Posts
    await ensureField('blog_highlights_posts', 'posts_id', 'integer', null, { hidden: true });

    // 4. Create M2M Alias Field in Main Collection
    // This is the "magic" field that shows the M2M interface
    process.stdout.write(`   🔹 Checking blog_highlights.selected_posts (M2M)... `);
    const m2mCheck = await fetch(`${DIRECTUS_URL}/fields/blog_highlights/selected_posts`, { headers });
    if (m2mCheck.ok) {
        console.log(`✅ Exists.`);
    } else {
        console.log(`⚠️ Missing. Creating...`);
        const m2mPayload = {
            field: 'selected_posts',
            type: 'alias',
            meta: {
                interface: 'list-m2m',
                special: ['m2m'],
                options: {
                    enableCreate: false, // Don't create new posts from here, just select
                }
            },
            schema: null
        };
        // We need to link the relation manually if we create the alias? 
        // Actually, creating the relation object is what links them.

        await fetch(`${DIRECTUS_URL}/fields/blog_highlights`, {
            method: 'POST',
            headers,
            body: JSON.stringify(m2mPayload)
        });
        console.log(`      ✨ Created alias field.`);

        // Create the Relation objects
        console.log(`   🔹 Linking relations...`);

        // Relation 1: Highlights -> Junction
        await fetch(`${DIRECTUS_URL}/relations`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                collection: 'blog_highlights_posts',
                field: 'blog_highlights_id',
                related_collection: 'blog_highlights',
                schema: { onDelete: 'CASCADE' },
                meta: {
                    one_field: 'selected_posts', // This connects the alias
                    junction_field: 'posts_id',
                }
            })
        });

        // Relation 2: Junction -> Posts
        await fetch(`${DIRECTUS_URL}/relations`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                collection: 'blog_highlights_posts',
                field: 'posts_id',
                related_collection: 'posts',
                schema: { onDelete: 'CASCADE' },
                meta: {
                    junction_field: 'blog_highlights_id',
                }
            })
        });
        console.log(`      ✨ Relations linked.`);
    }

    console.log('\n✨ Blog Highlights Setup Complete!');
}

setupBlogHighlights();
