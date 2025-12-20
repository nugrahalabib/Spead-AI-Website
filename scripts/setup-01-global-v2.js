import dotenv from 'dotenv';
// dotenv.config(); // using hardcoded credentials below to ensure Docker compat

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
        const loginData = await loginRes.json();
        const access_token = loginData.data.access_token;

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
            console.log('⚠️ Collection already exists. Proceeding to fields.');
        } else if (!createCollRes.ok) {
            const err = await createCollRes.json();
            throw new Error(`Failed to create collection: ${JSON.stringify(err)}`);
        } else {
            console.log('✅ Collection created.');
        }

        // 3. Define Fields with Explicit Schemas
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
                meta: { interface: 'input', width: 'half', note: 'Official brand name' },
                schema: {}
            },
            {
                field: 'site_tagline',
                type: 'string',
                meta: { interface: 'input', width: 'half', note: 'Short catchphrase' },
                schema: {}
            },
            {
                field: 'logo_light',
                type: 'uuid',
                meta: { interface: 'file-image', width: 'half', note: 'Logo (Light Mode)' },
                schema: { foreign_key_table: 'directus_files', on_delete: 'SET NULL' }
            },
            {
                field: 'logo_dark',
                type: 'uuid',
                meta: { interface: 'file-image', width: 'half', note: 'Logo (Dark Mode)' },
                schema: { foreign_key_table: 'directus_files', on_delete: 'SET NULL' }
            },
            {
                field: 'favicon',
                type: 'uuid',
                meta: { interface: 'file-image', width: 'half' },
                schema: { foreign_key_table: 'directus_files', on_delete: 'SET NULL' }
            },
            {
                field: 'brand_color_primary',
                type: 'string',
                meta: { interface: 'color', width: 'half' },
                schema: {}
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
                meta: { interface: 'input', width: 'half', note: '%s | Site Name' },
                schema: {}
            },
            {
                field: 'seo_keywords',
                type: 'json',
                meta: { interface: 'tags', width: 'half' },
                schema: {}
            },
            {
                field: 'seo_description_default',
                type: 'text',
                meta: { interface: 'textarea', width: 'full' },
                schema: {}
            },
            {
                field: 'og_image_default',
                type: 'uuid',
                meta: { interface: 'file-image', width: 'full' },
                schema: { foreign_key_table: 'directus_files', on_delete: 'SET NULL' }
            },
            {
                field: 'knowledge_graph_json',
                type: 'json',
                meta: { interface: 'input-code', options: { language: 'json' }, width: 'full', note: 'About data for LLMs.' },
                schema: {}
            },
            {
                field: 'organization_schema_json',
                type: 'json',
                meta: { interface: 'input-code', options: { language: 'json' }, width: 'full', note: 'Schema.org JSON-LD.' },
                schema: {}
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
                meta: { interface: 'input', width: 'half' },
                schema: {}
            },
            {
                field: 'support_email',
                type: 'string',
                meta: { interface: 'input', width: 'half' },
                schema: {}
            },
            {
                field: 'business_address',
                type: 'text',
                meta: { interface: 'textarea', width: 'full' },
                schema: {}
            },
            {
                field: 'copyright_text',
                type: 'string',
                meta: { interface: 'input', width: 'full' },
                schema: {}
            },

            // --- GROUP 4: INTEGRATIONS ---
            {
                field: 'divider_tech',
                type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Integrations', icon: 'code' }, special: ['alias', 'no-data'] },
                schema: null
            },
            {
                field: 'google_analytics_id',
                type: 'string',
                meta: { interface: 'input', width: 'half' },
                schema: {}
            },
            {
                field: 'custom_head_scripts',
                type: 'text',
                meta: { interface: 'input-code', options: { language: 'html' }, width: 'full', note: 'Hooks into <head>' },
                schema: {}
            },
            {
                field: 'custom_body_scripts',
                type: 'text',
                meta: { interface: 'input-code', options: { language: 'html' }, width: 'full', note: 'Hooks into end of <body>' },
                schema: {}
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
                },
                schema: {}
            }
        ];

        console.log(`\n🛠️  Processing ${fields.length} fields...`);

        let successCount = 0;
        let failCount = 0;

        for (const field of fields) {
            process.stdout.write(`   - Field: ${field.field}... `);
            const res = await fetch(`${DIRECTUS_URL}/fields/global_settings`, {
                method: 'POST',
                headers,
                body: JSON.stringify(field)
            });

            if (res.status === 409) {
                // Try PATCH if exists to ensure properties match
                // Note: Directus PATCH fields endpoint is /fields/:collection/:field
                const patchRes = await fetch(`${DIRECTUS_URL}/fields/global_settings/${field.field}`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify(field)
                });
                if (patchRes.ok) {
                    console.log('⚠️ Exists (Updated)');
                    successCount++;
                } else {
                    console.log('⚠️ Existed (Update Skipped/Failed)');
                }
            } else if (!res.ok) {
                const err = await res.json();
                console.log('❌ Failed');
                console.error(`     Error: ${err.errors?.[0]?.message || JSON.stringify(err)}`);
                failCount++;
            } else {
                console.log('✅ Created');
                successCount++;
            }
        }

        // 4. Update Public Permissions
        console.log('\n🔓 Updating permissions (Public Read)...');
        // Check existing permissions first
        const permCheckRes = await fetch(`${DIRECTUS_URL}/permissions?filter[role][_null]=true&filter[collection][_eq]=global_settings`, { headers });
        const permCheckData = await permCheckRes.json();

        if (permCheckData.data && permCheckData.data.length > 0) {
            console.log('   Permission already exists.');
        } else {
            const permRes = await fetch(`${DIRECTUS_URL}/permissions`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    role: null,
                    collection: 'global_settings',
                    action: 'read',
                    fields: ['*']
                })
            });

            if (permRes.ok) {
                console.log('✅ Public read access enabled.');
            } else {
                const data = await permRes.json();
                console.log(`❌ Permission failed: ${data.errors?.[0]?.message || JSON.stringify(data)}`);
            }
        }

        // 5. Final Verification
        console.log('\n🔎 Verifying Schema...');
        const verifyRes = await fetch(`${DIRECTUS_URL}/fields/global_settings`, { headers });
        const verifyData = await verifyRes.json();
        const existingFields = verifyData.data.map(f => f.field);

        console.log(`   Found ${existingFields.length} fields in 'global_settings' (including system fields).`);
        console.log(`   Example fields found: ${existingFields.slice(0, 5).join(', ')}...`);

        const missingFields = fields.map(f => f.field).filter(f => !existingFields.includes(f));

        if (missingFields.length > 0) {
            console.error('\n❌ CRITICAL ERROR: The following fields are MISSING after setup:');
            console.error('   ' + missingFields.join(', '));
            console.error('   Please review the logs above for creation errors.');
            process.exit(1);
        } else {
            console.log('\n✅ VERIFICATION PASSED: All requested fields exist.');
            console.log('🎉 Global Settings Setup is COMPLETE and CORRECT.');
        }

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

setupGlobalSettings();
