import { createDirectus, rest, authentication, updateCollection } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function enableSort() {
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
        await directus.setToken(loginData.data.access_token);

        console.log('Enabling Drag & Drop Sort for project_categories...');

        await directus.request(updateCollection('project_categories', {
            meta: {
                sort_field: 'sort' // This enables the UI drag handle
            }
        }));

        console.log('✅ Sort field configured successfully!');
        console.log('You should now see the drag handle in the Admin UI.');

    } catch (error) {
        console.error('Error:', error);
    }
}

enableSort();
