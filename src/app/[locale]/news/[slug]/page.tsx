import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import ArticleLayout from './ArticleLayout';
import { NEWS_ITEMS } from '@/lib/mock-news';
import directus, { DIRECTUS_URL } from '@/lib/directus';
import { readItems } from '@directus/sdk';

// Revalidate every 60 seconds - auto-updates when Directus changes
export const revalidate = 60;

// Retrieve post from Directus or Mock Data
async function getPost(slug: string) {
    let post = null;

    // 1. Try fetching from Directus
    try {
        const posts = await directus.request(
            readItems('posts', {
                filter: {
                    slug: { _eq: slug },
                    status: { _eq: 'published' },
                },
                limit: 1,
                fields: [
                    // Core fields
                    'id', 'title', 'slug', 'status', 'published_date', 'date_updated',
                    'excerpt', 'content', 'key_takeaways', 'image', 'read_time',
                    'is_featured', 'tags',
                    // SEO fields
                    'seo_title', 'seo_description', 'canonical_url',
                    // Relations
                    { category: ['id', 'name', 'slug', 'color', 'icon'] },
                    { author: ['id', 'name', 'slug', 'role', 'bio', 'avatar', 'email'] }
                ],
            })
        );

        if (posts && posts.length > 0) {
            post = posts[0];

            // Normalize Tags from JSON array of objects [{tag: "value"}] to string array
            const normalizedTags = post.tags?.map((t: any) =>
                typeof t === 'string' ? t : t.tag
            ).filter(Boolean) || [];

            // Build image URL
            let imageUrl = '';
            if (post.image) {
                imageUrl = post.image.startsWith('http') ? post.image : `${DIRECTUS_URL}/assets/${post.image}`;
            }

            // Build author avatar URL
            let authorAvatar = '';
            if (post.author?.avatar) {
                authorAvatar = post.author.avatar.startsWith('http')
                    ? post.author.avatar
                    : `${DIRECTUS_URL}/assets/${post.author.avatar}`;
            }

            post = {
                ...post,
                tags: normalizedTags,
                image: imageUrl,
                is_featured: post.is_featured === 'yes',
                author: post.author ? {
                    ...post.author,
                    avatar: authorAvatar
                } : null
            };
        }
    } catch (error) {
        console.warn('Directus Detail Fetch Failed, falling back to mock:', slug, error);
    }

    // 2. Fallback to Mock Data if Directus failed or returned nothing
    if (!post) {
        const mockItem = NEWS_ITEMS.find(item => item.slug === slug || item.id === slug);
        if (mockItem) {
            post = {
                ...mockItem,
                id: mockItem.id,
                slug: mockItem.slug,
                image: mockItem.image || '',
                tags: mockItem.tags || [],
                author: mockItem.author || { name: 'Spead AI Team', role: 'Editor', avatar: '' },
                key_takeaways: mockItem.key_takeaways || mockItem.excerpt,
                content: mockItem.content || mockItem.excerpt,
                published_date: new Date().toISOString(),
                date_updated: new Date().toISOString(),
                is_featured: false,
                category: { name: mockItem.category, color: mockItem.color }
            };
        }
    }

    return post as any;
}

// Generate Metadata for SEO - Complete with all Google requirements
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return {};

    const keywords = post.tags || [];
    const imageUrl = post.image || `${DIRECTUS_URL}/assets/og-default.jpg`;
    const description = post.seo_description || post.excerpt || post.key_takeaways || post.content?.substring(0, 160).replace(/<[^>]*>/g, '');

    return {
        title: post.seo_title || post.title,
        description: description,
        keywords: keywords,
        authors: [{ name: post.author?.name || 'Spead AI' }],
        openGraph: {
            title: post.seo_title || post.title,
            description: description,
            images: [{
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: post.title
            }],
            type: 'article',
            publishedTime: post.published_date,
            modifiedTime: post.date_updated || post.published_date,
            authors: [post.author?.name || 'Spead AI'],
            section: post.category?.name || 'News',
            tags: keywords,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.seo_title || post.title,
            description: description,
            images: [imageUrl],
            creator: '@SpeadAI',
        },
        alternates: {
            canonical: post.canonical_url || `https://spead.ai/news/${post.slug}`,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

// Generate Static Paths for better SEO (optional but recommended)
export async function generateStaticParams() {
    try {
        const posts = await directus.request(
            readItems('posts', {
                filter: { status: { _eq: 'published' } },
                fields: ['slug'],
                limit: 100
            })
        );
        return posts.map((post: any) => ({ slug: post.slug }));
    } catch {
        return NEWS_ITEMS.map(item => ({ slug: item.slug }));
    }
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = await getPost(decodedSlug);

    if (!post) {
        notFound();
    }

    // Construct JSON-LD Structured Data for Google/AI Indexing
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: post.seo_title || post.title,
        description: post.seo_description || post.excerpt || post.content?.substring(0, 160).replace(/<[^>]*>/g, ''),
        keywords: (post.tags || []).join(', '),
        image: post.image ? {
            '@type': 'ImageObject',
            url: post.image,
            width: 1200,
            height: 630
        } : undefined,
        datePublished: post.published_date,
        dateModified: post.date_updated || post.published_date,
        author: {
            '@type': 'Person',
            name: post.author?.name || 'Spead AI Team',
            jobTitle: post.author?.role || 'Editor',
            url: post.author?.slug ? `https://spead.ai/team/${post.author.slug}` : undefined
        },
        publisher: {
            '@type': 'Organization',
            name: 'Spead AI',
            url: 'https://spead.ai',
            logo: {
                '@type': 'ImageObject',
                url: 'https://spead.ai/logo.png',
                width: 512,
                height: 512
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': post.canonical_url || `https://spead.ai/news/${post.slug}`
        },
        articleSection: post.category?.name || 'News',
        wordCount: post.content ? post.content.split(/\s+/).length : 0,
        inLanguage: 'en-US',
        isAccessibleForFree: true,
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['article', 'h1', '.summary']
        }
    };

    // BreadcrumbList for better navigation in Google
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://spead.ai'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'News',
                item: 'https://spead.ai/news'
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://spead.ai/news/${post.slug}`
            }
        ]
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbLd} />
            <ArticleLayout post={post} />
        </>
    );
}
