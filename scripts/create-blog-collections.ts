/**
 * Create Blog Collections for Directus
 * Duplicates the quality of news collections (posts, categories, news_page_settings)
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🔧 Creating Blog Collections (Duplicate of News Quality)\n');
    console.log('═'.repeat(60));

    // Auth
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
        return { ok: res.ok, status: res.status, data: res.ok ? await res.json().catch(() => ({})) : null };
    };

    // ═══════════════════════════════════════════════════════════════
    // 1. CREATE blog_categories COLLECTION
    // ═══════════════════════════════════════════════════════════════
    console.log('📁 Creating blog_categories collection...');

    await api('POST', '/collections', {
        collection: 'blog_categories',
        meta: {
            icon: 'category',
            note: 'Kategori untuk Blog',
            display_template: '{{name}}',
            sort_field: 'sort'
        },
        schema: {}
    });
    console.log('   ✓ Collection created');

    // Fields for blog_categories
    const categoryFields = [
        { field: 'name', type: 'string', meta: { interface: 'input', required: true, width: 'half', sort: 1 } },
        { field: 'slug', type: 'string', meta: { interface: 'input', required: true, width: 'half', sort: 2, note: 'URL-friendly identifier' } },
        { field: 'color', type: 'string', meta: { interface: 'select-color', width: 'half', sort: 3 } },
        { field: 'icon', type: 'string', meta: { interface: 'input', width: 'half', sort: 4, note: 'Lucide icon name' } },
        { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true, sort: 5 } }
    ];

    for (const f of categoryFields) {
        await api('POST', '/fields/blog_categories', f);
    }
    console.log('   ✓ Fields created\n');

    // ═══════════════════════════════════════════════════════════════
    // 2. CREATE blogs COLLECTION
    // ═══════════════════════════════════════════════════════════════
    console.log('📁 Creating blogs collection...');

    await api('POST', '/collections', {
        collection: 'blogs',
        meta: {
            icon: 'article',
            note: 'Blog posts (separate from News)',
            display_template: '{{title}}',
            archive_field: 'status',
            archive_value: 'archived',
            unarchive_value: 'draft',
            sort_field: 'sort'
        },
        schema: {}
    });
    console.log('   ✓ Collection created');

    // Fields for blogs (same quality as posts)
    const blogFields = [
        // Divider: Basic Info
        { field: 'divider_basic', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 1, options: { title: 'Informasi Dasar', icon: 'info' } } },
        { field: 'status', type: 'string', schema: { default_value: 'draft' }, meta: { interface: 'select-dropdown', width: 'half', sort: 2, options: { choices: [{ text: 'Draft', value: 'draft' }, { text: 'Published', value: 'published' }, { text: 'Archived', value: 'archived' }] } } },
        { field: 'is_featured', type: 'string', schema: { default_value: 'no' }, meta: { interface: 'select-dropdown', width: 'half', sort: 3, note: 'Tampilkan sebagai artikel utama?', options: { choices: [{ text: 'Ya', value: 'yes' }, { text: 'Tidak', value: 'no' }] } } },
        { field: 'title', type: 'string', meta: { interface: 'input', required: true, width: 'full', sort: 4 } },
        { field: 'slug', type: 'string', meta: { interface: 'input', required: true, width: 'half', sort: 5, note: 'URL-friendly identifier (auto atau manual)' } },
        { field: 'published_date', type: 'timestamp', meta: { interface: 'datetime', width: 'half', sort: 6 } },

        // Divider: Content
        { field: 'divider_content', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 7, options: { title: 'Konten', icon: 'edit' } } },
        { field: 'excerpt', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 8, note: 'Ringkasan singkat (max 200 karakter)' } },
        { field: 'content', type: 'text', meta: { interface: 'input-rich-text-html', width: 'full', sort: 9, note: 'Konten utama artikel', options: { toolbar: ['bold', 'italic', 'underline', 'link', 'code', 'bullist', 'numlist', 'blockquote', 'h2', 'h3', 'removeformat'] } } },
        { field: 'key_takeaways', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 10, note: 'Executive summary / poin-poin penting (markdown)' } },

        // Divider: Media
        { field: 'divider_media', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 11, options: { title: 'Media', icon: 'image' } } },
        { field: 'image', type: 'uuid', schema: { foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', display: 'image', width: 'full', sort: 12, special: ['file'], note: 'Hero/thumbnail image (1200x630px)', options: { crop: false } } },

        // Divider: Classification
        { field: 'divider_class', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 13, options: { title: 'Klasifikasi', icon: 'label' } } },
        { field: 'category', type: 'integer', meta: { interface: 'select-dropdown-m2o', width: 'half', sort: 14, special: ['m2o'], options: { template: '{{name}}' } } },
        { field: 'author', type: 'integer', meta: { interface: 'select-dropdown-m2o', width: 'half', sort: 15, special: ['m2o'], options: { template: '{{name}}' } } },
        { field: 'read_time', type: 'integer', schema: { default_value: 5 }, meta: { interface: 'input', width: 'half', sort: 16, note: 'Estimasi waktu baca (menit)' } },
        { field: 'tags', type: 'json', meta: { interface: 'list', display: 'labels', width: 'full', sort: 17, special: ['cast-json'], note: 'Tags untuk SEO dan filtering', options: { template: '{{tag}}', addLabel: '+ Add Tag', fields: [{ field: 'tag', name: 'Tag', type: 'string', meta: { interface: 'input', width: 'full' } }] } } },

        // Divider: SEO
        { field: 'divider_seo', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 18, options: { title: 'SEO', icon: 'search' } } },
        { field: 'seo_title', type: 'string', meta: { interface: 'input', width: 'full', sort: 19, note: 'Judul untuk search engine (jika berbeda dari title)' } },
        { field: 'seo_description', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 20, note: 'Meta description (max 160 karakter)' } },
        { field: 'canonical_url', type: 'string', meta: { interface: 'input', width: 'full', sort: 21, note: 'URL canonical jika konten duplikat' } },

        // Sort field
        { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true, sort: 22 } }
    ];

    for (const f of blogFields) {
        await api('POST', '/fields/blogs', f);
    }
    console.log('   ✓ Fields created');

    // Relations for blogs
    console.log('   Creating relations...');
    await api('POST', '/relations', { collection: 'blogs', field: 'image', related_collection: 'directus_files' });
    await api('POST', '/relations', { collection: 'blogs', field: 'category', related_collection: 'blog_categories' });
    await api('POST', '/relations', { collection: 'blogs', field: 'author', related_collection: 'authors' });
    console.log('   ✓ Relations created\n');

    // ═══════════════════════════════════════════════════════════════
    // 3. CREATE blog_page_settings SINGLETON
    // ═══════════════════════════════════════════════════════════════
    console.log('📁 Creating blog_page_settings singleton...');

    await api('POST', '/collections', {
        collection: 'blog_page_settings',
        meta: {
            icon: 'settings',
            note: 'Pengaturan Halaman Blog (SEO, Hero, Newsletter)',
            singleton: true
        },
        schema: {}
    });
    console.log('   ✓ Singleton created');

    // Fields for blog_page_settings (same as news_page_settings)
    const settingsFields = [
        // Hero Section
        { field: 'divider_hero', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 1, options: { title: 'Hero Section', icon: 'crop_landscape' } } },
        { field: 'hero_badge', type: 'string', schema: { default_value: "Editor's Picks" }, meta: { interface: 'input', width: 'half', sort: 2, note: 'Badge kecil di atas judul' } },
        { field: 'hero_title', type: 'string', schema: { default_value: 'Spead Blog.' }, meta: { interface: 'input', width: 'half', sort: 3, note: 'Judul besar hero section' } },
        { field: 'hero_subtitle', type: 'text', schema: { default_value: 'Deep dives into AI architecture.\nInsights from the frontier.' }, meta: { interface: 'input-multiline', width: 'full', sort: 4, note: 'Subtitle hero (gunakan \\n untuk new line)' } },
        { field: 'featured_badge_text', type: 'string', schema: { default_value: "Editor's Pick" }, meta: { interface: 'input', width: 'half', sort: 5, note: 'Teks badge untuk post Featured' } },
        { field: 'latest_badge_text', type: 'string', schema: { default_value: 'Latest' }, meta: { interface: 'input', width: 'half', sort: 6, note: 'Teks badge jika tidak ada Featured' } },

        // SEO Section
        { field: 'divider_seo', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 10, options: { title: 'SEO Settings', icon: 'search' } } },
        { field: 'seo_title', type: 'string', schema: { default_value: 'Blog | Spead AI' }, meta: { interface: 'input', width: 'full', sort: 11, note: 'Title tag untuk halaman Blog' } },
        { field: 'seo_description', type: 'text', schema: { default_value: 'Deep dives into AI architecture, autonomous systems, and the expertise economy.' }, meta: { interface: 'input-multiline', width: 'full', sort: 12, note: 'Meta description (max 160 chars)' } },
        { field: 'seo_keywords', type: 'json', meta: { interface: 'list', display: 'labels', width: 'full', sort: 13, special: ['cast-json'], note: 'Keywords untuk SEO', options: { template: '{{keyword}}', addLabel: '+ Add Keyword', fields: [{ field: 'keyword', name: 'Keyword', type: 'string', meta: { interface: 'input', width: 'full' } }] } } },
        { field: 'canonical_url', type: 'string', schema: { default_value: 'https://spead.ai/blog' }, meta: { interface: 'input', width: 'half', sort: 14, note: 'Canonical URL' } },
        { field: 'robots', type: 'string', schema: { default_value: 'index, follow' }, meta: { interface: 'select-dropdown', width: 'half', sort: 15, options: { choices: [{ text: 'Index & Follow', value: 'index, follow' }, { text: 'No Index, No Follow', value: 'noindex, nofollow' }] } } },

        // OpenGraph Section
        { field: 'divider_og', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 20, options: { title: 'OpenGraph (Social Share)', icon: 'share' } } },
        { field: 'og_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 21, note: 'Judul untuk social share' } },
        { field: 'og_description', type: 'text', meta: { interface: 'input-multiline', width: 'half', sort: 22, note: 'Deskripsi untuk social share' } },
        { field: 'og_image', type: 'uuid', schema: { foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', display: 'image', width: 'full', sort: 23, special: ['file'], note: 'Gambar untuk social share (1200x630px)', options: { crop: false } } },
        { field: 'twitter_card', type: 'string', schema: { default_value: 'summary_large_image' }, meta: { interface: 'select-dropdown', width: 'half', sort: 24, options: { choices: [{ text: 'Summary Large Image', value: 'summary_large_image' }, { text: 'Summary', value: 'summary' }] } } },

        // Advanced Section
        { field: 'divider_advanced', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 30, options: { title: 'Advanced Settings', icon: 'tune' } } },
        { field: 'structured_data_enabled', type: 'string', schema: { default_value: 'yes' }, meta: { interface: 'select-dropdown', width: 'half', sort: 31, note: 'Aktifkan JSON-LD structured data?', options: { choices: [{ text: 'Ya', value: 'yes' }, { text: 'Tidak', value: 'no' }] } } },
        { field: 'newsletter_enabled', type: 'string', schema: { default_value: 'yes' }, meta: { interface: 'select-dropdown', width: 'half', sort: 32, note: 'Tampilkan section newsletter?', options: { choices: [{ text: 'Ya', value: 'yes' }, { text: 'Tidak', value: 'no' }] } } },
        { field: 'newsletter_title', type: 'string', schema: { default_value: "Don't miss a beat." }, meta: { interface: 'input', width: 'half', sort: 33 } },
        { field: 'newsletter_subtitle', type: 'text', schema: { default_value: 'Join 15,000+ enterprise leaders in the intelligence stream.' }, meta: { interface: 'input-multiline', width: 'half', sort: 34 } }
    ];

    for (const f of settingsFields) {
        await api('POST', '/fields/blog_page_settings', f);
    }
    console.log('   ✓ Fields created');

    // Create relation for og_image
    await api('POST', '/relations', { collection: 'blog_page_settings', field: 'og_image', related_collection: 'directus_files' });
    console.log('   ✓ Relations created');

    // Create initial data
    await api('POST', '/items/blog_page_settings', {
        hero_badge: "Editor's Picks",
        hero_title: 'Spead Blog.',
        hero_subtitle: 'Deep dives into AI architecture.\nInsights from the frontier.',
        featured_badge_text: "Editor's Pick",
        latest_badge_text: 'Latest',
        seo_title: 'Blog | Spead AI',
        seo_description: 'Deep dives into AI architecture, autonomous systems, and the expertise economy.',
        seo_keywords: [{ keyword: 'AI Blog' }, { keyword: 'Enterprise AI' }, { keyword: 'Autonomous Agents' }],
        newsletter_enabled: 'yes',
        newsletter_title: "Don't miss a beat.",
        newsletter_subtitle: 'Join 15,000+ enterprise leaders in the intelligence stream.'
    });
    console.log('   ✓ Initial data created\n');

    // ═══════════════════════════════════════════════════════════════
    // 4. SET PUBLIC ACCESS
    // ═══════════════════════════════════════════════════════════════
    console.log('🔓 Setting public access...');

    const collections = ['blogs', 'blog_categories', 'blog_page_settings'];
    for (const col of collections) {
        await api('POST', '/permissions', {
            role: null,
            collection: col,
            action: 'read',
            fields: ['*']
        });
    }
    console.log('   ✓ Public read access enabled\n');

    // ═══════════════════════════════════════════════════════════════
    // 5. SEED SAMPLE DATA
    // ═══════════════════════════════════════════════════════════════
    console.log('🌱 Seeding sample blog_categories...');

    const sampleCategories = [
        { name: 'Architecture', slug: 'architecture', color: '#6366f1' },
        { name: 'Strategy', slug: 'strategy', color: '#10b981' },
        { name: 'Design', slug: 'design', color: '#f59e0b' },
        { name: 'Engineering', slug: 'engineering', color: '#3b82f6' },
        { name: 'Ethics', slug: 'ethics', color: '#ec4899' }
    ];

    for (const cat of sampleCategories) {
        await api('POST', '/items/blog_categories', cat);
    }
    console.log('   ✓ 5 categories created\n');

    console.log('═'.repeat(60));
    console.log('✨ DONE! All blog collections created successfully.');
    console.log('');
    console.log('Created:');
    console.log('  📁 blogs (same quality as posts)');
    console.log('  📁 blog_categories (5 sample categories)');
    console.log('  📁 blog_page_settings (singleton with defaults)');
    console.log('');
    console.log('Next: Update frontend to use these collections.');
    console.log('═'.repeat(60));
}

main().catch(console.error);
