import { createDirectus, rest, staticToken, createCollection, updateCollection, createField, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
    console.log("🔑 Authenticating...");
    const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@spead.ai', password: 'password123' })
    });
    const data = await response.json();
    if (!data.data?.access_token) throw new Error("Authentication Failed: " + JSON.stringify(data));
    return data.data.access_token;
}

async function setupLpHero() {
    console.log('🚀 Starting lp_hero Schema Setup...');

    try {
        const token = await getAuthToken();

        // Initialize Authenticated Client
        const client = createDirectus(DIRECTUS_URL)
            .with(staticToken(token))
            .with(rest());

        // 1. Create or Update Singleton Collection
        console.log('📦 configuring collection...');
        try {
            await client.request(createCollection({
                collection: 'lp_hero',
                singleton: true,
                schema: {
                    comment: 'Hero Section Content'
                }
            }));
            console.log('✅ Collection created.');
        } catch (e) {
            if (e.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
                console.log('ℹ️ Collection exists, updating...');
                await client.request(updateCollection('lp_hero', {
                    singleton: true // Ensure singleton
                }));
            } else {
                throw e;
            }
        }

        // 2. Define Fields
        const fields = [
            // BADGE SYSTEM
            {
                collection: 'lp_hero',
                field: 'badge_text',
                type: 'string',
                schema: { is_nullable: true },
                meta: { interface: 'input', display: 'raw', sort: 1, width: 'half', note: 'e.g. ENTERPRISE V2.0 LIVE' }
            },
            {
                collection: 'lp_hero',
                field: 'badge_style',
                type: 'string',
                schema: { is_nullable: true, default_value: 'live_pulse' },
                meta: {
                    interface: 'select-dropdown',
                    sort: 2,
                    width: 'half',
                    options: {
                        choices: [
                            { text: '🟢 Live Pulse (Green Dot)', value: 'live_pulse' },
                            { text: '✨ AI Intelligence (Purple Stars)', value: 'ai_sparkle' },
                            { text: '🚧 Beta Access', value: 'beta_warning' },
                            { text: '🚀 New Feature', value: 'rocket_launch' }
                        ]
                    }
                }
            },
            // SMART HEADLINES
            {
                collection: 'lp_hero',
                field: 'headline',
                type: 'text',
                schema: { is_nullable: true },
                meta: { interface: 'textarea', display: 'raw', sort: 3, note: 'Use {Text:Color} syntax. Example: Stop {Burning:violet} Billable Hours' }
            },
            {
                collection: 'lp_hero',
                field: 'subheadline',
                type: 'text',
                schema: { is_nullable: true },
                meta: { interface: 'textarea', display: 'raw', sort: 4 }
            },
            // CTA
            {
                collection: 'lp_hero',
                field: 'cta_primary_label',
                type: 'string',
                schema: { is_nullable: true },
                meta: { interface: 'input', sort: 5, width: 'half' }
            },
            {
                collection: 'lp_hero',
                field: 'cta_primary_url',
                type: 'string',
                schema: { is_nullable: true },
                meta: { interface: 'input', sort: 6, width: 'half' }
            },
            {
                collection: 'lp_hero',
                field: 'cta_secondary_label',
                type: 'string',
                schema: { is_nullable: true },
                meta: { interface: 'input', sort: 7, width: 'half' }
            },
            {
                collection: 'lp_hero',
                field: 'cta_secondary_url',
                type: 'string',
                schema: { is_nullable: true },
                meta: { interface: 'input', sort: 8, width: 'half' }
            },
            // VISUAL SWITCHER
            {
                collection: 'lp_hero',
                field: 'hero_image',
                type: 'uuid',
                schema: { is_nullable: true },
                meta: { interface: 'file-image', display: 'image', sort: 9, width: 'half' }
            },
            {
                collection: 'lp_hero',
                field: 'visual_variant',
                type: 'string',
                schema: { is_nullable: true, default_value: 'interactive_3d' },
                meta: {
                    interface: 'select-dropdown',
                    sort: 10,
                    width: 'half',
                    options: {
                        choices: [
                            { text: '🖱️ Mouse-Follow 3D Tilt', value: 'interactive_3d' },
                            { text: '🔮 Glassmorphism Overlay', value: 'static_glass' },
                            { text: '📄 Clean Flat Design', value: 'flat_modern' }
                        ]
                    }
                }
            }
        ];

        console.log('🏗️ Creating/Updating fields...');
        for (const field of fields) {
            try {
                await client.request(createField(field.collection, field));
                console.log(`   + Created field: ${field.field}`);
            } catch (e) {
                if (e.errors?.[0]?.extensions?.code === 'field_already_exists') {
                    console.log(`   = Field exists: ${field.field}`);
                } else {
                    console.error(`   ! Error creating ${field.field}:`, e.message);
                }
            }
        }

        console.log('✅ Final Setup Complete!');

    } catch (error) {
        console.error('❌ FATAL ERROR:', error);
    }
}

setupLpHero();
