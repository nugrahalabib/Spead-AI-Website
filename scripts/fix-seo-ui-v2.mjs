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

async function fixSeoUiObjectList() {
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

        // 1. Recover and Transform Data
        console.log('Recovering and transforming data to Objects...');
        const currentData = await directus.request(readSingleton('seo'));
        const updates = {};

        for (const field of SEO_FIELDS) {
            let val = currentData[field];
            let cleanArray = [];

            // Normalize to array of strings first
            if (Array.isArray(val)) {
                cleanArray = val; // Assuming it's already ['a', 'b'] from previous step
            } else if (typeof val === 'string') {
                try {
                    cleanArray = JSON.parse(val);
                } catch {
                    cleanArray = val.split(',').map(s => s.trim()).filter(s => s);
                }
            }

            // Check if it's already objects (safety check)
            if (cleanArray.length > 0 && typeof cleanArray[0] === 'object') {
                // Already objects, just keep them or map them if needed
                // Assuming structure is correct if it's object
                updates[field] = cleanArray;
            } else {
                // Map strings to Objects: { "keyword": "value" }
                updates[field] = cleanArray.map(k => ({ keyword: k }));
            }

            console.log(`Transformed ${field}:`, JSON.stringify(updates[field]));
        }

        // 2. Change Schema to JSON + List Interface with FIELDS definition
        for (const field of SEO_FIELDS) {
            console.log(`Updating schema for ${field} to Object List...`);
            await directus.request(updateField('seo', field, {
                type: 'json',
                meta: {
                    interface: 'list',
                    special: ['cast-json'],
                    options: {
                        addLabel: 'Add Keyword',
                        template: '{{keyword}}', // Show the 'keyword' property in the list
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
                    display: 'related-values', // or 'json'
                    width: 'full'
                },
                schema: {
                    data_type: 'json'
                }
            }));
        }

        // 3. Save Data
        console.log('Saving objectified data...');
        await directus.request(updateSingleton('seo', updates));

        console.log('Fixed! UI should now allow adding items properly.');

    } catch (error) {
        console.error('Error fixing SEO UI Objects:', error);
    }
}

fixSeoUiObjectList();
