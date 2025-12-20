import { createDirectus, rest, authentication } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function fixPermissions() {
    try {
        console.log('Authenticating...');
        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            })
        });

        if (!loginRes.ok) throw new Error('Login failed');
        const loginData = await loginRes.json();

        // Update permissions for 'project_categories' by posting simple payload
        // Role: null (for Public)

        const permissionPayload = {
            role: null, // Public Role is NULL
            collection: 'project_categories',
            action: 'read',
            permissions: {}, // Full read access
            fields: '*'
        };

        console.log('Granting READ access to project_categories (Public permissions)...');
        const res = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/permissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.data.access_token}`
            },
            body: JSON.stringify(permissionPayload)
        });

        if (res.ok) {
            console.log('✅ Permission granted successfully!');
        } else {
            const err = await res.json();
            console.log('Notice:', err.errors?.[0]?.message);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

fixPermissions();
