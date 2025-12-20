/**
 * Create Newsletter Subscribers Collection
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('📧 Creating Newsletter Subscribers Collection\n');
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
    // CREATE newsletter_subscribers COLLECTION
    // ═══════════════════════════════════════════════════════════════
    console.log('📁 Creating newsletter_subscribers collection...');

    await api('POST', '/collections', {
        collection: 'newsletter_subscribers',
        meta: {
            icon: 'mail',
            note: 'Subscribers untuk newsletter News & Blog',
            display_template: '{{email}} - {{source}}',
            sort_field: 'sort'
        },
        schema: {}
    });
    console.log('   ✓ Collection created');

    // Fields
    const fields = [
        {
            field: 'status', type: 'string', schema: { default_value: 'active' }, meta: {
                interface: 'select-dropdown', width: 'half', sort: 1, options: {
                    choices: [
                        { text: '✅ Active', value: 'active' },
                        { text: '⏸️ Paused', value: 'paused' },
                        { text: '❌ Unsubscribed', value: 'unsubscribed' }
                    ]
                }
            }
        },
        { field: 'date_created', type: 'timestamp', meta: { interface: 'datetime', display: 'datetime', width: 'half', sort: 2, special: ['date-created'], readonly: true } },
        { field: 'email', type: 'string', schema: { is_unique: true }, meta: { interface: 'input', required: true, width: 'full', sort: 3, options: { placeholder: 'subscriber@example.com' } } },
        {
            field: 'source', type: 'string', meta: {
                interface: 'select-dropdown', width: 'half', sort: 4, options: {
                    choices: [
                        { text: '📰 News Page', value: 'news' },
                        { text: '📝 Blog Page', value: 'blog' },
                        { text: '🏠 Homepage', value: 'homepage' },
                        { text: '📄 Other', value: 'other' }
                    ]
                }
            }
        },
        {
            field: 'subscribed_to', type: 'json', meta: {
                interface: 'select-multiple-checkbox', width: 'half', sort: 5, options: {
                    choices: [
                        { text: 'News Updates', value: 'news' },
                        { text: 'Blog Posts', value: 'blog' },
                        { text: 'Product Updates', value: 'product' },
                        { text: 'Promotions', value: 'promotions' }
                    ]
                }
            }
        },
        { field: 'ip_address', type: 'string', meta: { interface: 'input', width: 'half', sort: 6, readonly: true } },
        { field: 'user_agent', type: 'string', meta: { interface: 'input', width: 'half', sort: 7, readonly: true } },
        { field: 'notes', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 8 } },
        { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true, sort: 9 } }
    ];

    console.log('   Creating fields...');
    for (const f of fields) {
        await api('POST', '/fields/newsletter_subscribers', f);
    }
    console.log('   ✓ All fields created');

    // ═══════════════════════════════════════════════════════════════
    // SET PUBLIC ACCESS (CREATE only)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🔓 Setting public access (create only)...');

    await api('POST', '/permissions', {
        role: null,
        collection: 'newsletter_subscribers',
        action: 'create',
        fields: ['email', 'source', 'subscribed_to', 'ip_address', 'user_agent']
    });
    console.log('   ✓ Public can subscribe (create only)');

    console.log('\n' + '═'.repeat(60));
    console.log('✨ DONE! Newsletter subscribers collection created.');
    console.log('');
    console.log('Fields:');
    console.log('  📧 email (unique)');
    console.log('  📍 source (news/blog/homepage)');
    console.log('  📋 subscribed_to (multi-select)');
    console.log('  🔒 status (active/paused/unsubscribed)');
    console.log('  📊 ip_address, user_agent');
    console.log('═'.repeat(60));
}

main().catch(console.error);
