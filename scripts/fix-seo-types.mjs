import { createDirectus, rest, authentication, readSingleton, updateSingleton, updateField } from '@directus/sdk';
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

async function fixSeoTypes() {
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

        // 1. Read current data to backup/transform
        console.log('Reading current SEO data...');
        const currentData = await directus.request(readSingleton('seo'));

        const updates = {};
        for (const field of SEO_FIELDS) {
            let val = currentData[field];

            // If it's a string that looks like an array '["a","b"]', parse it
            if (typeof val === 'string' && val.trim().startsWith('[')) {
                try {
                    val = JSON.parse(val);
                } catch (e) {
                    console.warn(`Could not parse ${field}:`, val);
                }
            }

            // If it's an array, join it to CSV
            if (Array.isArray(val)) {
                updates[field] = val.join(',');
            } else if (typeof val === 'string') {
                updates[field] = val; // Already string/CSV?
            } else {
                updates[field] = null;
            }
            console.log(`Migrating ${field}:`, currentData[field], '->', updates[field]);
        }

        // 2. Update Column Types to 'csv' (which defaults to simple text/varchar)
        // Note: Directus 'csv' is an alias for 'csv' type in meta, but physically generic text.

        for (const field of SEO_FIELDS) {
            console.log(`Updating schema for ${field} to CSV...`);
            await directus.request(updateField('seo', field, {
                type: 'csv', // This tells Directus to treat it as CSV
                meta: {
                    interface: 'tags',
                    note: 'Comma separated keywords (CSV)',
                    options: {
                        placeholder: 'Type keyword and press Enter...'
                    }
                },
                schema: {
                    data_type: 'text' // Ensure DB knows it's text
                }
            }));
        }

        // 3. Write back the data as CSV strings
        console.log('Writing back migrated data...');
        await directus.request(updateSingleton('seo', updates));

        console.log('SEO Types Fixed! All fields are now CSV-based tags.');

    } catch (error) {
        console.error('Error fixing SEO types:', error);
    }
}

fixSeoTypes();
