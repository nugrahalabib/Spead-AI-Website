import { readItems } from '@directus/sdk';
import directus, { DIRECTUS_URL } from '@/lib/directus';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import BlogArticleLayout from './BlogArticleLayout';

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return {};

    // Parse tags safely (handle both string[] and object structures)
    const rawTags = post.tags || [];
    const keywords = rawTags.map((t: any) => typeof t === 'string' ? t : t.tag || t.keyword || '').filter((t: string) => t);

    return {
        title: post.seo_title || post.title,
        description: post.seo_description || post.content?.substring(0, 160),
        keywords: keywords,
        openGraph: {
            title: post.seo_title || post.title,
            description: post.seo_description || post.content?.substring(0, 160),
            images: post.image ? [`${DIRECTUS_URL}/assets/${post.image}`] : [],
            type: 'article',
            publishedTime: post.published_date,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.seo_title || post.title,
            description: post.seo_description || post.content?.substring(0, 160),
        },
        alternates: {
            canonical: post.canonical_url || `https://spead.ai/blog/${post.slug}`,
        },
    };
}

async function getPost(slug: string) {
    try {
        const posts = await directus.request(
            readItems('blogs', {
                filter: {
                    slug: { _eq: slug },
                    status: { _eq: 'published' },
                },
                limit: 1,
                fields: [
                    'id',
                    'title',
                    'content',
                    'published_date',
                    'image',
                    'seo_title',
                    'seo_description',
                    { category: ['name', 'slug', 'color'] },
                    { author: ['id', 'name', 'role', 'avatar'] },
                    'slug',
                    'key_takeaways',
                    'tags',
                    'canonical_url',
                    'is_featured',
                    'read_time'
                ],
            } as any)
        );
        return posts[0] as any;
    } catch (error: any) {
        console.error('Error fetching blog post:', error?.errors || error);
        return null;
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const post = await getPost(decodedSlug);

    if (!post) {
        notFound();
    }

    // Parse tags safely
    const rawTags = post.tags || [];
    const keywords = rawTags.map((t: any) => typeof t === 'string' ? t : t.tag || t.keyword || '').filter((t: string) => t);

    // JSON-LD Structured Data
    const authorName = post.author?.name || 'Spead AI Team';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.seo_title || post.title,
        description: post.seo_description || post.content?.substring(0, 160),
        keywords: keywords.join(', '),
        abstract: post.key_takeaways || post.seo_description || '',
        image: post.image ? [`${DIRECTUS_URL}/assets/${post.image}`] : [],
        datePublished: post.published_date,
        author: {
            '@type': 'Person',
            name: authorName,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Spead AI',
            url: 'https://spead.ai',
        },
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <BlogArticleLayout post={post} />
        </>
    );
}
