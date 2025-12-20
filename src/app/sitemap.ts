import { MetadataRoute } from 'next';
import directus from '@/lib/directus';
import { readItems } from '@directus/sdk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spead.ai';

    // 1. Static Routes
    const routes = [
        '',
        '/blog',
        '/news',
        '/booking',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Dynamic Blog Posts & News
    let blogRoutes: MetadataRoute.Sitemap = [];
    let newsRoutes: MetadataRoute.Sitemap = [];

    try {
        // Fetch blog posts from 'blogs' collection
        const blogs = await directus.request(readItems('blogs' as any, {
            filter: { status: { _eq: 'published' } },
            fields: ['slug', 'published_date'],
        })) as any[];

        blogRoutes = blogs.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.published_date),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        // Fetch news posts from 'posts' collection
        const posts = await directus.request(readItems('posts' as any, {
            filter: { status: { _eq: 'published' } },
            fields: ['slug', 'published_date'],
        })) as any[];

        newsRoutes = posts.map((post) => ({
            url: `${baseUrl}/news/${post.slug}`,
            lastModified: new Date(post.published_date),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...routes, ...blogRoutes, ...newsRoutes];

    } catch (error) {
        console.error('Error fetching data for sitemap:', error);
        return [...routes];
    }
}

