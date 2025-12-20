import { createDirectus, rest, authentication, readItems, updateItem, updateField } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function fixPostsSeo() {
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
        console.log('Authenticated.');

        // 1. Recover/Backup Data
        console.log('Reading existing posts...');
        const posts = await directus.request(readItems('posts', { limit: -1 }));

        // Transform data map
        const updates = new Map();

        for (const post of posts) {
            let val = post.seo_keywords;
            let cleanArray = [];

            if (typeof val === 'string') {
                val = val.trim();
                if (val.startsWith('[')) {
                    try {
                        cleanArray = JSON.parse(val);
                    } catch { cleanArray = []; }
                } else if (val.includes(',')) {
                    cleanArray = val.split(',').map(s => s.trim()).filter(s => s);
                } else if (val) {
                    cleanArray = [val];
                }
            } else if (Array.isArray(val)) {
                cleanArray = val; // Directus might return array if types got mixed
            }

            // Ensure objects
            const objectList = cleanArray.map(k => {
                return typeof k === 'object' ? k : { keyword: k };
            });

            if (objectList.length > 0 || val !== null) {
                updates.set(post.id, objectList);
            }
        }

        console.log(`Found ${updates.size} posts to migrate.`);

        // 2. Change Schema to JSON + List Interface
        console.log(`Updating schema for seo_keywords in posts...`);
        // We delete first to clear types (sometimes needed if converting string->json strict)
        // Actually, updateField with explicit type usually handles it in Directus via cast

        await directus.request(updateField('posts', 'seo_keywords', {
            type: 'json',
            meta: {
                interface: 'list',
                special: ['cast-json'],
                options: {
                    addLabel: 'Add Keyword',
                    template: '{{keyword}}',
                    fields: [
                        {
                            field: 'keyword',
                            name: 'Keyword',
                            type: 'string',
                            meta: {
                                interface: 'input',
                                width: 'full',
                                placeholder: 'Enter keyword...'
                            }
                        }
                    ]
                },
                display: 'related-values',
                width: 'full'
            },
            schema: {
                data_type: 'json'
            }
        }));

        // 3. Save Data Back
        console.log('Restoring migrated data...');
        for (const [id, keywords] of updates) {
            console.log(`Updating Post ${id}...`);
            await directus.request(updateItem('posts', id, {
                seo_keywords: keywords
            }));
        }

        console.log('Fixed Posts SEO UI! Refresh Admin Panel.');

    } catch (error) {
        console.error('Error fixing Posts SEO:', error);
    }
}

fixPostsSeo();
