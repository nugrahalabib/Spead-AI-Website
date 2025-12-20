/**
 * Fix OG Image to use file-image interface with drag & drop
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🔧 Fixing OG Image UI...\n');

    const loginRes = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Delete old og_image
    console.log('🗑️  Deleting old og_image...');
    await fetch(`${URL}/fields/news_page_settings/og_image`, { method: 'DELETE', headers });

    // Create new with file-image interface
    console.log('📝 Creating new og_image with File Image interface...');
    const res = await fetch(`${URL}/fields/news_page_settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            field: 'og_image',
            type: 'uuid',
            schema: {
                is_nullable: true,
                foreign_key_table: 'directus_files',
                foreign_key_column: 'id'
            },
            meta: {
                interface: 'file-image',
                display: 'image',
                note: 'Gambar untuk social share (1200x630px). Geser & lepas atau klik untuk upload.',
                width: 'full',
                sort: 23,
                special: ['file'],
                options: { crop: false }
            }
        })
    });
    console.log(res.ok ? '✓ Field created' : '✗ Field creation failed');

    // Create relation
    console.log('🔗 Creating relation to directus_files...');
    const relRes = await fetch(`${URL}/relations`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            collection: 'news_page_settings',
            field: 'og_image',
            related_collection: 'directus_files'
        })
    });
    console.log(relRes.ok ? '✓ Relation created' : '✓ Relation may already exist');

    console.log('\n✨ Done! Refresh Directus to see the new upload UI.\n');
}

main();
