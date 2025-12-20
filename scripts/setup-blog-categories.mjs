import {
    createDirectus,
    rest,
    authentication,
    createCollection,
    createField,
    readItems,
    updateItem,
    createItem,
    updateCollection,
    createRelation
} from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

// Helper to generate slug
const slugify = (text) => text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text

// Fixed colors for migration mapping based on existing hardcoded colors
const CATEGORY_COLORS = {
    'technology': '#818cf8',   // Indigo
    'business': '#34d399',     // Emerald
    'architecture': '#fbbf24', // Amber
    'design': '#f472b6',       // Pink
    'life': '#22d3ee',         // Cyan
    'default': '#a3a3a3'       // Neutral
};

async function setupBlogCategories() {
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

        // 1. Create Collection
        console.log('Creating "blog_categories" collection...');
        try {
            await directus.request(createCollection({
                collection: 'blog_categories',
                name: 'Blog Categories',
                schema: {},
                meta: {
                    icon: 'category',
                    note: 'Dynamic categories for blog posts',
                    sort_field: 'sort' // Enable Sort immediately
                }
            }));
            console.log('✅ Collection created.');
        } catch (e) {
            console.log('ℹ️ Collection might already exist:', e.message);
        }

        // 2. Add Fields
        console.log('Adding fields...');
        const fields = [
            { field: 'name', type: 'string', meta: { interface: 'input', display: 'raw', required: true, width: 'half' } },
            { field: 'slug', type: 'string', meta: { interface: 'input', display: 'raw', required: true, width: 'half' } },
            { field: 'color', type: 'string', meta: { interface: 'select-color', display: 'color', width: 'half' } },
            { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true } }
        ];

        for (const f of fields) {
            try {
                await directus.request(createField('blog_categories', f));
                console.log(`   - Field ${f.field} created.`);
            } catch (e) {
                // Ignore if exists
            }
        }

        // 3. Add Relations Field to Posts
        console.log('Adding category_id to posts...');
        try {
            await directus.request(createField('posts', {
                field: 'category_id',
                type: 'integer',
                meta: {
                    interface: 'select-dropdown-m2o',
                    special: ['m2o'],
                    display: 'related-values',
                    display_options: { template: '{{name}}' },
                    width: 'half'
                },
                schema: {
                    is_nullable: true,
                    foreign_key_column: 'id',
                    foreign_key_table: 'blog_categories'
                }
            }));
            console.log('✅ Field category_id added to posts.');

            // IMPORTANT: Create Relation Metadata in directus_relations
            await directus.request(createRelation({
                collection: 'posts',
                field: 'category_id',
                related_collection: 'blog_categories',
                schema: { on_delete: 'SET NULL' },
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
            console.log('✅ Relation metadata created.');

        } catch (e) {
            console.log('ℹ️ Field/Relation might already exist:', e.message);
        }

        // 4. Migrate Data
        console.log('Migrating existing data...');
        const posts = await directus.request(readItems('posts'));
        const existingCategories = new Set(posts.map(p => p.category).filter(Boolean));

        const categoryMap = {}; // Name -> ID

        for (const catName of existingCategories) {
            // Check if exists
            const existing = await directus.request(readItems('blog_categories', {
                filter: { name: { _eq: catName } }
            }));

            let catId;
            if (existing.length > 0) {
                catId = existing[0].id;
            } else {
                // Create new
                const slug = slugify(catName);
                // Try to match color from old constants, lowercased
                const colorKey = catName.toLowerCase();
                const color = CATEGORY_COLORS[colorKey] || CATEGORY_COLORS['default'];

                const newCat = await directus.request(createItem('blog_categories', {
                    name: catName,
                    slug: slug,
                    color: color
                }));
                catId = newCat.id;
                console.log(`   + Created category: ${catName} (${color})`);
            }
            categoryMap[catName] = catId;
        }

        // Update Posts
        for (const post of posts) {
            if (post.category && categoryMap[post.category]) {
                await directus.request(updateItem('posts', post.id, {
                    category_id: categoryMap[post.category]
                }));
                console.log(`   -> Linked post "${post.title}" to category ID ${categoryMap[post.category]}`);
            }
        }

        // 5. Permissions (PUBLIC READ)
        console.log('Configuring permissions...');

        // 5a. Public Access to blog_categories
        await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/permissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.data.access_token}`
            },
            body: JSON.stringify({
                role: null, // Public
                collection: 'blog_categories',
                action: 'read',
                permissions: {},
                fields: '*'
            })
        }).catch(() => console.log('   (Permission might already exist)'));

        // 5b. Public Access to posts (Full Read Update to ensure relation is readable)
        // First, check if permission exists for posts
        const permRes = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/permissions?filter[role][_null]=true&filter[collection][_eq]=posts&filter[action][_eq]=read`, {
            headers: { 'Authorization': `Bearer ${loginData.data.access_token}` }
        });
        const existingPerms = await permRes.json();

        if (existingPerms.data && existingPerms.data.length > 0) {
            const permId = existingPerms.data[0].id;
            console.log('   Updating posts permission to allow all fields...');
            await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/permissions/${permId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginData.data.access_token}`
                },
                body: JSON.stringify({ fields: ['*'] })
            });
        }

        console.log('✅ Setup Complete! Blog Categories are ready.');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

setupBlogCategories();
