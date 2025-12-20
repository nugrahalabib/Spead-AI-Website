import { createDirectus, rest, staticToken, updatePermission, createPermission, readPermissions } from '@directus/sdk';

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
    console.log("🔑 Authenticating...");
    const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@spead.ai', password: 'password123' })
    });
    const data = await response.json();
    if (!data.data?.access_token) throw new Error("Authentication Failed");
    return data.data.access_token;
}

async function fixPermissions() {
    console.log("🛡️ Checking permissions for lp_hero...");
    const token = await getAuthToken();
    const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

    // Public Role is represented by NULL in permissions
    console.log("ℹ️ Configuring Public Access (Role = NULL)...");

    // Check existing permission
    const perms = await client.request(readPermissions({
        filter: {
            role: { _null: true },
            collection: { _eq: 'lp_hero' }
        }
    }));

    if (perms.length > 0) {
        console.log("✅ Permission already exists. Updating to be sure...");
        await client.request(updatePermission(perms[0].id, {
            action: 'read',
            fields: ['*']
        }));
    } else {
        console.log("⚠️ Permission missing. Creating...");
        await client.request(createPermission({
            role: null, // Public
            collection: 'lp_hero',
            action: 'read',
            fields: ['*']
        }));
    }

    console.log("✅ lp_hero is now Publicly Readable.");
}

fixPermissions();
