import { createDirectus, rest, authentication, createField } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function addLogoField() {
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

        console.log('Adding "website_logo" field to "global" collection...');

        await directus.request(createField('global', {
            field: 'website_logo',
            type: 'uuid', // Image ID
            meta: {
                interface: 'file-image', // Image uploader
                special: ['file'], // It's a file
                options: {
                    folder: null // Root folder or specific one
                },
                display: 'image',
                note: 'Upload your website logo here (PNG/SVG recommended)',
                width: 'half'
            },
            schema: {
                data_type: 'uuid', // Foreign key to directus_files
                is_nullable: true
            }
        })).catch(err => {
            // Ignore if exists (code 400 or similar message)
            if (err?.errors?.[0]?.extensions?.code === 'FIELD_ALREADY_EXISTS') {
                console.log('Field "website_logo" already exists.');
            } else {
                throw err;
            }
        });

        console.log('Logo field added successfully!');

    } catch (error) {
        console.error('Error adding logo field:', error);
    }
}

addLogoField();
