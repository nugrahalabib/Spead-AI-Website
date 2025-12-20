import { createDirectus, rest, authentication, createField } from '@directus/sdk';
import 'dotenv/config';

const ADMIN_URL = 'https://admin.nugrahalabib.com';
console.log('Targeting Directus:', ADMIN_URL);

const directus = createDirectus(ADMIN_URL)
    .with(rest())
    .with(authentication());

async function addProjectParityFields() {
    try {
        console.log('Authenticating...');
        const loginRes = await fetch(`${ADMIN_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            })
        });

        if (!loginRes.ok) throw new Error('Login failed. Check ADMIN_EMAIL and ADMIN_PASSWORD in .env');
        const loginData = await loginRes.json();
        await directus.setToken(loginData.data.access_token);
        console.log('Authenticated.');

        const fieldsToAdd = [
            {
                field: 'canonical_url',
                type: 'string',
                meta: {
                    interface: 'input',
                    options: { placeholder: 'https://example.com/original-source' },
                    note: 'Canonical URL for SEO to prevent duplicate content issues.',
                    width: 'full'
                }
            },
            {
                field: 'is_featured',
                type: 'boolean',
                meta: {
                    interface: 'boolean',
                    note: 'Toggle to feature this project on the homepage or top of lists.',
                    width: 'half'
                },
                schema: {
                    default_value: false
                }
            },
            {
                field: 'key_takeaways',
                type: 'text',
                meta: {
                    interface: 'input-rich-text-md', // Markdown for rich content
                    note: 'Executive summary or key learning points (mapped to JSON-LD Abstract).',
                    width: 'full'
                }
            },
            {
                field: 'seo_title',
                type: 'string',
                meta: {
                    interface: 'input',
                    note: 'Custom Meta Title (Overrides Project Title).',
                    width: 'half'
                }
            },
            {
                field: 'seo_description',
                type: 'text',
                meta: {
                    interface: 'input-multiline',
                    note: 'Custom Meta Description (Overrides Project Description).',
                    width: 'half'
                }
            }
        ];

        console.log('Adding missing fields to "projects" collection...');

        for (const f of fieldsToAdd) {
            try {
                console.log(`Checking/Creating field: ${f.field}...`);
                await directus.request(createField('projects', f));
                console.log(`✅ Field "${f.field}" created successfully.`);
            } catch (error) {
                // standardized error check for "field already exists"
                if (error?.errors?.[0]?.extensions?.code === 'FIELD_ALREADY_EXISTS' || error.message.includes('already exists')) {
                    console.log(`ℹ️ Field "${f.field}" already exists. Skipping.`);
                } else {
                    console.error(`❌ Failed to create "${f.field}":`, error.message || error);
                }
            }
        }

        console.log('--- MIGRATION COMPLETE ---');
        console.log('The "projects" collection now has full parity with "posts".');

    } catch (error) {
        console.error('Fatal Error:', error);
    }
}

addProjectParityFields();
