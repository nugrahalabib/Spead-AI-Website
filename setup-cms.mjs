const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai'; // Updated to match docker-compose
const PASSWORD = 'password123';

async function setup() {
    console.log('🚀 Starting CMS Setup for AI Tech Company...');

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
        console.log('⚠️ Make sure Directus is running and credentials in docker-compose.yml match.');
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    // Helper to create collection
    async function createCollection(name, options = {}) {
        console.log(`📦 Creating collection: ${name}...`);
        try {
            const checkRes = await fetch(`${DIRECTUS_URL}/collections/${name}`, { headers });
            if (checkRes.ok) {
                console.log(`   ⚠️ Collection ${name} already exists. Skipping.`);
                return;
            }

            const res = await fetch(`${DIRECTUS_URL}/collections`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ collection: name, schema: {}, meta: {}, ...options }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.errors[0].message);
            }
            console.log(`   ✅ Collection ${name} created.`);
        } catch (error) {
            console.error(`   ❌ Error creating ${name}:`, error.message);
        }
    }

    // Helper to create field
    async function createField(collection, field, type, interfaceType = null, options = {}) {
        console.log(`   🔹 Creating field ${field} in ${collection}...`);
        try {
            const checkRes = await fetch(`${DIRECTUS_URL}/fields/${collection}/${field}`, { headers });
            if (checkRes.ok) {
                console.log(`      ⚠️ Field ${field} already exists. Skipping.`);
                return;
            }

            const payload = {
                field,
                type,
                meta: {
                    interface: interfaceType,
                    special: options.special || null,
                    options: options.interfaceOptions || null,
                    note: options.note || null,
                    hidden: options.hidden || false,
                    readonly: options.readonly || false,
                },
                schema: {
                    is_unique: options.unique || false,
                }
            };

            const res = await fetch(`${DIRECTUS_URL}/fields/${collection}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.errors[0].message);
            }
            console.log(`      ✅ Field ${field} created.`);
        } catch (error) {
            console.error(`      ❌ Error creating field ${field}:`, error.message);
        }
    }

    // --- 2. Create Collections ---

    // Global Settings (Singleton)
    await createCollection('global_settings', {
        meta: { icon: 'settings', note: 'Global SEO and Site Settings', singleton: true }
    });

    // Landing Page (Singleton)
    await createCollection('landing_page', {
        meta: { icon: 'home', note: 'Homepage Content', singleton: true }
    });

    // Solutions
    await createCollection('solutions', {
        meta: { icon: 'extension', note: 'Product Solutions/Modules' }
    });

    // Use Cases
    await createCollection('use_cases', {
        meta: { icon: 'business_center', note: 'Industry Use Cases' }
    });

    // Pricing Plans
    await createCollection('pricing_plans', {
        meta: { icon: 'attach_money', note: 'Pricing Tiers' }
    });

    // Posts (Blog)
    await createCollection('posts', {
        meta: { icon: 'article', note: 'Blog Posts' }
    });

    // Bio Links
    await createCollection('bio_links', {
        meta: { icon: 'link', note: 'Link in Bio' }
    });


    // --- 3. Create Fields ---

    // === GLOBAL SETTINGS ===
    await createField('global_settings', 'site_name', 'string', 'input');
    await createField('global_settings', 'site_description', 'text', 'input-multiline');
    await createField('global_settings', 'site_tagline', 'string', 'input');
    await createField('global_settings', 'seo_keywords', 'string', 'tags', { note: 'CSV keywords' });
    await createField('global_settings', 'website_logo', 'uuid', 'file-image');
    await createField('global_settings', 'contact_email', 'string', 'input');
    await createField('global_settings', 'contact_phone', 'string', 'input');
    await createField('global_settings', 'contact_address', 'string', 'input');
    await createField('global_settings', 'social_linkedin', 'string', 'input');
    await createField('global_settings', 'social_twitter', 'string', 'input');
    await createField('global_settings', 'social_instagram', 'string', 'input');
    await createField('global_settings', 'social_github', 'string', 'input');

    // === LANDING PAGE ===
    // Hero
    await createField('landing_page', 'hero_headline', 'string', 'input');
    await createField('landing_page', 'hero_subheadline', 'string', 'input');
    await createField('landing_page', 'hero_cta_primary', 'string', 'input');
    await createField('landing_page', 'hero_cta_secondary', 'string', 'input');
    await createField('landing_page', 'hero_image', 'uuid', 'file-image');
    // Problem
    await createField('landing_page', 'problem_headline', 'string', 'input');
    // ... skipping some detailed stats for brevity, focusing on core connectivity first
    await createField('landing_page', 'comparison_headline', 'string', 'input');
    await createField('landing_page', 'roi_headline', 'string', 'input');
    await createField('landing_page', 'security_headline', 'string', 'input');
    await createField('landing_page', 'pricing_headline', 'string', 'input');

    // === SOLUTIONS ===
    await createField('solutions', 'title', 'string', 'input');
    await createField('solutions', 'description', 'text', 'input-multiline');
    await createField('solutions', 'icon', 'string', 'input', { note: 'Lucide icon name' });
    await createField('solutions', 'sort', 'integer', 'input');

    // === USE CASES ===
    await createField('use_cases', 'title', 'string', 'input');
    await createField('use_cases', 'description', 'text', 'input-multiline');
    await createField('use_cases', 'image', 'uuid', 'file-image');
    await createField('use_cases', 'sort', 'integer', 'input');

    // === PRICING PLANS ===
    await createField('pricing_plans', 'name', 'string', 'input');
    await createField('pricing_plans', 'subtitle', 'string', 'input');
    await createField('pricing_plans', 'cta_text', 'string', 'input');
    await createField('pricing_plans', 'price', 'string', 'input'); // Added price field
    await createField('pricing_plans', 'is_popular', 'boolean', 'boolean');
    await createField('pricing_plans', 'sort', 'integer', 'input');
    await createField('pricing_plans', 'features', 'json', 'list', { note: 'List of features' });

    // === POSTS ===
    await createField('posts', 'title', 'string', 'input');
    await createField('posts', 'slug', 'string', 'input', { unique: true });
    await createField('posts', 'content', 'text', 'input-rich-text-html');
    await createField('posts', 'image', 'uuid', 'file-image');
    await createField('posts', 'published_date', 'dateTime', 'datetime');
    await createField('posts', 'seo_title', 'string', 'input');
    await createField('posts', 'seo_description', 'text', 'input-multiline');
    await createField('posts', 'seo_keywords', 'string', 'tags');
    await createField('posts', 'status', 'string', 'select-dropdown', {
        interfaceOptions: {
            choices: [
                { text: 'Draft', value: 'draft' },
                { text: 'Published', value: 'published' },
                { text: 'Archived', value: 'archived' }
            ]
        }
    });

    // === PERMISSIONS (PUBLIC READ) ===
    console.log('🔓 Setting Public Read Permissions...');
    try {
        // Get Public Role ID
        const rolesRes = await fetch(`${DIRECTUS_URL}/roles`, { headers });
        const rolesData = await rolesRes.json();
        const publicRole = rolesData.data.find(r => r.name === 'Public' || r.icon === 'public');
        // Note: Public role usually doesn't show up in /roles for some versions, it's null.
        // In Directus, public permissions are permissions where role IS NULL.

        const collectionsToExpose = ['global_settings', 'landing_page', 'solutions', 'use_cases', 'pricing_plans', 'posts', 'bio_links'];

        for (const col of collectionsToExpose) {
            const permRes = await fetch(`${DIRECTUS_URL}/permissions`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    role: null, // Public
                    collection: col,
                    action: 'read',
                    fields: ['*']
                })
            });
            if (permRes.ok) console.log(`   ✅ Public read access granted for ${col}`);
            else console.log(`   ⚠️ Failed to set public read for ${col} (might already exist)`);
        }

    } catch (e) {
        console.error('Error setting permissions:', e.message);
    }

    // === POPULATE INITIAL DATA (Optional but helpful) ===
    console.log('🌱 Seeding Initial Data...');
    try {
        // Seed Global Settings
        await fetch(`${DIRECTUS_URL}/items/global_settings`, {
            method: 'PATCH', // Helper if singleton exists
            headers,
            body: JSON.stringify({
                site_name: 'Spead AI',
                site_description: 'The AI Workspace for the Expertise Economy.',
                seo_keywords: 'AI, Enterprise, SaaS'
            })
        });

        // If PATCH failed (empty), try POST? Singleton usually initialized empty.
    } catch (e) {
        console.log('Error seeding data:', e.message);
    }

    console.log('✨ CMS Setup Complete!');
}

setup();
