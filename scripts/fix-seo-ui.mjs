import { createDirectus, rest, authentication, readItems, updateField } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

const SEO_FIELDS = [
    'home_keywords',
    'journey_keywords',
    'blog_keywords',
    'projects_keywords'
];

async function fixSeoUi() {
    try {
        console.log('Authenticating...');
        // Manual auth to be safe
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
        console.log('Authenticated.');

        console.log('Fixing SEO Fields UI in "seo" collection...');

        for (const field of SEO_FIELDS) {
            console.log(`Updating interface for field: ${field}...`);
            await directus.request(updateField('seo', field, {
                meta: {
                    interface: 'tags', // The magic interface for keywords
                    options: {
                        placeholder: 'Type keyword and press Enter...'
                    },
                    display: 'labels', // Show as chips in table view
                    width: 'full'
                }
            }));
        }

        console.log('SEO Fields UI fixed! Refresh your Admin Panel.');

    } catch (error) {
        console.error('Error fixing SEO UI:', error);
    }
}

fixSeoUi();
