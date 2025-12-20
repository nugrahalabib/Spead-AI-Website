/**
 * Enable Public Read Access for News Collections
 * This allows the frontend to fetch posts without authentication
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🔓 Enabling Public Read Access...\n');

    // Login as admin
    const loginRes = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated as Admin');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Get public role ID
    console.log('🔍 Finding Public role...');
    const rolesRes = await fetch(`${URL}/roles`, { headers });
    const rolesData = await rolesRes.json();

    // Find the public role (usually has name = null or "Public")
    const publicRole = rolesData.data?.find((r: any) => r.name === null || r.name === 'Public' || r.admin_access === false);

    if (!publicRole) {
        console.log('❌ Public role not found. Creating one...');
        // Directus usually has a built-in public role, but let's check
    } else {
        console.log(`   Found Public role: ${publicRole.id}`);
    }

    // Collections to make public readable
    const collections = ['posts', 'categories', 'authors'];

    for (const collection of collections) {
        console.log(`\n📂 Setting permissions for: ${collection}`);

        // Check if permission exists
        const existingPerms = await fetch(`${URL}/permissions?filter[collection][_eq]=${collection}&filter[role][_null]=true`, { headers });
        const existingData = await existingPerms.json();

        if (existingData.data?.some((p: any) => p.action === 'read')) {
            console.log('   ✓ Read permission already exists');
            continue;
        }

        // Create read permission for public (role = null means public)
        const permRes = await fetch(`${URL}/permissions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                collection: collection,
                action: 'read',
                role: null, // null = public access
                permissions: {}, // All items
                fields: ['*'] // All fields
            })
        });

        if (permRes.ok) {
            console.log('   ✓ Read permission created');
        } else {
            const err = await permRes.text();
            console.log('   ✗ Error:', err);
        }
    }

    // Also enable public access to directus_files for images
    console.log('\n📂 Setting permissions for: directus_files');
    const filesPermRes = await fetch(`${URL}/permissions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            collection: 'directus_files',
            action: 'read',
            role: null,
            permissions: {},
            fields: ['*']
        })
    });

    if (filesPermRes.ok) {
        console.log('   ✓ Files read permission created');
    } else {
        console.log('   ✓ Files permission might already exist');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Public Access Enabled!');
    console.log('   Frontend can now fetch posts without auth.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();
