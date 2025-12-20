import { createDirectus, rest, authentication, createRelation } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function fixRelation() {
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

        console.log('Creating Relation...');
        // Explicitly create the relation metadata
        await directus.request(createRelation({
            collection: 'projects',
            field: 'category_id',
            related_collection: 'project_categories',
            schema: {
                on_delete: 'SET NULL',
            },
            meta: {
                one_field: null,
                sort_field: null,
                one_deselect: true,
                one_collection_field: null,
                one_allowed_collections: null,
                junction_field: null,
                many_collection: null,
                many_field: null,
            }
        }));

        console.log('✅ Relation created in directus_relations!');

    } catch (error) {
        console.error('Error:', error);
    }
}

fixRelation();
