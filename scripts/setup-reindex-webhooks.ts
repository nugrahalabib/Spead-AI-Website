/**
 * Setup Directus Webhooks for Auto-Ping Search Engines
 * 
 * This script creates webhooks in Directus that will notify the Next.js app
 * whenever content is created, updated, or deleted.
 */

const DIRECTUS_URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

// Your Next.js app URL (change this for production)
const NEXTJS_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://spead.ai';
const WEBHOOK_SECRET = 'spead-ai-webhook-secret-2024'; // Set this in .env.local too

async function main() {
    console.log('🔔 Setting up Directus Webhooks for Auto-Indexing\n');
    console.log('═'.repeat(60));

    // Auth
    const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated\n');

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Collections to watch for changes
    const collectionsToWatch = [
        'posts',           // News articles
        'blogs',           // Blog posts
        'categories',      // News categories
        'blog_categories', // Blog categories
        'authors',         // Authors
        'global_settings', // Site settings (logo, favicon, etc.)
        'news_page_settings',
        'blog_page_settings',
        'pricing_header',
        'pricing_plans',
        'solutions',
        'solution_cards',
        'security_features',
        'use_cases',
        'industry_tabs',
    ];

    // Actions to trigger webhook
    const actions = ['items.create', 'items.update', 'items.delete'];

    console.log('📡 Creating webhooks for collections:');
    console.log(collectionsToWatch.map(c => `   • ${c}`).join('\n'));
    console.log('');

    // First, check existing webhooks
    const existingRes = await fetch(`${DIRECTUS_URL}/webhooks`, { headers });
    const existingData = await existingRes.json();
    const existingWebhooks = existingData.data || [];

    // Delete existing reindex webhooks
    for (const webhook of existingWebhooks) {
        if (webhook.name?.includes('Auto-Reindex')) {
            await fetch(`${DIRECTUS_URL}/webhooks/${webhook.id}`, {
                method: 'DELETE',
                headers
            });
            console.log(`   🗑️  Deleted existing webhook: ${webhook.name}`);
        }
    }

    // Create new webhooks for each collection
    let created = 0;
    for (const collection of collectionsToWatch) {
        const webhookData = {
            name: `Auto-Reindex: ${collection}`,
            method: 'POST',
            url: `${NEXTJS_URL}/api/reindex`,
            status: 'active',
            actions: actions,
            collections: [collection],
            headers: [
                {
                    header: 'x-webhook-secret',
                    value: WEBHOOK_SECRET
                },
                {
                    header: 'Content-Type',
                    value: 'application/json'
                }
            ],
            data: true // Include payload data
        };

        const res = await fetch(`${DIRECTUS_URL}/webhooks`, {
            method: 'POST',
            headers,
            body: JSON.stringify(webhookData)
        });

        if (res.ok) {
            created++;
            console.log(`   ✓ Created webhook for: ${collection}`);
        } else {
            const err = await res.json().catch(() => ({}));
            console.log(`   ✗ Failed for ${collection}: ${err?.errors?.[0]?.message || 'unknown error'}`);
        }
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`✨ DONE! Created ${created}/${collectionsToWatch.length} webhooks`);
    console.log('');
    console.log('📌 IMPORTANT: Add this to your .env.local:');
    console.log(`   DIRECTUS_WEBHOOK_SECRET=${WEBHOOK_SECRET}`);
    console.log('');
    console.log('🔗 Webhook endpoint: /api/reindex');
    console.log('🔔 Actions: create, update, delete');
    console.log('🌐 Will ping: Google & Bing sitemaps');
    console.log('═'.repeat(60));
}

main().catch(console.error);
