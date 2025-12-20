/**
 * Update Tags to use Repeater/List Interface
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🏷️  Updating Tags to Repeater interface...\n');

    // Login
    const loginRes = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Delete old tags field
    console.log('🗑️  Deleting old tags field...');
    await fetch(`${URL}/fields/posts/tags`, { method: 'DELETE', headers });

    // Create new tags with LIST interface
    console.log('📝 Creating new tags with Repeater UI...');
    const res = await fetch(`${URL}/fields/posts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            field: 'tags',
            type: 'json',
            schema: { is_nullable: true },
            meta: {
                interface: 'list',
                display: 'labels',
                note: 'Daftar tag artikel. Klik "Add Tag" untuk menambah, drag untuk reorder, X untuk hapus.',
                width: 'full',
                special: ['cast-json'],
                options: {
                    template: '{{tag}}',
                    addLabel: '+ Add Tag',
                    fields: [
                        {
                            field: 'tag',
                            name: 'Tag Name',
                            type: 'string',
                            meta: {
                                interface: 'input',
                                width: 'full',
                                options: {
                                    placeholder: 'Masukkan nama tag...'
                                }
                            }
                        }
                    ]
                }
            }
        })
    });

    if (res.ok) {
        console.log('✅ Tags field created with Repeater UI!');
    } else {
        const text = await res.text();
        console.log('❌ Failed:', text);
    }

    console.log('\n🎉 Done! Hard refresh Directus (Ctrl+Shift+R)\n');
}

main();
