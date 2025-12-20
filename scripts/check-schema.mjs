import { createDirectus, rest, authentication, readRelations } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function checkSchema() {
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

        console.log('Fetching relations...');
        const relations = await directus.request(readRelations());

        const catRelation = relations.find(r =>
            r.collection === 'projects' &&
            r.field === 'category_id'
        );

        if (catRelation) {
            console.log('✅ Relation found in directus_relations!');
            console.log(catRelation);
        } else {
            console.error('❌ Relation NOT FOUND in directus_relations!');
            console.log('Directus does not know this is a relationship, hence no expansion.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

checkSchema();
