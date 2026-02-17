import { readItems } from '@directus/sdk';
import directus, { DIRECTUS_URL } from '@/lib/directus';
import BlogClient, { BlogPost, BlogPageSettings } from './BlogClient';
import { Metadata } from 'next';

// Revalidate every 60 seconds
export const revalidate = 60;

// Default settings fallback
const DEFAULT_SETTINGS: BlogPageSettings = {
    hero_badge: "Editor's Picks",
    hero_title: 'Spead Blog.',
    hero_subtitle: 'Deep dives into AI architecture.\nInsights from the frontier.',
    featured_badge_text: "Editor's Pick",
    latest_badge_text: 'Latest',
    newsletter_enabled: 'yes',
    newsletter_title: "Don't miss a beat.",
    newsletter_subtitle: 'Join 15,000+ enterprise leaders in the intelligence stream.',
};

// Fetch settings for metadata and page
async function getPageSettings(): Promise<BlogPageSettings> {
    try {
        const res = await fetch(`${DIRECTUS_URL}/items/blog_page_settings`, {
            next: { revalidate: 60 }
        });
        if (res.ok) {
            const { data } = await res.json();
            return { ...DEFAULT_SETTINGS, ...data };
        }
    } catch (error) {
        console.warn('Failed to fetch blog page settings:', error);
    }
    return DEFAULT_SETTINGS;
}

// Dynamic SEO Metadata from Directus
export async function generateMetadata(): Promise<Metadata> {
    const settings = await getPageSettings();

    const title = settings.seo_title || 'Blog | Spead AI - Insights on Enterprise AI';
    const description = settings.seo_description || 'Deep dives into AI architecture, autonomous systems, and the expertise economy.';
    const canonical = settings.canonical_url || 'https://spead.ai/blog';
    const keywords = settings.seo_keywords?.map((k: any) => typeof k === 'string' ? k : k.keyword) || ['AI Blog', 'Enterprise AI'];
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

// Helper for gradients
const getGradient = (index: number) => {
    const gradients = [
        'bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/40 via-purple-900/20 to-[#020617]',
        'bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-teal-500/40 via-emerald-900/20 to-[#020617]',
        'bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-slate-500/40 via-slate-800/20 to-[#020617]',
        'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/40 via-indigo-900/20 to-[#020617]',
        'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500/40 via-pink-900/20 to-[#020617]',
    ];
    return gradients[index % gradients.length];
};

export default async function BlogPage() {
    let posts: BlogPost[] = [];
    let allCategories: string[] = [];

    // 1. Fetch settings
    const settings = await getPageSettings();

    // 2. Fetch categories
    try {
        const categoriesData = await directus.request(
            readItems('blog_categories', {
                fields: ['name'],
                sort: ['sort'],
                limit: 50
            })
        );
        allCategories = categoriesData.map((c: any) => c.name).filter(Boolean);
    } catch (error) {
        console.warn('Failed to fetch blog categories:', error);
        allCategories = ['Architecture', 'Strategy', 'Design', 'Engineering', 'Ethics'];
    }

    // 3. Fetch blogs from Directus
    try {
        const directusPosts = await directus.request(
            readItems('blogs', {
                filter: { status: { _eq: 'published' } },
                sort: ['-published_date'],
                limit: 100,
                fields: [
                    'id', 'title', 'slug', 'published_date', 'image', 'excerpt',
                    'content', 'is_featured', 'read_time', 'tags',
                    { category: ['id', 'name', 'slug', 'color'] },
                    { author: ['id', 'name', 'role', 'avatar'] }
                ]
            })
        );

        if (directusPosts && directusPosts.length > 0) {
            posts = directusPosts.map((p: any, index: number) => {
                const categoryName = p.category?.name || 'General';
                const rawExcerpt = p.excerpt || p.content || '';
                const excerpt = rawExcerpt.length > 200
                    ? rawExcerpt.substring(0, 200).replace(/<[^>]*>/g, '') + '...'
                    : rawExcerpt.replace(/<[^>]*>/g, '');

                let imageUrl = '';
                if (p.image) {
                    imageUrl = typeof p.image === 'string'
                        ? (p.image.startsWith('http') ? p.image : `${DIRECTUS_URL}/assets/${p.image}`)
                        : `${DIRECTUS_URL}/assets/${p.image}`;
                }

                let avatarUrl = '';
                if (p.author?.avatar) {
                    avatarUrl = typeof p.author.avatar === 'string'
                        ? (p.author.avatar.startsWith('http') ? p.author.avatar : `${DIRECTUS_URL}/assets/${p.author.avatar}`)
                        : `${DIRECTUS_URL}/assets/${p.author.avatar}`;
                }

                return {
                    id: String(p.id),
                    slug: p.slug || String(p.id),
                    title: p.title,
                    excerpt,
                    date: new Date(p.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    image: imageUrl,
                    category: categoryName,
                    categoryColor: p.category?.color,
                    featured: p.is_featured === 'yes' || (index === 0 && !directusPosts.some((dp: any) => dp.is_featured === 'yes')),
                    readTime: p.read_time || 5,
                    author: {
                        name: p.author?.name || 'Spead AI Team',
                        role: p.author?.role,
                        avatar: avatarUrl || undefined,
                    },
                    meshGradient: getGradient(index),
                };
            });
        }
    } catch (error) {
        console.warn('Directus fetch failed:', error);
    }

    // Fallback mock data if no posts
    if (posts.length === 0) {
        posts = [
            {
                id: '1',
                slug: 'autonomous-agents',
                title: 'The End of Prompt Engineering: Why Autonomous Agents Are the New Code',
                excerpt: 'We are moving from chatting with AI to managing AI workforces. Here is the blueprint for the transition.',
                category: 'Architecture',
                readTime: 8,
                author: { name: 'Nugraha Labib', role: 'Editor in Chief' },
                date: 'Dec 15, 2025',
                featured: true,
                meshGradient: getGradient(0),
            },
            {
                id: '2',
                slug: 'designing-trust',
                title: 'Designing for Trust: The UX of "Black Box" Logic',
                excerpt: 'How to build user interfaces that expose the reasoning chains of AI without overwhelming the operator.',
                category: 'Design',
                readTime: 5,
                author: { name: 'Sarah Chen', role: 'Lead Architect' },
                date: 'Dec 12, 2025',
                featured: false,
                meshGradient: getGradient(1),
            },
            {
                id: '3',
                slug: 'cognitive-offloading',
                title: 'Cognitive Offloading: A New Framework for Enterprise Productivity',
                excerpt: 'Measuring the ROI of AI not just in time saved, but in mental energy preserved.',
                category: 'Strategy',
                readTime: 6,
                author: { name: 'David Park', role: 'AI Ethics' },
                date: 'Dec 10, 2025',
                featured: false,
                meshGradient: getGradient(2),
            },
        ];
    }

    return <BlogClient posts={posts} categories={allCategories} settings={settings} />;
}
