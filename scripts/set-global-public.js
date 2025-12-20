import { createDirectus, rest, authentication, readRoles, updatePermission, createPermission, readPermissions } from '@directus/sdk';

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function setPublicPermissions() {
    const client = createDirectus(DIRECTUS_URL)
        .with(authentication('json', { autoRefresh: true }))
        .with(rest());

    try {
        // Authenticate via REST to get token
        const loginResponse = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        });
        const loginData = await loginResponse.json();

        if (!loginData.data?.access_token) {
            throw new Error('Authentication failed');
        }

        const token = loginData.data.access_token;
        client.setToken(token);
        console.log('✅ Authenticated as Admin');

        const roles = await client.request(readRoles());
        // null role is Public
        const publicRole = null;

        console.log('🔍 Checking Public permissions for global_settings...');

        const existingPerms = await client.request(readPermissions({
            filter: {
                role: { _null: true },
                collection: { _eq: 'global_settings' },
                action: { _eq: 'read' }
            }
        }));

        if (existingPerms.length > 0) {
            console.log('✅ Public Read permission already exists for global_settings');
        } else {
            console.log('⚠️ No Public Read permission found. Creating...');
            await client.request(createPermission({
                role: null, // Public
                collection: 'global_settings',
                action: 'read',
                fields: ['*']
            }));
            console.log('✅ Created Public Read permission for global_settings');
        }

    } catch (error) {
        console.error('❌ Error setting public permissions:', error);
    }
}

setPublicPermissions();
