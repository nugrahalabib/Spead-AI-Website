import { createDirectus, rest, readItems } from '@directus/sdk';
import 'dotenv/config';

// Simulate Client (No Auth / Public)
const publicDirectus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest());

async function debugCategories() {
    console.log('--- DEBUGGING PUBLIC API ACCESS ---');

    // 1. Try to fetch Categories
    try {
        console.log('Fetching project_categories...');
        const categories = await publicDirectus.request(readItems('project_categories'));
        console.log('✅ Categories fetch success. Count:', categories.length);
        console.log('Sample:', categories[0]);
    } catch (e) {
        console.error('❌ Failed to fetch project_categories:', e.errors?.[0]?.message || e.message);
    }

    // 2. Try to fetch Projects with Expanded Category
    try {
        console.log('\nFetching projects with expanded category_id...');
        const projects = await publicDirectus.request(readItems('projects', {
            fields: ['id', 'title', 'category', { category_id: ['name', 'slug', 'color'] }],
            limit: 3
        }));
        console.log('✅ Projects fetch success.');
        projects.forEach(p => {
            console.log(`[${p.id}] ${p.title}`);
            console.log(`   - Old Category: ${p.category}`);
            console.log(`   - New Category_ID:`, p.category_id);
        });
    } catch (e) {
        console.error('❌ Failed to fetch projects:', e.errors?.[0]?.message || e.message);
    }
}

debugCategories();
