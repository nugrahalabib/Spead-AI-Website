import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://spead.ai';

// Webhook secret for security (set in Directus webhook config)
const WEBHOOK_SECRET = process.env.DIRECTUS_WEBHOOK_SECRET || 'your-webhook-secret';

/**
 * This endpoint receives webhooks from Directus when content changes
 * and pings Google to re-crawl the sitemap
 */
export async function POST(request: NextRequest) {
    try {
        // Verify webhook secret
        const authHeader = request.headers.get('x-webhook-secret');
        if (authHeader !== WEBHOOK_SECRET) {
            console.warn('Invalid webhook secret');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        console.log('Directus webhook received:', JSON.stringify(body, null, 2));

        // Extract collection and action from webhook payload
        const collection = body.collection || body.payload?.collection || 'unknown';
        const action = body.event || body.action || 'update';
        const keys = body.keys || body.key || [];

        console.log(`Content change detected: ${collection} - ${action}`);

        // Ping Google to re-crawl sitemap
        const sitemapUrl = `${BASE_URL}/sitemap.xml`;
        const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

        const googleResponse = await fetch(googlePingUrl, { method: 'GET' });
        console.log(`Google ping response: ${googleResponse.status}`);

        // Also ping Bing (IndexNow compatible)
        const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
        const bingResponse = await fetch(bingPingUrl, { method: 'GET' });
        console.log(`Bing ping response: ${bingResponse.status}`);

        // Log the notification
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Sitemap ping sent for: ${collection} (${action})`);

        return NextResponse.json({
            success: true,
            message: 'Search engines notified',
            details: {
                collection,
                action,
                keys,
                google: googleResponse.status === 200 ? 'pinged' : 'failed',
                bing: bingResponse.status === 200 ? 'pinged' : 'failed',
                timestamp,
            }
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Failed to process webhook' },
            { status: 500 }
        );
    }
}

// Also allow GET for testing
export async function GET() {
    const sitemapUrl = `${BASE_URL}/sitemap.xml`;

    try {
        // Ping Google
        const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
        await fetch(googlePingUrl);

        // Ping Bing
        const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
        await fetch(bingPingUrl);

        return NextResponse.json({
            success: true,
            message: 'Manual ping sent to search engines',
            sitemap: sitemapUrl,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to ping' }, { status: 500 });
    }
}
