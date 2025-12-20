/**
 * Create Bookings Collection for Lead Capture
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🔧 Creating Bookings Collection for Lead Capture\n');
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
    // CREATE bookings COLLECTION
    // ═══════════════════════════════════════════════════════════════
    console.log('📁 Creating bookings collection...');

    await api('POST', '/collections', {
        collection: 'bookings',
        meta: {
            icon: 'calendar_today',
            note: 'Lead Capture - Orang yang tertarik dengan produk',
            display_template: '{{full_name}} - {{email}}',
            sort_field: 'sort',
            archive_field: 'status',
            archive_value: 'archived'
        },
        schema: {}
    });
    console.log('   ✓ Collection created');

    // Fields
    const fields = [
        // ═══ DIVIDER: Status ═══
        { field: 'divider_status', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 1, options: { title: 'Status & Priority', icon: 'flag' } } },
        {
            field: 'status', type: 'string', schema: { default_value: 'new' }, meta: {
                interface: 'select-dropdown', width: 'half', sort: 2, options: {
                    choices: [
                        { text: '🆕 New', value: 'new' },
                        { text: '📞 Contacted', value: 'contacted' },
                        { text: '🔄 In Progress', value: 'in_progress' },
                        { text: '✅ Converted', value: 'converted' },
                        { text: '❌ Declined', value: 'declined' },
                        { text: '📦 Archived', value: 'archived' }
                    ]
                }
            }
        },
        {
            field: 'priority', type: 'string', schema: { default_value: 'medium' }, meta: {
                interface: 'select-dropdown', width: 'half', sort: 3, options: {
                    choices: [
                        { text: '🔥 Hot', value: 'hot' },
                        { text: '⬆️ High', value: 'high' },
                        { text: '➡️ Medium', value: 'medium' },
                        { text: '⬇️ Low', value: 'low' }
                    ]
                }
            }
        },
        { field: 'date_created', type: 'timestamp', meta: { interface: 'datetime', display: 'datetime', width: 'half', sort: 4, special: ['date-created'], readonly: true } },

        // ═══ DIVIDER: Contact Info ═══
        { field: 'divider_contact', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 10, options: { title: 'Contact Information', icon: 'person' } } },
        { field: 'full_name', type: 'string', meta: { interface: 'input', required: true, width: 'half', sort: 11 } },
        { field: 'email', type: 'string', meta: { interface: 'input', required: true, width: 'half', sort: 12, options: { placeholder: 'email@company.com' } } },
        { field: 'phone', type: 'string', meta: { interface: 'input', width: 'half', sort: 13, options: { placeholder: '+62 812 xxxx xxxx' } } },
        { field: 'company', type: 'string', meta: { interface: 'input', width: 'half', sort: 14 } },
        { field: 'job_title', type: 'string', meta: { interface: 'input', width: 'half', sort: 15 } },

        // ═══ DIVIDER: Interest ═══
        { field: 'divider_interest', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 20, options: { title: 'Interest & Requirements', icon: 'interests' } } },
        {
            field: 'selected_plan', type: 'string', meta: {
                interface: 'select-dropdown', width: 'half', sort: 21, options: {
                    choices: [
                        { text: 'Starter', value: 'starter' },
                        { text: 'Professional', value: 'professional' },
                        { text: 'Enterprise', value: 'enterprise' },
                        { text: 'Custom', value: 'custom' }
                    ]
                }
            }
        },
        {
            field: 'team_size', type: 'string', meta: {
                interface: 'select-dropdown', width: 'half', sort: 22, options: {
                    choices: [
                        { text: '1-5 people', value: '1-5' },
                        { text: '6-20 people', value: '6-20' },
                        { text: '21-50 people', value: '21-50' },
                        { text: '51-100 people', value: '51-100' },
                        { text: '100+ people', value: '100+' }
                    ]
                }
            }
        },
        { field: 'use_case', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 23, note: 'What do they want to use the product for?' } },
        {
            field: 'timeline', type: 'string', meta: {
                interface: 'select-dropdown', width: 'half', sort: 24, options: {
                    choices: [
                        { text: 'Immediately', value: 'immediately' },
                        { text: '1-3 months', value: '1-3-months' },
                        { text: '3-6 months', value: '3-6-months' },
                        { text: 'Just exploring', value: 'exploring' }
                    ]
                }
            }
        },
        { field: 'referral_source', type: 'string', meta: { interface: 'input', width: 'half', sort: 25, note: 'How did they hear about us?' } },

        // ═══ DIVIDER: Tracking ═══
        { field: 'divider_tracking', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 30, options: { title: 'Tracking & Analytics', icon: 'analytics' } } },
        { field: 'utm_source', type: 'string', meta: { interface: 'input', width: 'third', sort: 31 } },
        { field: 'utm_medium', type: 'string', meta: { interface: 'input', width: 'third', sort: 32 } },
        { field: 'utm_campaign', type: 'string', meta: { interface: 'input', width: 'third', sort: 33 } },
        { field: 'ip_address', type: 'string', meta: { interface: 'input', width: 'half', sort: 34, readonly: true } },
        { field: 'user_agent', type: 'string', meta: { interface: 'input', width: 'half', sort: 35, readonly: true } },

        // ═══ DIVIDER: Internal Notes ═══
        { field: 'divider_notes', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], width: 'full', sort: 40, options: { title: 'Internal Notes', icon: 'note' } } },
        { field: 'notes', type: 'text', meta: { interface: 'input-multiline', width: 'full', sort: 41, note: 'Admin notes for follow-up' } },

        // Sort field
        { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true, sort: 50 } }
    ];

    console.log('   Creating fields...');
    for (const f of fields) {
        await api('POST', '/fields/bookings', f);
    }
    console.log('   ✓ All fields created');

    // ═══════════════════════════════════════════════════════════════
    // SET PUBLIC ACCESS (CREATE only for form submission)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🔓 Setting public access (create only)...');

    await api('POST', '/permissions', {
        role: null,
        collection: 'bookings',
        action: 'create',
        fields: ['full_name', 'email', 'phone', 'company', 'job_title', 'selected_plan', 'team_size', 'use_case', 'timeline', 'referral_source', 'utm_source', 'utm_medium', 'utm_campaign', 'ip_address', 'user_agent']
    });
    console.log('   ✓ Public can submit bookings (create only)');

    console.log('\n' + '═'.repeat(60));
    console.log('✨ DONE! Bookings collection created successfully.');
    console.log('');
    console.log('Fields:');
    console.log('  📋 Status & Priority (new/contacted/converted/declined)');
    console.log('  👤 Contact (name, email, phone, company, job)');
    console.log('  💼 Interest (plan, team size, use case, timeline)');
    console.log('  📊 Tracking (UTM params, IP, user agent)');
    console.log('  📝 Internal Notes');
    console.log('═'.repeat(60));
}

main().catch(console.error);
