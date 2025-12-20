import { createDirectus, rest, authentication } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function fixProjectsPermissions() {
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

        // Update permissions for 'projects'
        // Role: null (for Public)

        const permissionPayload = {
            role: null, // Public Role is NULL
            collection: 'projects',
            action: 'read',
            permissions: {},
            fields: ['*'] // Explicitly allow ALL fields including new relations
        };

        console.log('Granting FULL READ access to projects (Public)...');
        // We use POST (Create) but if it exists we might need PATCH.
        // The API usually handles "upsert" for permissions if we identify by ID, but simpler is to delete existing or try create.
        // Creating might fail if unique constraint exists.

        // Let's first DELETE existing permission if we can find it, to be clean.
        // Fetch permissions for public on projects
        const permRes = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/permissions?filter[role][_null]=true&filter[collection][_eq]=projects&filter[action][_eq]=read`, {
            headers: { 'Authorization': `Bearer ${loginData.data.access_token}` }
        });
        const existingPerms = await permRes.json();

        if (existingPerms.data && existingPerms.data.length > 0) {
            const permId = existingPerms.data[0].id;
            console.log(`Found existing permission ${permId}, updating...`);

            await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/permissions/${permId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginData.data.access_token}`
                },
                body: JSON.stringify({ fields: ['*'] })
            });
            console.log('✅ Permission updated.');
        } else {
            console.log('No existing permission, creating new...');
            await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/permissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginData.data.access_token}`
                },
                body: JSON.stringify(permissionPayload)
            });
            console.log('✅ Permission created.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

fixProjectsPermissions();
