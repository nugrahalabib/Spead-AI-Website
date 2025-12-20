import { createDirectus, rest, readItems } from '@directus/sdk';
import 'dotenv/config';

const publicDirectus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest());

async function run() {
    console.log('--- DEBUGGING RELATION FIELD ---');
    try {
        console.log('Fetching projects (raw ID)...');
        // Fetch just the ID and the new field
        const projects = await publicDirectus.request(readItems('projects', {
            fields: ['id', 'title', 'category_id'], // No expansion
            limit: 3
        }));

        projects.forEach(p => {
            console.log(`[${p.id}] ${p.title} -> category_id:`, p.category_id);
        });

    } catch (e) {
        console.error('Error fetching raw:', e.message);
    }
}

run();
