/**
 * Fix News Page Settings UI:
 * 1. Delete GEO Targeting fields
 * 2. Change boolean toggles to dropdown
 * 3. Fix OG image field
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🔧 Fixing News Page Settings UI...\n');

    // Login
    const loginRes = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const api = async (method: string, path: string, body?: any) => {
        const res = await fetch(`${URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
        return { ok: res.ok, status: res.status };
    };

    // 1. Delete GEO Targeting fields
    console.log('\n🗑️  Removing GEO Targeting section...');
    const geoFields = ['geo_divider', 'geo_region', 'geo_placename', 'geo_position', 'language'];
    for (const field of geoFields) {
        await api('DELETE', `/fields/news_page_settings/${field}`);
        console.log(`   ✓ Deleted ${field}`);
    }

    // 2. Delete old boolean fields
    console.log('\n🗑️  Removing old toggle fields...');
    await api('DELETE', '/fields/news_page_settings/structured_data_enabled');
    await api('DELETE', '/fields/news_page_settings/newsletter_enabled');
    console.log('   ✓ Deleted old toggles');

    // 3. Delete old og_image field
    console.log('\n🗑️  Removing old OG image field...');
    await api('DELETE', '/fields/news_page_settings/og_image');
    console.log('   ✓ Deleted old og_image');

    // 4. Create new dropdown fields
    console.log('\n📝 Creating new dropdown fields...');

    // Structured Data dropdown
    const structuredRes = await api('POST', '/fields/news_page_settings', {
        field: 'structured_data_enabled',
        type: 'string',
        schema: { default_value: 'yes' },
        meta: {
            interface: 'select-dropdown',
            display: 'labels',
            note: 'Aktifkan JSON-LD structured data untuk SEO',
            width: 'half',
            sort: 41,
            options: {
                choices: [
                    { text: '✅ Enabled', value: 'yes' },
                    { text: '❌ Disabled', value: 'no' }
                ]
            }
        }
    });
    console.log(`   ${structuredRes.ok ? '✓' : '✗'} structured_data_enabled dropdown`);

    // Newsletter dropdown
    const newsletterRes = await api('POST', '/fields/news_page_settings', {
        field: 'newsletter_enabled',
        type: 'string',
        schema: { default_value: 'yes' },
        meta: {
            interface: 'select-dropdown',
            display: 'labels',
            note: 'Tampilkan section newsletter di halaman',
            width: 'half',
            sort: 42,
            options: {
                choices: [
                    { text: '✅ Show Newsletter', value: 'yes' },
                    { text: '❌ Hide Newsletter', value: 'no' }
                ]
            }
        }
    });
    console.log(`   ${newsletterRes.ok ? '✓' : '✗'} newsletter_enabled dropdown`);

    // 5. Create new OG image field (as string URL)
    const ogImageRes = await api('POST', '/fields/news_page_settings', {
        field: 'og_image',
        type: 'string',
        meta: {
            interface: 'input',
            note: 'URL gambar untuk social share (1200x630px). Bisa paste URL atau upload ke Directus Files lalu copy URL.',
            width: 'full',
            sort: 23,
            options: {
                placeholder: 'https://example.com/og-image.jpg'
            }
        }
    });
    console.log(`   ${ogImageRes.ok ? '✓' : '✗'} og_image (URL input)`);

    // 6. Update existing record with new values
    console.log('\n📝 Updating settings with new values...');
    await api('PATCH', '/items/news_page_settings/1', {
        structured_data_enabled: 'yes',
        newsletter_enabled: 'yes',
        og_image: ''
    });
    console.log('   ✓ Settings updated');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ UI Fixed!');
    console.log('   - GEO Targeting removed');
    console.log('   - Toggles changed to dropdowns');
    console.log('   - OG Image now accepts URL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();
