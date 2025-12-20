/**
 * Fix SEO Keywords to use List/Repeater interface
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🔧 Fixing SEO Keywords UI...\n');

    const loginRes = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Delete old seo_keywords
    console.log('🗑️  Deleting old seo_keywords...');
    await fetch(`${URL}/fields/news_page_settings/seo_keywords`, { method: 'DELETE', headers });

    // Create new with list interface
    console.log('📝 Creating new seo_keywords with Repeater UI...');
    const res = await fetch(`${URL}/fields/news_page_settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            field: 'seo_keywords',
            type: 'json',
            schema: { is_nullable: true },
            meta: {
                interface: 'list',
                display: 'labels',
                note: 'Daftar keywords untuk SEO. Klik Add Keyword untuk menambah, drag untuk reorder, X untuk hapus.',
                width: 'full',
                sort: 13,
                special: ['cast-json'],
                options: {
                    template: '{{keyword}}',
                    addLabel: '+ Add Keyword',
                    fields: [{
                        field: 'keyword',
                        name: 'Keyword',
                        type: 'string',
                        meta: {
                            interface: 'input',
                            width: 'full',
                            options: { placeholder: 'Enter keyword...' }
                        }
                    }]
                }
            }
        })
    });
    console.log(res.ok ? '✓ Created successfully' : '✗ Failed');

    // Update data
    console.log('📝 Updating with sample keywords...');
    await fetch(`${URL}/items/news_page_settings/1`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            seo_keywords: [
                { keyword: 'Enterprise AI' },
                { keyword: 'AI News' },
                { keyword: 'Spead AI' },
                { keyword: 'Self-Healing Systems' },
                { keyword: 'Legal Tech AI' }
            ]
        })
    });

    console.log('\n✨ Done! Refresh Directus to see the new UI.\n');
}

main();
