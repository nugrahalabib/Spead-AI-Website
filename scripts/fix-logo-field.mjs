import { createDirectus, rest, authentication, updateField } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function fixLogoField() {
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

        console.log('Updating "website_logo" field interface...');

        // Switch to the standard 'image' interface which is simpler and user-friendly
        await directus.request(updateField('global', 'website_logo', {
            meta: {
                interface: 'image', // The standard visual image picker
                note: 'Click to select or upload your logo (Favicon & Navbar).',
                options: {
                    // Remove restrictive folder options
                },
                display: 'image', // Show preview in forms
                width: 'half'
            }
        }));

        console.log('Logo field interface fixed!');

    } catch (error) {
        console.error('Error fixing logo field:', error);
    }
}

fixLogoField();
