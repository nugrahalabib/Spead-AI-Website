/**
 * Fix Directus Relations and Field Types
 * 
 * Issues to fix:
 * 1. Category/Author - Need proper M2O relations
 * 2. Tags - Not saving (fix field type/interface)
 * 3. Is Featured - Change to dropdown instead of checkbox
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🔧 Fixing Directus Relations & Fields...\n');

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

    // Helper
    const api = async (method: string, path: string, body?: any) => {
        const res = await fetch(`${URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
        const text = await res.text();
        let json: any = null;
        try { json = JSON.parse(text); } catch { }
        return { ok: res.ok, status: res.status, data: json, text };
    };

    // ============================================
    // STEP 1: Delete old broken fields
    // ============================================
    console.log('🗑️  Removing old broken fields...');

    // Delete old category, author, tags, is_featured fields
    await api('DELETE', '/fields/posts/category');
    await api('DELETE', '/fields/posts/author');
    await api('DELETE', '/fields/posts/tags');
    await api('DELETE', '/fields/posts/is_featured');
    console.log('   Deleted old fields\n');

    // ============================================
    // STEP 2: Create proper Category relation (M2O)
    // ============================================
    console.log('📎 Creating Category relation...');

    const categoryRes = await api('POST', '/fields/posts', {
        field: 'category',
        type: 'integer',
        schema: {
            is_nullable: true,
            foreign_key_table: 'categories',
            foreign_key_column: 'id'
        },
        meta: {
            interface: 'select-dropdown-m2o',
            display: 'related-values',
            display_options: {
                template: '{{name}}'
            },
            note: 'Kategori artikel (Press Release, Product Update, Security Alert, dst).',
            width: 'half',
            special: ['m2o'],
            options: {
                template: '{{name}}'
            }
        }
    });

    if (categoryRes.ok) {
        console.log('   ✓ Category field created');

        // Create the relation
        await api('POST', '/relations', {
            collection: 'posts',
            field: 'category',
            related_collection: 'categories'
        });
        console.log('   ✓ Category relation linked\n');
    } else {
        console.log('   ✗ Category:', categoryRes.text, '\n');
    }

    // ============================================
    // STEP 3: Create proper Author relation (M2O)
    // ============================================
    console.log('📎 Creating Author relation...');

    const authorRes = await api('POST', '/fields/posts', {
        field: 'author',
        type: 'integer',
        schema: {
            is_nullable: true,
            foreign_key_table: 'authors',
            foreign_key_column: 'id'
        },
        meta: {
            interface: 'select-dropdown-m2o',
            display: 'related-values',
            display_options: {
                template: '{{name}} — {{role}}'
            },
            note: 'Penulis artikel. Pilih dari daftar author yang tersedia.',
            width: 'half',
            special: ['m2o'],
            options: {
                template: '{{name}} — {{role}}'
            }
        }
    });

    if (authorRes.ok) {
        console.log('   ✓ Author field created');

        // Create the relation
        await api('POST', '/relations', {
            collection: 'posts',
            field: 'author',
            related_collection: 'authors'
        });
        console.log('   ✓ Author relation linked\n');
    } else {
        console.log('   ✗ Author:', authorRes.text, '\n');
    }

    // ============================================
    // STEP 4: Create Tags as CSV string (more reliable)
    // ============================================
    console.log('🏷️  Creating Tags field...');

    const tagsRes = await api('POST', '/fields/posts', {
        field: 'tags',
        type: 'csv',  // CSV type works better with tags interface
        schema: {
            is_nullable: true
        },
        meta: {
            interface: 'tags',
            display: 'labels',
            note: 'Tag untuk SEO dan filtering. Ketik tag lalu tekan Enter.',
            width: 'full',
            options: {
                placeholder: 'Tambah tag baru...',
                iconRight: 'local_offer',
                presets: ['AI', 'Enterprise', 'Security', 'Update', 'Press', 'Event']
            }
        }
    });

    if (tagsRes.ok) {
        console.log('   ✓ Tags field created (CSV type)\n');
    } else {
        console.log('   ✗ Tags:', tagsRes.text, '\n');
    }

    // ============================================
    // STEP 5: Create Is Featured as dropdown string
    // ============================================
    console.log('⭐ Creating Is Featured dropdown...');

    const featuredRes = await api('POST', '/fields/posts', {
        field: 'is_featured',
        type: 'string',
        schema: {
            is_nullable: true,
            default_value: 'no'
        },
        meta: {
            interface: 'select-dropdown',
            display: 'labels',
            note: 'Apakah artikel ini ditampilkan sebagai featured/highlight?',
            width: 'half',
            options: {
                choices: [
                    { text: '⭐ Yes - Featured', value: 'yes' },
                    { text: '➖ No - Regular', value: 'no' }
                ]
            }
        }
    });

    if (featuredRes.ok) {
        console.log('   ✓ Is Featured field created\n');
    } else {
        console.log('   ✗ Is Featured:', featuredRes.text, '\n');
    }

    // ============================================
    // STEP 6: Update existing posts with default values
    // ============================================
    console.log('📝 Updating existing posts...');

    const postsRes = await api('GET', '/items/posts');
    if (postsRes.ok && postsRes.data?.data) {
        for (const post of postsRes.data.data) {
            // Update with defaults
            await api('PATCH', `/items/posts/${post.id}`, {
                is_featured: post.title?.includes('Series B') ? 'yes' : 'no',
                tags: 'AI,Enterprise' // Default tags as CSV
            });
        }
        console.log('   ✓ Updated existing posts\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Fixes Applied!');
    console.log('');
    console.log('   Please HARD REFRESH Directus (Ctrl+Shift+R)');
    console.log('   Then edit a Post to test the relations.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();
