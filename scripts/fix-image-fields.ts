/**
 * Fix Image fields in Posts and Authors to use file-image interface
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🔧 Fixing Image Fields (Posts & Authors)...\n');

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
        return { ok: res.ok, status: res.status };
    };

    // ========= FIX POSTS.IMAGE =========
    console.log('📸 Fixing posts.image...');

    // Delete old field
    await api('DELETE', '/fields/posts/image');
    console.log('   ✓ Deleted old image field');

    // Create new with file-image interface
    const postsImageRes = await api('POST', '/fields/posts', {
        field: 'image',
        type: 'uuid',
        schema: {
            is_nullable: true,
            foreign_key_table: 'directus_files',
            foreign_key_column: 'id'
        },
        meta: {
            interface: 'file-image',
            display: 'image',
            note: 'Hero/Thumbnail image. Geser & lepas atau klik untuk upload. (Rekomendasi: 1200x630px)',
            width: 'full',
            sort: 8,
            special: ['file'],
            options: { crop: false }
        }
    });
    console.log(`   ${postsImageRes.ok ? '✓' : '✗'} Created new image field`);

    // Create relation
    const postsRelRes = await api('POST', '/relations', {
        collection: 'posts',
        field: 'image',
        related_collection: 'directus_files'
    });
    console.log(`   ${postsRelRes.ok ? '✓' : '✓'} Relation configured`);

    // ========= FIX AUTHORS.AVATAR =========
    console.log('\n👤 Fixing authors.avatar...');

    // Delete old field
    await api('DELETE', '/fields/authors/avatar');
    console.log('   ✓ Deleted old avatar field');

    // Create new with file-image interface
    const avatarRes = await api('POST', '/fields/authors', {
        field: 'avatar',
        type: 'uuid',
        schema: {
            is_nullable: true,
            foreign_key_table: 'directus_files',
            foreign_key_column: 'id'
        },
        meta: {
            interface: 'file-image',
            display: 'image',
            note: 'Foto profil author. Geser & lepas atau klik untuk upload. (Rekomendasi: 400x400px)',
            width: 'half',
            sort: 4,
            special: ['file'],
            options: { crop: true }
        }
    });
    console.log(`   ${avatarRes.ok ? '✓' : '✗'} Created new avatar field`);

    // Create relation
    const authorsRelRes = await api('POST', '/relations', {
        collection: 'authors',
        field: 'avatar',
        related_collection: 'directus_files'
    });
    console.log(`   ${authorsRelRes.ok ? '✓' : '✓'} Relation configured`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Done! Both image fields now use drag & drop interface.');
    console.log('   Refresh Directus to see the changes.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();
