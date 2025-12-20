/**
 * Directus Posts Collection - Field Configuration Script
 * 
 * This script configures proper UI interfaces for all Posts fields:
 * - WYSIWYG editor for content
 * - File picker for images  
 * - Tags interface for tags
 * - Dropdown for relations
 * - Notes/descriptions for all fields
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🎨 Configuring Directus Posts UI...\n');

    // 1. Authenticate
    const loginRes = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });

    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated\n');

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Helper to update field
    const updateField = async (collection: string, field: string, meta: any) => {
        try {
            const res = await fetch(`${URL}/fields/${collection}/${field}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ meta })
            });
            if (res.ok) {
                console.log(`   ✓ ${collection}.${field}`);
            } else {
                const text = await res.text();
                console.log(`   ✗ ${collection}.${field}: ${res.status}`);
            }
        } catch (e: any) {
            console.log(`   ✗ ${collection}.${field}: ${e.message}`);
        }
    };

    // ============================================
    // POSTS COLLECTION FIELDS
    // ============================================
    console.log('📝 Configuring Posts fields...\n');

    // Status - Dropdown with options
    await updateField('posts', 'status', {
        interface: 'select-dropdown',
        display: 'labels',
        note: 'Status publikasi artikel. Draft tidak akan tampil di website.',
        options: {
            choices: [
                { text: '📝 Draft', value: 'draft' },
                { text: '✅ Published', value: 'published' },
                { text: '📦 Archived', value: 'archived' }
            ]
        },
        width: 'half',
        sort: 1
    });

    // Title - Standard input with note
    await updateField('posts', 'title', {
        interface: 'input',
        note: 'Judul utama artikel. Akan tampil di halaman dan SEO.',
        width: 'full',
        sort: 2,
        options: {
            placeholder: 'Masukkan judul artikel...'
        }
    });

    // Slug - Auto-generated URL key
    await updateField('posts', 'slug', {
        interface: 'input',
        note: 'URL-friendly identifier. Contoh: "model-v2-4-release". Gunakan huruf kecil dan dash.',
        width: 'half',
        sort: 3,
        options: {
            placeholder: 'contoh-slug-artikel',
            slug: true
        }
    });

    // Published Date - Datetime picker
    await updateField('posts', 'published_date', {
        interface: 'datetime',
        display: 'datetime',
        note: 'Tanggal dan waktu publikasi artikel.',
        width: 'half',
        sort: 4
    });

    // Excerpt - Textarea with character limit note
    await updateField('posts', 'excerpt', {
        interface: 'input-multiline',
        note: 'Ringkasan singkat (1-2 kalimat) untuk preview di card. Max 200 karakter.',
        width: 'full',
        sort: 5,
        options: {
            placeholder: 'Tulis ringkasan singkat artikel...'
        }
    });

    // Content - WYSIWYG Editor! 🎉
    await updateField('posts', 'content', {
        interface: 'input-rich-text-html',
        note: 'Konten utama artikel. Gunakan toolbar untuk formatting, heading, gambar, dll.',
        width: 'full',
        sort: 6,
        options: {
            toolbar: [
                'bold', 'italic', 'underline', 'strikethrough',
                'removeformat', '|',
                'h1', 'h2', 'h3', 'h4', '|',
                'numlist', 'bullist', '|',
                'blockquote', 'code', 'hr', '|',
                'link', 'unlink', 'media', 'image', '|',
                'table', '|',
                'undo', 'redo', 'fullscreen'
            ]
        }
    });

    // Key Takeaways - Markdown/Rich text
    await updateField('posts', 'key_takeaways', {
        interface: 'input-rich-text-md',
        note: 'Poin-poin penting artikel dalam format bullet. Akan tampil di "Executive Summary".',
        width: 'full',
        sort: 7,
        options: {
            placeholder: '- Poin pertama\n- Poin kedua\n- Poin ketiga'
        }
    });

    // Image - File relationship!
    await updateField('posts', 'image', {
        interface: 'file-image',
        display: 'image',
        note: 'Gambar hero/thumbnail artikel. Akan tampil di card dan halaman detail.',
        width: 'half',
        sort: 8,
        options: {
            crop: true
        }
    });

    // Read Time - Number input
    await updateField('posts', 'read_time', {
        interface: 'input',
        note: 'Estimasi waktu baca dalam menit.',
        width: 'half',
        sort: 9,
        options: {
            placeholder: '5',
            min: 1,
            max: 60
        }
    });

    // Category - Relationship dropdown
    await updateField('posts', 'category', {
        interface: 'select-dropdown-m2o',
        display: 'related-values',
        note: 'Kategori utama artikel (Press Release, Product Update, dll).',
        width: 'half',
        sort: 10,
        options: {
            template: '{{name}}'
        }
    });

    // Author - Relationship dropdown
    await updateField('posts', 'author', {
        interface: 'select-dropdown-m2o',
        display: 'related-values',
        note: 'Penulis artikel. Pilih dari daftar author.',
        width: 'half',
        sort: 11,
        options: {
            template: '{{name}} ({{role}})'
        }
    });

    // Tags - Tags interface!
    await updateField('posts', 'tags', {
        interface: 'tags',
        display: 'labels',
        note: 'Kata kunci/tag untuk filtering dan SEO. Ketik dan tekan Enter.',
        width: 'full',
        sort: 12,
        options: {
            placeholder: 'Tambah tag...',
            lowercase: true
        }
    });

    // Is Featured - Toggle
    await updateField('posts', 'is_featured', {
        interface: 'boolean',
        display: 'boolean',
        note: 'Aktifkan untuk menampilkan artikel ini di posisi utama.',
        width: 'half',
        sort: 13
    });

    // SEO Section Header (using divider)
    console.log('\n🔍 Configuring SEO fields...\n');

    // SEO Title
    await updateField('posts', 'seo_title', {
        interface: 'input',
        note: 'Judul untuk Google (max 60 karakter). Kosongkan untuk menggunakan Title.',
        width: 'full',
        sort: 20,
        options: {
            placeholder: 'SEO Title (opsional)',
            softLength: 60
        }
    });

    // SEO Description
    await updateField('posts', 'seo_description', {
        interface: 'input-multiline',
        note: 'Deskripsi untuk Google (max 160 karakter). Akan muncul di hasil pencarian.',
        width: 'full',
        sort: 21,
        options: {
            placeholder: 'Meta description untuk SEO...',
            softLength: 160
        }
    });

    // Canonical URL
    await updateField('posts', 'canonical_url', {
        interface: 'input',
        note: 'URL kanonikal jika artikel ini di-republish dari sumber lain.',
        width: 'full',
        sort: 22,
        options: {
            placeholder: 'https://...'
        }
    });

    // ============================================
    // AUTHORS COLLECTION FIELDS
    // ============================================
    console.log('\n👤 Configuring Authors fields...\n');

    await updateField('authors', 'name', {
        interface: 'input',
        note: 'Nama lengkap penulis.',
        width: 'full',
        sort: 1
    });

    await updateField('authors', 'slug', {
        interface: 'input',
        note: 'URL-friendly identifier. Contoh: "sarah-chen".',
        width: 'half',
        sort: 2,
        options: { slug: true }
    });

    await updateField('authors', 'role', {
        interface: 'input',
        note: 'Jabatan/peran. Contoh: "Chief AI Architect".',
        width: 'half',
        sort: 3
    });

    await updateField('authors', 'bio', {
        interface: 'input-multiline',
        note: 'Biografi singkat penulis.',
        width: 'full',
        sort: 4
    });

    await updateField('authors', 'avatar', {
        interface: 'file-image',
        display: 'image',
        note: 'Foto profil penulis.',
        width: 'half',
        sort: 5
    });

    await updateField('authors', 'email', {
        interface: 'input',
        note: 'Email kontak penulis.',
        width: 'half',
        sort: 6,
        options: { iconLeft: 'mail' }
    });

    await updateField('authors', 'status', {
        interface: 'select-dropdown',
        note: 'Status penulis.',
        width: 'half',
        sort: 7,
        options: {
            choices: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' }
            ]
        }
    });

    // ============================================
    // CATEGORIES COLLECTION FIELDS
    // ============================================
    console.log('\n📁 Configuring Categories fields...\n');

    await updateField('categories', 'name', {
        interface: 'input',
        note: 'Nama kategori.',
        width: 'half',
        sort: 1
    });

    await updateField('categories', 'slug', {
        interface: 'input',
        note: 'URL identifier.',
        width: 'half',
        sort: 2,
        options: { slug: true }
    });

    await updateField('categories', 'color', {
        interface: 'select-color',
        display: 'color',
        note: 'Warna untuk badge (contoh: text-blue-400).',
        width: 'half',
        sort: 3
    });

    await updateField('categories', 'icon', {
        interface: 'input',
        note: 'Nama icon Lucide (contoh: newspaper, zap, shield-alert).',
        width: 'half',
        sort: 4
    });

    await updateField('categories', 'description', {
        interface: 'input-multiline',
        note: 'Deskripsi kategori.',
        width: 'full',
        sort: 5
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Configuration Complete!');
    console.log('   Refresh Directus to see the new UI.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();
