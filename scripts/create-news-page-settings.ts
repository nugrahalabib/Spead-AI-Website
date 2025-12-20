/**
 * Create News Page Settings Collection in Directus
 * 
 * Singleton collection for managing:
 * - SEO metadata (title, description, keywords)
 * - OpenGraph settings
 * - GEO targeting
 * - Hero/Header content
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('📰 Creating News Page Settings Collection...\n');

    // 1. Authenticate
    const loginRes = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated\n');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const api = async (method: string, path: string, body?: any) => {
        const res = await fetch(`${URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
        return { ok: res.ok, status: res.status, data: await res.json().catch(() => null) };
    };

    // 2. Create Collection (Singleton)
    console.log('📂 Creating news_page_settings collection...');
    const collRes = await api('POST', '/collections', {
        collection: 'news_page_settings',
        meta: {
            singleton: true,
            icon: 'newspaper',
            note: 'SEO, GEO, and Hero settings for the News/Newsroom page',
            translations: [
                { language: 'en-US', translation: 'News Page Settings' },
                { language: 'id-ID', translation: 'Pengaturan Halaman Berita' }
            ]
        },
        schema: {}
    });
    console.log('   ' + (collRes.ok ? '✓ Collection created' : '✓ Collection exists'));

    // 3. Create Fields
    console.log('\n📝 Creating fields...\n');

    const fields = [
        // ========= HERO SECTION =========
        {
            field: 'hero_divider',
            type: 'alias',
            meta: {
                interface: 'presentation-divider',
                special: ['alias', 'no-data'],
                options: { title: '🎯 Hero Section', icon: 'star' },
                width: 'full',
                sort: 1
            }
        },
        {
            field: 'hero_badge',
            type: 'string',
            schema: { default_value: 'Live Intelligence Feed' },
            meta: {
                interface: 'input',
                note: 'Badge text di atas judul (contoh: "Live Intelligence Feed")',
                width: 'half',
                sort: 2
            }
        },
        {
            field: 'hero_title',
            type: 'string',
            schema: { default_value: 'Spead Newsroom.' },
            meta: {
                interface: 'input',
                note: 'Judul utama hero section',
                width: 'half',
                sort: 3
            }
        },
        {
            field: 'hero_subtitle',
            type: 'text',
            schema: { default_value: 'The frontier of Enterprise AI.\nUpdates from the Neural Operating System.' },
            meta: {
                interface: 'input-multiline',
                note: 'Subtitle/tagline di bawah judul',
                width: 'full',
                sort: 4
            }
        },

        // ========= SEO SECTION =========
        {
            field: 'seo_divider',
            type: 'alias',
            meta: {
                interface: 'presentation-divider',
                special: ['alias', 'no-data'],
                options: { title: '🔍 SEO Settings', icon: 'search' },
                width: 'full',
                sort: 10
            }
        },
        {
            field: 'seo_title',
            type: 'string',
            schema: { default_value: 'Newsroom | Spead AI - Latest Enterprise AI Updates' },
            meta: {
                interface: 'input',
                note: 'Title tag untuk Google (max 60 karakter)',
                width: 'full',
                sort: 11,
                options: { softLength: 60 }
            }
        },
        {
            field: 'seo_description',
            type: 'text',
            schema: { default_value: 'Stay updated with the latest news on Enterprise AI, self-healing systems, product updates, security alerts, and the Expert Economy from Spead AI.' },
            meta: {
                interface: 'input-multiline',
                note: 'Meta description untuk Google (max 160 karakter)',
                width: 'full',
                sort: 12,
                options: { softLength: 160 }
            }
        },
        {
            field: 'seo_keywords',
            type: 'json',
            meta: {
                interface: 'tags',
                display: 'labels',
                note: 'Keywords untuk SEO. Ketik dan tekan Enter.',
                width: 'full',
                sort: 13,
                options: { presets: ['Enterprise AI', 'AI News', 'Spead AI', 'Legal Tech'] }
            }
        },
        {
            field: 'canonical_url',
            type: 'string',
            schema: { default_value: 'https://spead.ai/news' },
            meta: {
                interface: 'input',
                note: 'Canonical URL halaman',
                width: 'half',
                sort: 14
            }
        },
        {
            field: 'robots',
            type: 'string',
            schema: { default_value: 'index, follow' },
            meta: {
                interface: 'select-dropdown',
                note: 'Robots directive untuk search engines',
                width: 'half',
                sort: 15,
                options: {
                    choices: [
                        { text: 'Index, Follow (Normal)', value: 'index, follow' },
                        { text: 'Index, No Follow', value: 'index, nofollow' },
                        { text: 'No Index, Follow', value: 'noindex, follow' },
                        { text: 'No Index, No Follow', value: 'noindex, nofollow' }
                    ]
                }
            }
        },

        // ========= OPENGRAPH SECTION =========
        {
            field: 'og_divider',
            type: 'alias',
            meta: {
                interface: 'presentation-divider',
                special: ['alias', 'no-data'],
                options: { title: '📱 OpenGraph (Social Share)', icon: 'share' },
                width: 'full',
                sort: 20
            }
        },
        {
            field: 'og_title',
            type: 'string',
            meta: {
                interface: 'input',
                note: 'Judul saat di-share ke Facebook/LinkedIn. Kosongkan untuk gunakan SEO Title.',
                width: 'full',
                sort: 21
            }
        },
        {
            field: 'og_description',
            type: 'text',
            meta: {
                interface: 'input-multiline',
                note: 'Deskripsi saat di-share. Kosongkan untuk gunakan SEO Description.',
                width: 'full',
                sort: 22
            }
        },
        {
            field: 'og_image',
            type: 'uuid',
            schema: { foreign_key_table: 'directus_files' },
            meta: {
                interface: 'file-image',
                display: 'image',
                note: 'Gambar preview saat di-share (rekomendasi: 1200x630px)',
                width: 'half',
                sort: 23,
                special: ['file']
            }
        },
        {
            field: 'twitter_card',
            type: 'string',
            schema: { default_value: 'summary_large_image' },
            meta: {
                interface: 'select-dropdown',
                note: 'Tipe Twitter card',
                width: 'half',
                sort: 24,
                options: {
                    choices: [
                        { text: 'Summary Large Image', value: 'summary_large_image' },
                        { text: 'Summary', value: 'summary' }
                    ]
                }
            }
        },

        // ========= GEO TARGETING SECTION =========
        {
            field: 'geo_divider',
            type: 'alias',
            meta: {
                interface: 'presentation-divider',
                special: ['alias', 'no-data'],
                options: { title: '🌍 GEO Targeting', icon: 'public' },
                width: 'full',
                sort: 30
            }
        },
        {
            field: 'geo_region',
            type: 'string',
            schema: { default_value: 'ID' },
            meta: {
                interface: 'select-dropdown',
                note: 'Target region untuk Google (ISO 3166-1)',
                width: 'half',
                sort: 31,
                options: {
                    choices: [
                        { text: '🇮🇩 Indonesia', value: 'ID' },
                        { text: '🇺🇸 United States', value: 'US' },
                        { text: '🇬🇧 United Kingdom', value: 'GB' },
                        { text: '🇸🇬 Singapore', value: 'SG' },
                        { text: '🌏 Global (No targeting)', value: '' }
                    ],
                    allowOther: true
                }
            }
        },
        {
            field: 'geo_placename',
            type: 'string',
            schema: { default_value: 'Jakarta, Indonesia' },
            meta: {
                interface: 'input',
                note: 'Nama lokasi untuk geo meta tag',
                width: 'half',
                sort: 32
            }
        },
        {
            field: 'geo_position',
            type: 'string',
            schema: { default_value: '-6.2088;106.8456' },
            meta: {
                interface: 'input',
                note: 'Koordinat (latitude;longitude)',
                width: 'half',
                sort: 33,
                options: { placeholder: '-6.2088;106.8456' }
            }
        },
        {
            field: 'language',
            type: 'string',
            schema: { default_value: 'en' },
            meta: {
                interface: 'select-dropdown',
                note: 'Bahasa konten utama',
                width: 'half',
                sort: 34,
                options: {
                    choices: [
                        { text: 'English', value: 'en' },
                        { text: 'Indonesian', value: 'id' },
                        { text: 'English (US)', value: 'en-US' },
                        { text: 'English (UK)', value: 'en-GB' }
                    ]
                }
            }
        },

        // ========= ADVANCED SECTION =========
        {
            field: 'advanced_divider',
            type: 'alias',
            meta: {
                interface: 'presentation-divider',
                special: ['alias', 'no-data'],
                options: { title: '⚙️ Advanced Settings', icon: 'settings' },
                width: 'full',
                sort: 40
            }
        },
        {
            field: 'structured_data_enabled',
            type: 'boolean',
            schema: { default_value: true },
            meta: {
                interface: 'boolean',
                note: 'Aktifkan JSON-LD structured data untuk halaman ini',
                width: 'half',
                sort: 41
            }
        },
        {
            field: 'newsletter_enabled',
            type: 'boolean',
            schema: { default_value: true },
            meta: {
                interface: 'boolean',
                note: 'Tampilkan section newsletter di bawah halaman',
                width: 'half',
                sort: 42
            }
        },
        {
            field: 'newsletter_title',
            type: 'string',
            schema: { default_value: "Don't miss a beat." },
            meta: {
                interface: 'input',
                note: 'Judul section newsletter',
                width: 'half',
                sort: 43
            }
        },
        {
            field: 'newsletter_subtitle',
            type: 'string',
            schema: { default_value: 'Join 15,000+ enterprise leaders in the intelligence stream. No noise, just signal.' },
            meta: {
                interface: 'input',
                note: 'Subtitle section newsletter',
                width: 'half',
                sort: 44
            }
        }
    ];

    for (const field of fields) {
        const res = await api('POST', '/fields/news_page_settings', field);
        console.log(`   ${res.ok ? '✓' : '✗'} ${field.field}`);
    }

    // 4. Enable public read access
    console.log('\n🔓 Enabling public read access...');
    await api('POST', '/permissions', {
        collection: 'news_page_settings',
        action: 'read',
        role: null,
        permissions: {},
        fields: ['*']
    });
    console.log('   ✓ Public access enabled');

    // 5. Create initial data
    console.log('\n📝 Creating initial settings...');
    await api('POST', '/items/news_page_settings', {
        hero_badge: 'Live Intelligence Feed',
        hero_title: 'Spead Newsroom.',
        hero_subtitle: 'The frontier of Enterprise AI.\nUpdates from the Neural Operating System.',
        seo_title: 'Newsroom | Spead AI - Latest Enterprise AI Updates',
        seo_description: 'Stay updated with the latest news on Enterprise AI, self-healing systems, product updates, security alerts, and the Expert Economy from Spead AI.',
        seo_keywords: ['Enterprise AI', 'AI News', 'Spead AI', 'Self-Healing Systems', 'Legal Tech AI'],
        canonical_url: 'https://spead.ai/news',
        robots: 'index, follow',
        twitter_card: 'summary_large_image',
        geo_region: 'ID',
        geo_placename: 'Jakarta, Indonesia',
        geo_position: '-6.2088;106.8456',
        language: 'en',
        structured_data_enabled: true,
        newsletter_enabled: true,
        newsletter_title: "Don't miss a beat.",
        newsletter_subtitle: 'Join 15,000+ enterprise leaders in the intelligence stream. No noise, just signal.'
    });
    console.log('   ✓ Initial settings created');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ News Page Settings Collection Created!');
    console.log('');
    console.log('   Go to Directus → Settings → News Page Settings');
    console.log('   to manage SEO, GEO, and Hero content.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();
