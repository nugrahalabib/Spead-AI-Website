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

async function fixSeoUiFinal() {
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

        // 1. Recover Data
        console.log('Recovering data...');
        const currentData = await directus.request(readSingleton('seo'));
        const updates = {};

        for (const field of SEO_FIELDS) {
            let val = currentData[field];
            // It might be a stringified array '["a","b"]' OR a CSV string "a,b"
            // We want a pure JSON Array ["a", "b"]

            if (typeof val === 'string') {
                val = val.trim();
                if (val.startsWith('[')) {
                    try {
                        val = JSON.parse(val); // Parse stringified JSON
                    } catch (e) { console.warn(`Parse error ${field}`, e); }
                } else if (val.includes(',')) {
                    val = val.split(',').map(s => s.trim()); // Parse CSV
                } else if (val.length > 0) {
                    val = [val]; // Single item
                } else {
                    val = []; // Empty string
                }
            } else if (!val) {
                val = [];
            }

            updates[field] = val;
            console.log(`Recovered ${field}:`, updates[field]);
        }

        // 2. Change Schema to JSON + List Interface
        for (const field of SEO_FIELDS) {
            console.log(`Updating schema for ${field} to JSON List...`);
            await directus.request(updateField('seo', field, {
                type: 'json',
                meta: {
                    interface: 'list', // The "List" interface (stable array manager)
                    special: ['cast-json'], // Ensure DB treats as JSON
                    options: {
                        addLabel: 'Add Keyword',
                        template: '{{value}}' // Simple string list
                    },
                    display: 'labels', // Show as chips in table
                    width: 'full'
                },
                schema: {
                    data_type: 'json' // Force DB type
                }
            }));
        }

        // 3. Save Data
        console.log('Saving cleaned data...');
        await directus.request(updateSingleton('seo', updates));

        console.log('Fixed! Please refresh Admin Panel.');

    } catch (error) {
        console.error('Error fixing SEO UI Final:', error);
    }
}

fixSeoUiFinal();
