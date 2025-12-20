import { createDirectus, rest, authentication, createCollection, createField, readItems, createItem, updateItem, updateField, deleteField } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

// Default Colors for existing categories
const CATEGORY_COLORS = {
    "AI & Engineering": "#6366f1", // Indigo
    "Content & Business": "#ec4899", // Pink
    "Architecture & Design": "#f97316", // Orange
    "Other": "#a3a3a3" // Neutral
};

async function setupProjectCategories() {
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

        // 1. Create Collection
        console.log('Creating "project_categories" collection...');
        try {
            await directus.request(createCollection({
                collection: 'project_categories',
                meta: {
                    hidden: false,
                    icon: 'category',
                    note: 'Manage project filters and colors dynamically.',
                    sort: 1
                },
                schema: {
                    name: 'project_categories'
                }
            }));
            console.log('Collection created.');
        } catch (e) {
            console.log('Collection might already exist, skipping create...');
        }

        // 2. Create Fields
        console.log('Creating Fields...');
        const fields = [
            { field: 'name', type: 'string', meta: { interface: 'input', required: true, width: 'half' } },
            { field: 'slug', type: 'string', meta: { interface: 'slug', required: true, width: 'half', options: { slugify_input: 'name' } } },
            { field: 'color', type: 'string', meta: { interface: 'color', width: 'half', note: 'Border color for projects in this category.' } },
            { field: 'sort', type: 'integer', meta: { interface: 'input', width: 'half', hidden: true } }
        ];

        for (const f of fields) {
            try {
                await directus.request(createField('project_categories', f));
                console.log(`Field ${f.field} created.`);
            } catch (e) {
                // Ignore if exists
            }
        }

        // 3. Migrate Data
        console.log('Reading existing projects...');
        const projects = await directus.request(readItems('projects', { limit: -1 }));
        const uniqueCategories = [...new Set(projects.map(p => p.category).filter(Boolean))];
        console.log('Found categories:', uniqueCategories);

        const categoryMap = {}; // name -> id

        // Upsert Categories
        for (const catName of uniqueCategories) {
            // Check if exists
            const existing = await directus.request(readItems('project_categories', {
                filter: { name: { _eq: catName } }
            }));

            if (existing.length > 0) {
                categoryMap[catName] = existing[0].id;
                console.log(`Category "${catName}" exists (ID: ${existing[0].id})`);
            } else {
                const newCat = await directus.request(createItem('project_categories', {
                    name: catName,
                    slug: catName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
                    color: CATEGORY_COLORS[catName] || CATEGORY_COLORS['Other'],
                    sort: 0
                }));
                categoryMap[catName] = newCat.id;
                console.log(`Created Category "${catName}" (ID: ${newCat.id})`);
            }
        }

        // 4. Link Projects (Migration)
        // We need a temporary field or change the type of 'category'
        // Direct method: 
        // a. Create 'category_new' (M2O)
        // b. Move data
        // c. Delete 'category'
        // d. Rename 'category_new' -> 'category' (Requires raw database access or strict steps, API renaming is tricky in Directus)
        // Safer approach: Use 'category_id' field.

        console.log('Creating "category_id" relation field on Projects...');
        try {
            await directus.request(createField('projects', {
                field: 'category_id',
                type: 'integer',
                meta: {
                    interface: 'select-dropdown-m2o',
                    special: ['m2o'],
                    required: false // Temporary
                },
                schema: {
                    foreign_key_table: 'project_categories',
                    foreign_key_column: 'id'
                }
            }));
        } catch (e) { console.log('Field might exist'); }

        console.log('Linking projects...');
        for (const project of projects) {
            if (project.category && categoryMap[project.category]) {
                await directus.request(updateItem('projects', project.id, {
                    category_id: categoryMap[project.category]
                }));
                console.log(`Linked project "${project.title}" -> ${project.category}`);
            }
        }

        console.log('--- MIGRATION COMPLETE ---');
        console.log('NOTE: Original "category" text field is KEPT for safety.');
        console.log('Please verify in Admin Panel, then you can delete "category" and rename "category_id" if you wish, or just use "category_id" in frontend.');

    } catch (error) {
        console.error('Error:', error);
    }
}

setupProjectCategories();
