import dotenv from 'dotenv';

// Load environment variables (optional, but we use hardcoded for Docker reliability)
dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function setupGlobalSettings() {
    try {
        console.log(`🔌 Connecting to Directus at ${DIRECTUS_URL}...`);

        // 1. Authenticate
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const { data: { access_token } } = await loginRes.json();
        const headers = {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Authenticated.');

        // 2. Create Collection (Singleton)
        console.log('📦 Creating collection: global_settings...');
        const createCollRes = await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                collection: 'global_settings',
                singleton: true,
                note: 'Site-wide configuration for SEO, Branding, and Integrations.',
                sort: 1
            })
        });

        if (createCollRes.status === 409) {
            console.log('⚠️ Collection already exists. Skipping creation.');
        } else if (!createCollRes.ok) {
            const err = await createCollRes.json();
            throw new Error(`Failed to create collection: ${JSON.stringify(err)}`);
        } else {
            console.log('✅ Collection created.');
        }

        // 3. Define Fields
        const fields = [
            // --- GROUP 1: BRAND IDENTITY ---
            {
                field: 'divider_brand',
                type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Brand Identity', icon: 'fingerprint' }, special: ['alias', 'no-data'] },
                schema: null
            },
            {
                field: 'site_name',
                type: 'string',
                meta: { interface: 'input', width: 'half', note: 'Official brand name (e.g. Spead AI)' }
            },
            {
                field: 'site_tagline',
                type: 'string',
                meta: { interface: 'input', width: 'half', note: 'Short catchphrase' }
            },
            {
                field: 'logo_light',
                type: 'uuid',
                meta: { interface: 'file-image', width: 'half', note: 'Logo for Light Mode (Dark text)' },
                schema: {
                    foreign_key_table: 'directus_files',
                    foreign_key_column: 'id',
                    constraint_name: 'global_settings_logo_light_foreign',
                    on_delete: 'SET NULL'
                }
            },
            {
                field: 'logo_dark',
                type: 'uuid',
                meta: { interface: 'file-image', width: 'half', note: 'Logo for Dark Mode (Light text)' },
                schema: { foreign_key_table: 'directus_files', on_delete: 'SET NULL' }
            },
            {
                field: 'favicon',
                type: 'uuid',
                meta: { interface: 'file-image', width: 'half', note: 'Browser tab icon' },
                schema: { foreign_key_table: 'directus_files', on_delete: 'SET NULL' }
            },
            {
                field: 'brand_color_primary',
                type: 'string',
                meta: { interface: 'color', width: 'half', note: 'HEX code override' }
            },

            // --- GROUP 2: SEO & GEO ---
            {
                field: 'divider_seo',
                type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'SEO & Knowledge Graph', icon: 'search' }, special: ['alias', 'no-data'] },
                schema: null
            },
            {
                field: 'seo_title_template',
                type: 'string',
                meta: { interface: 'input', width: 'half', note: 'e.g. "%s | Spead AI"' }
            },
            {
                field: 'seo_keywords',
                type: 'json',
                meta: { interface: 'tags', width: 'half', note: 'Default keywords (Press Enter to add)' }
            },
            {
                field: 'seo_description_default',
                type: 'text',
                meta: { interface: 'textarea', width: 'full', note: 'Fallback meta description' }
            },
            {
                field: 'og_image_default',
                type: 'uuid',
                meta: { interface: 'file-image', width: 'full', note: 'Default social sharing image' },
                schema: { foreign_key_table: 'directus_files', on_delete: 'SET NULL' }
            },
            {
                field: 'knowledge_graph_json',
                type: 'json',
                meta: { interface: 'input-code', options: { language: 'json' }, width: 'full', note: 'About data optimized for LLM indexing (Gemini/GPT).' }
            },
            {
                field: 'organization_schema_json',
                type: 'json',
                meta: { interface: 'input-code', options: { language: 'json' }, width: 'full', note: 'Schema.org JSON-LD for Google Rich Results.' }
            },

            // --- GROUP 3: CONTACT & LEGAL ---
            {
                field: 'divider_contact',
                type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Contact & Legal', icon: 'gavel' }, special: ['alias', 'no-data'] },
                schema: null
            },
            {
                field: 'contact_email',
                type: 'string',
                meta: { interface: 'input', width: 'half' }
            },
            {
                field: 'support_email',
                type: 'string',
                meta: { interface: 'input', width: 'half' }
            },
            {
                field: 'business_address',
                type: 'text',
                meta: { interface: 'textarea', width: 'full', note: 'Address for Local SEO' }
            },
            {
                field: 'copyright_text',
                type: 'string',
                meta: { interface: 'input', width: 'full', note: 'e.g. "© 2025 Spead AI Inc."' }
            },

            // --- GROUP 4: INTEGRATIONS ---
            {
                field: 'divider_tech',
                type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Technical Integrations', icon: 'code' }, special: ['alias', 'no-data'] },
                schema: null
            },
            {
                field: 'google_analytics_id',
                type: 'string',
                meta: { interface: 'input', width: 'half', note: 'G-XXXXXXXX' }
            },
            {
                field: 'custom_head_scripts',
                type: 'text', // Changed from json/code to text for simple storage, interface handles display
                meta: { interface: 'input-code', options: { language: 'html' }, width: 'full', note: 'Hooks into <head>' }
            },
            {
                field: 'custom_body_scripts',
                type: 'text',
                meta: { interface: 'input-code', options: { language: 'html' }, width: 'full', note: 'Hooks into end of <body>' }
            },

            // --- GROUP 5: SOCIAL ---
            {
                field: 'divider_social',
                type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Social Media', icon: 'share' }, special: ['alias', 'no-data'] },
                schema: null
            },
            {
                field: 'social_links',
                type: 'json',
                meta: {
                    interface: 'list',
                    width: 'full',
                    options: {
                        fields: [
                            { field: 'platform', type: 'string', name: 'Platform', meta: { width: 'half', interface: 'input' } },
                            { field: 'url', type: 'string', name: 'URL', meta: { width: 'half', interface: 'input' } },
                            { field: 'icon_name', type: 'string', name: 'Icon Name (Lucide)', meta: { width: 'half', interface: 'input' } }
                        ]
                    }
                }
            }
        ];

        console.log('🛠️  Creating fields...');

        // We create fields sequentially to maintain order and avoid race conditions
        for (const field of fields) {
            process.stdout.write(`   - Field: ${field.field}... `);
            const res = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
                method: 'POST',
                headers,
                body: JSON.stringify(field)
            });

            if (res.status === 409) { // Conflict/Exists
                // If it exists, we might want to update it to ensure settings match, but strictly we skip to avoid errors
                console.log('⚠️ Exists');
            } else if (!res.ok) {
                const err = await res.json();
                console.log('❌ Failed');
                console.error(JSON.stringify(err, null, 2));
            } else {
                console.log('✅ Created');
            }
        }

        // 4. Update Public Permissions
        console.log('🔓 Updating permissions (Public Read)...');
        // Get Public Role ID (usually implicitly 0 or handled via 'public' role name, but safely we query)
        // Directus public role is null/none in some contexts or has a specific UUID. 
        // Actually, we create a rule for role: null to allow public access.

        const permRes = await fetch(`${DIRECTUS_URL}/permissions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                role: null, // Public
                collection: 'global_settings',
                action: 'read',
                fields: ['*']
            })
        });

        if (permRes.ok) {
            console.log('✅ Public read access enabled.');
        } else {
            // It might already exist
            const data = await permRes.json();
            if (permRes.status !== 200) console.log(`ℹ️  Permission status: ${JSON.stringify(data.errors?.[0]?.message || 'Unknown')}`);
        }

        console.log('\n🎉 Success: Super-Complete Global Settings Created');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
    }
}

setupGlobalSettings();
