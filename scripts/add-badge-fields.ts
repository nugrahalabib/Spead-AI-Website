/**
 * Add Featured Badge Text fields to News Page Settings
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('📝 Adding Featured Card Badge Fields...\n');

    const loginRes = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Add featured_badge_text
    console.log('📝 Creating featured_badge_text...');
    const res1 = await fetch(`${URL}/fields/news_page_settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            field: 'featured_badge_text',
            type: 'string',
            schema: { default_value: 'Featured' },
            meta: {
                interface: 'input',
                note: 'Teks badge untuk post yang Featured (contoh: Featured, Pilihan Editor, Highlight)',
                width: 'half',
                sort: 5
            }
        })
    });
    console.log(res1.ok ? '✓ Created' : '✓ Already exists');

    // Add latest_badge_text
    console.log('📝 Creating latest_badge_text...');
    const res2 = await fetch(`${URL}/fields/news_page_settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            field: 'latest_badge_text',
            type: 'string',
            schema: { default_value: 'Latest' },
            meta: {
                interface: 'input',
                note: 'Teks badge jika tidak ada Featured post (contoh: Latest, Terbaru)',
                width: 'half',
                sort: 6
            }
        })
    });
    console.log(res2.ok ? '✓ Created' : '✓ Already exists');

    // Update data
    console.log('📝 Setting default values...');
    await fetch(`${URL}/items/news_page_settings/1`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            featured_badge_text: 'Featured',
            latest_badge_text: 'Latest'
        })
    });

    console.log('\n✨ Done! Refresh Directus → News Page Settings.\n');
}

main();
