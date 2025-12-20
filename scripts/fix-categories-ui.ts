/**
 * Fix Categories Collection UI
 * - Color: Dropdown with Tailwind color presets
 * - Icon: Dropdown with Lucide icon names
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🎨 Fixing Categories UI...\n');

    // Login
    const loginRes = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const updateField = async (collection: string, field: string, meta: any) => {
        const res = await fetch(`${URL}/fields/${collection}/${field}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ meta })
        });
        console.log(`   ${res.ok ? '✓' : '✗'} ${collection}.${field}`);
    };

    console.log('\n📁 Updating Categories fields...\n');

    // Name - proper input
    await updateField('categories', 'name', {
        interface: 'input',
        note: 'Nama kategori yang akan ditampilkan di website.',
        width: 'half',
        sort: 1,
        options: {
            placeholder: 'Contoh: Press Release'
        }
    });

    // Slug - URL friendly
    await updateField('categories', 'slug', {
        interface: 'input',
        note: 'URL identifier (huruf kecil, tanpa spasi). Contoh: press-release',
        width: 'half',
        sort: 2,
        options: {
            placeholder: 'press-release',
            slug: true
        }
    });

    // Color - Dropdown with Tailwind presets
    await updateField('categories', 'color', {
        interface: 'select-dropdown',
        display: 'labels',
        note: 'Warna badge kategori di website.',
        width: 'half',
        sort: 3,
        options: {
            choices: [
                { text: '🔵 Blue', value: 'text-blue-400' },
                { text: '🟢 Emerald', value: 'text-emerald-400' },
                { text: '🔴 Red', value: 'text-red-400' },
                { text: '🟣 Purple', value: 'text-purple-400' },
                { text: '🟡 Yellow', value: 'text-yellow-400' },
                { text: '🩵 Cyan', value: 'text-cyan-400' },
                { text: '🟠 Orange', value: 'text-orange-400' },
                { text: '💗 Pink', value: 'text-pink-400' },
                { text: '⚪ Slate', value: 'text-slate-400' }
            ]
        }
    });

    // Icon - Dropdown with common Lucide icons
    await updateField('categories', 'icon', {
        interface: 'select-dropdown',
        display: 'raw',
        note: 'Icon yang tampil di badge. Nama icon dari Lucide.',
        width: 'half',
        sort: 4,
        options: {
            choices: [
                { text: '📰 Newspaper (Press)', value: 'newspaper' },
                { text: '⚡ Zap (Update)', value: 'zap' },
                { text: '🛡️ Shield Alert (Security)', value: 'shield-alert' },
                { text: '📅 Calendar (Event)', value: 'calendar' },
                { text: '🖥️ Cpu (Engineering)', value: 'cpu' },
                { text: '🚀 Rocket (Launch)', value: 'rocket' },
                { text: '📢 Megaphone (Announcement)', value: 'megaphone' },
                { text: '💡 Lightbulb (Idea)', value: 'lightbulb' },
                { text: '🏆 Trophy (Award)', value: 'trophy' },
                { text: '📊 Bar Chart (Analytics)', value: 'bar-chart' },
                { text: '🔧 Wrench (Maintenance)', value: 'wrench' },
                { text: '📦 Package (Release)', value: 'package' }
            ],
            allowOther: true
        }
    });

    // Description - Textarea
    await updateField('categories', 'description', {
        interface: 'input-multiline',
        note: 'Deskripsi singkat kategori (opsional).',
        width: 'full',
        sort: 5,
        options: {
            placeholder: 'Deskripsi kategori...'
        }
    });

    console.log('\n✨ Categories UI fixed!');
    console.log('   Hard refresh Directus (Ctrl+Shift+R)\n');
}

main();
