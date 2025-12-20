import { readItems, readSingleton } from '@directus/sdk';
import directus, { DIRECTUS_URL } from '@/lib/directus';
import NewsClient, { NewsPost, NewsPageSettings } from './NewsClient';
import { NEWS_ITEMS } from '@/lib/mock-news';
import { Metadata } from 'next';

// Revalidate every 60 seconds - auto-updates when Directus changes
export const revalidate = 60;

// Default settings fallback
const DEFAULT_SETTINGS: NewsPageSettings = {
    hero_badge: 'Live Intelligence Feed',
    hero_title: 'Spead Newsroom.',
    hero_subtitle: 'The frontier of Enterprise AI.\nUpdates from the Neural Operating System.',
    featured_badge_text: 'Featured',
    latest_badge_text: 'Latest',
    newsletter_enabled: 'yes',
    newsletter_title: "Don't miss a beat.",
    newsletter_subtitle: 'Join 15,000+ enterprise leaders in the intelligence stream. No noise, just signal.',
};

// Fetch settings for metadata and page
async function getPageSettings(): Promise<NewsPageSettings> {
    try {
        const res = await fetch(`${DIRECTUS_URL}/items/news_page_settings`, {
            next: { revalidate: 60 }
        });
        if (res.ok) {
            const { data } = await res.json();
            return { ...DEFAULT_SETTINGS, ...data };
        }
    } catch (error) {
        console.warn('Failed to fetch page settings:', error);
    }
    return DEFAULT_SETTINGS;
}

// Dynamic SEO Metadata from Directus
export async function generateMetadata(): Promise<Metadata> {
    const settings = await getPageSettings();

    const title = settings.seo_title || 'Newsroom | Spead AI - Latest Enterprise AI Updates';
    const description = settings.seo_description || 'Stay updated with the latest news on Enterprise AI.';
    const canonical = settings.canonical_url || 'https://spead.ai/news';
    const keywords = settings.seo_keywords?.map((k: any) => typeof k === 'string' ? k : k.keyword) || ['Enterprise AI', 'AI News'];
    const ogImage = settings.og_image ? `${DIRECTUS_URL}/assets/${settings.og_image}` : undefined;

    return {
        title,
        description,
        keywords,
        openGraph: {
            title: settings.og_title || title,
            description: settings.og_description || description,
            type: 'website',
            url: canonical,
            ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
        },
        twitter: {
            card: (settings.twitter_card as any) || 'summary_large_image',
            title: settings.og_title || title,
            description: settings.og_description || description,
            ...(ogImage && { images: [ogImage] }),
        },
        alternates: {
            canonical,
        },
        robots: settings.robots === 'noindex, nofollow'
            ? { index: false, follow: false }
            : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const } },
    };
}

// Helper to calculate gradients
const getGradient = (index: number) => {
    const gradients = [
        'from-purple-900/40 via-[#020617] to-pink-900/40',
        'from-blue-900/40 via-[#020617] to-cyan-900/40',
        'from-emerald-900/40 via-[#020617] to-teal-900/40',
        'from-orange-900/40 via-[#020617] to-red-900/40',
    ];
    return gradients[index % gradients.length];
};

// Helper to get color classes
const getColorClasses = (color: string | null) => {
    if (!color) return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10';
    const match = color.match(/text-(\w+)-\d+/);
    if (match) {
        const colorName = match[1];
        return `${color} border-${colorName}-500/20 bg-${colorName}-500/10`;
    }
    return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10';
};

export default async function NewsPage() {
    let posts: NewsPost[] = [];
    let allCategories: string[] = [];

    // 1. Fetch page settings
    const settings = await getPageSettings();

    // 2. Fetch ALL categories from Directus
    try {
        const categoriesData = await directus.request(
            readItems('categories', {
                fields: ['name'],
                limit: 50
            })
        );
        allCategories = categoriesData.map((c: any) => c.name).filter(Boolean);
    } catch (error) {
        console.warn('Failed to fetch categories:', error);
        allCategories = ['Press Release', 'Product Update', 'Security Alert', 'Events', 'Engineering'];
    }

    // 3. Fetch posts from Directus
    try {
        const directusPosts = await directus.request(
            readItems('posts', {
                filter: { status: { _eq: 'published' } },
                sort: ['-published_date'],
                limit: 100,
                fields: [
                    'id', 'title', 'slug', 'published_date', 'image', 'excerpt',
                    'content', 'is_featured', 'read_time', 'tags',
                    { category: ['id', 'name', 'slug', 'color', 'icon'] },
                    { author: ['id', 'name', 'role', 'avatar'] }
                ]
            })
        );

        if (directusPosts && directusPosts.length > 0) {
            posts = directusPosts.map((p: any, index: number) => {
                const categoryName = p.category?.name || 'Update';
                const rawExcerpt = p.excerpt || p.content || '';
                const excerpt = rawExcerpt.length > 150
                    ? rawExcerpt.substring(0, 150).replace(/<[^>]*>/g, '') + '...'
                    : rawExcerpt.replace(/<[^>]*>/g, '');

                let imageUrl = '';
                if (p.image) {
                    imageUrl = typeof p.image === 'string'
                        ? (p.image.startsWith('http') ? p.image : `${DIRECTUS_URL}/assets/${p.image}`)
                        : `${DIRECTUS_URL}/assets/${p.image}`;
                }

                const tags = p.tags?.map((t: any) => typeof t === 'string' ? t : t.tag).filter(Boolean) || [];

                return {
                    id: String(p.id),
                    title: p.title,
                    slug: p.slug,
                    excerpt,
                    date: new Date(p.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    image: imageUrl,
                    category: categoryName,
                    color: getColorClasses(p.category?.color),
                    gradient: getGradient(index),
                    featured: p.is_featured === 'yes' || (index === 0 && !directusPosts.some((dp: any) => dp.is_featured === 'yes')),
                    readTime: p.read_time || 5,
                    author: p.author?.name || 'Spead AI Team',
                    tags,
                };
            });
        }
    } catch (error) {
        console.warn('Directus fetch failed, using mock data:', error);
        posts = NEWS_ITEMS.map((item, index) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt,
            date: item.date,
            image: item.image || '',
            category: item.category,
            color: item.color,
            gradient: getGradient(index),
            featured: index === 0,
            readTime: 5,
            author: item.author?.name || 'Spead AI Team',
            tags: item.tags || [],
        }));
    }

    // Fallback if no posts
    if (posts.length === 0) {
        posts = NEWS_ITEMS.map((item, index) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt,
            date: item.date,
            image: item.image || '',
            category: item.category,
            color: item.color,
            gradient: getGradient(index),
            featured: index === 0,
            readTime: 5,
            author: item.author?.name || 'Spead AI Team',
            tags: item.tags || [],
        }));
    }

    return <NewsClient posts={posts} categories={allCategories} settings={settings} />;
}
