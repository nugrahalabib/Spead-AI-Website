import { createDirectus, rest, authentication, readField, readRelations } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function debugLogoField() {
    try {
        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            })
        });
        const loginData = await loginRes.json();
        await directus.setToken(loginData.data.access_token);

        console.log('--- Field Info ---');
        const field = await directus.request(readField('global', 'website_logo'));
        console.log(JSON.stringify(field, null, 2));

        console.log('\n--- Relations Info ---');
        const relations = await directus.request(readRelations());
        const logoRelation = relations.find(r => r.collection === 'global' && r.field === 'website_logo');
        console.log(logoRelation ? JSON.stringify(logoRelation, null, 2) : 'NO RELATION FOUND');

    } catch (e) { console.error(e); }
}

debugLogoField();
