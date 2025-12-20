import { createDirectus, rest, authentication, createRelation, updateField } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function fixLogoRelation() {
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

        console.log('Creating Relation to directus_files...');

        // 1. Create the Foreign Key Relation
        try {
            await directus.request(createRelation({
                collection: 'global',
                field: 'website_logo',
                related_collection: 'directus_files',
                schema: {
                    on_delete: 'SET NULL' // Safety: don't delete Global if file is deleted
                }
            }));
            console.log('Relation created successfully.');
        } catch (e) {
            console.log('Relation creation skipped (might exist or error):', e.message);
        }

        // 2. Update Interface to "Image" (Standard) and ensure it knows it's a file
        console.log('Updating Field Interface...');
        await directus.request(updateField('global', 'website_logo', {
            meta: {
                interface: 'file-image', // Explicitly File Image interface
                special: ['file'],
                display: 'image',
                options: {
                    folder: null // Allow root folder
                },
                note: 'RECOMMENDED: Upload a Square PNG/SVG for best results as Favicon.'
            }
        }));

        console.log('Logo field fixed with proper Relation!');

    } catch (error) {
        console.error('Error fixing logo relation:', error);
    }
}

fixLogoRelation();
