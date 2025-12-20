'use client';

import { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Search, Clock, ArrowRight, BookOpen, Layers, Mail } from 'lucide-react';
import Link from 'next/link';

// --- Types ---
export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    categoryColor?: string;
    readTime: number;
    author: {
        name: string;
        role?: string;
        avatar?: string;
    };
    date: string;
    image?: string;
    featured: boolean;
    meshGradient: string;
}

export interface BlogPageSettings {
    hero_badge?: string;
    hero_title?: string;
    hero_subtitle?: string;
    featured_badge_text?: string;
    latest_badge_text?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: any[];
    canonical_url?: string;
    robots?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    twitter_card?: string;
    newsletter_enabled?: string;
    newsletter_title?: string;
    newsletter_subtitle?: string;
}

// --- Components ---
const TopicPill = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 rounded-full text-xs font-serif italic tracking-wide transition-all duration-300 border backdrop-blur-md ${active
            ? 'bg-white text-[#020617] border-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
            : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30 hover:text-slate-200 hover:bg-white/10'
            }`}
    >
        {label}
    </button>
);

// Gradient generator
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

// Avatar gradient by name
const getAvatarGradient = (name: string) => {
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const gradients = [
        'from-amber-400 to-orange-600',
        'from-blue-400 to-cyan-600',
        'from-emerald-400 to-teal-600',
        'from-purple-400 to-pink-600',
        'from-rose-400 to-red-600',
    ];
    return gradients[hash % gradients.length];
};

// Blog Newsletter Section Component
const BlogNewsletterSection = ({ title, subtitle }: { title: string; subtitle: string }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'blog', subscribed_to: ['blog'] }),
            });

            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setMessage('You\'re subscribed! 🎉');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to subscribe');
            }
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-teal-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-[#0a0f1e]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 lg:p-16 text-center">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none rounded-3xl" />

                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mx-auto mb-8">
                        <Mail size={28} className="text-white" />
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-serif font-medium mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                        {title}
                    </h2>

                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                        {subtitle}
                    </p>

                    {status === 'success' ? (
                        <div className="max-w-md mx-auto py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                            {message}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="flex-1 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-[#020617] font-bold uppercase tracking-wider hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                    )}

                    {status === 'error' && (
                        <p className="mt-4 text-red-400 text-sm">{message}</p>
                    )}

                    <p className="text-xs text-slate-500 mt-6">
                        No spam. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </section>
    );
};

interface BlogClientProps {
    posts: BlogPost[];
    categories?: string[];
    settings?: BlogPageSettings;
}

export default function BlogClient({ posts, categories = [], settings }: BlogClientProps) {
    const [activeTopic, setActiveTopic] = useState('All');
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Settings with defaults
    const heroBadge = settings?.hero_badge || "Editor's Picks";
    const heroTitle = settings?.hero_title || 'Spead Blog.';
    const heroSubtitle = settings?.hero_subtitle || 'Deep dives into AI architecture.\nInsights from the frontier.';
    const featuredBadgeText = settings?.featured_badge_text || "Editor's Pick";
    const latestBadgeText = settings?.latest_badge_text || 'Latest';
    const showNewsletter = settings?.newsletter_enabled !== 'no';
    const newsletterTitle = settings?.newsletter_title || "Don't miss a beat.";
    const newsletterSubtitle = settings?.newsletter_subtitle || 'Join 15,000+ enterprise leaders in the intelligence stream.';

    // Dynamic topics from categories
    const topics = ['All', ...categories];

    // Featured post (first one or is_featured)
    const featuredPost = posts.find(p => p.featured) || posts[0];

    // Filter posts
    const filteredPosts = posts.filter(post => {
        const matchesTopic = activeTopic === 'All' || post.category.toLowerCase() === activeTopic.toLowerCase();
        const matchesSearch = !searchQuery ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTopic && matchesSearch && post.id !== featuredPost?.id;
    });

    return (
        <main className="min-h-screen bg-[#020617] text-white selection:bg-teal-500/30 overflow-hidden font-sans relative">

            {/* READING PROGRESS BAR */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-orange-400 to-amber-200 origin-left z-[60]"
                style={{ scaleX }}
            />

            {/* BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-900/10 to-transparent blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-24">

                {/* HERO: FEATURED POST */}
                {featuredPost && (
                    <section className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-teal-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative grid lg:grid-cols-2 bg-[#0a0f1e]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                            {/* Visual Side */}
                            <div className="relative h-[400px] lg:h-auto bg-[#0a0f1e] overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay" />

                                {featuredPost.image ? (
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                                    />
                                ) : (
                                    <>
                                        <div className={`absolute inset-0 ${featuredPost.meshGradient || getGradient(0)}`} />
                                        <motion.div
                                            animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                            className="relative w-48 h-64"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl border border-white/20 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.05)] transform rotate-12" />
                                            <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent rounded-2xl border border-white/10 backdrop-blur-sm -rotate-6 scale-90" />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/30 blur-[40px] rounded-full animate-pulse" />
                                        </motion.div>
                                    </>
                                )}

                                <div className="absolute bottom-8 left-8 flex items-center gap-2 text-[10px] font-mono text-amber-200/60 uppercase tracking-widest border border-amber-500/20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                                    <Layers size={10} /> {featuredPost.featured ? featuredBadgeText : latestBadgeText}
                                </div>
                            </div>

                            {/* Editorial Side */}
                            <div className="p-8 lg:p-16 flex flex-col justify-center bg-[#0a0f1e] relative">
                                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none" />

                                <div className="flex items-center gap-4 mb-8 z-10">
                                    <span className="text-amber-200 text-xs font-bold tracking-[0.25em] uppercase drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                                        {featuredPost.featured ? featuredBadgeText : latestBadgeText}
                                    </span>
                                    <span className="h-px w-12 bg-amber-500/30" />
                                    <span className="text-slate-500 text-xs font-serif italic">{featuredPost.category}</span>
                                </div>

                                <h1 className="text-3xl lg:text-5xl font-serif font-medium leading-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 z-10">
                                    {featuredPost.title}
                                </h1>

                                <div className="flex items-center gap-4 mb-8 z-10">
                                    {featuredPost.author.avatar ? (
                                        <img
                                            src={featuredPost.author.avatar}
                                            alt={featuredPost.author.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30"
                                        />
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(featuredPost.author.name)} p-[1.5px] shadow-[0_0_15px_rgba(251,191,36,0.2)]`}>
                                            <div className="w-full h-full rounded-full bg-[#0a0f1e] flex items-center justify-center text-xs font-bold font-serif text-amber-100">
                                                {featuredPost.author.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-sm font-bold text-amber-100/90">{featuredPost.author.name}</div>
                                        <div className="text-xs text-slate-400">{featuredPost.author.role || 'Author'} • {featuredPost.readTime} Min Read</div>
                                    </div>
                                </div>

                                <p className="text-slate-400 leading-relaxed mb-8 border-l-2 border-amber-500/20 pl-6 italic max-w-lg z-10">
                                    "{featuredPost.excerpt}"
                                </p>

                                <Link href={`/blog/${featuredPost.slug}`} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-teal-400 hover:text-teal-300 transition-colors group/btn z-10">
                                    Read Article <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* FILTER BAR */}
                <section className="sticky top-24 z-50">
                    <div className="mx-auto max-w-5xl p-3 rounded-full bg-[#0a0f1e]/80 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2 flex-1">
                            {topics.map(topic => (
                                <TopicPill
                                    key={topic}
                                    label={topic}
                                    active={activeTopic === topic}
                                    onClick={() => setActiveTopic(topic)}
                                />
                            ))}
                        </div>

                        {/* Expandable Search */}
                        <div className={`flex items-center transition-all duration-300 ${searchOpen ? 'w-64 bg-white/5 pr-4 rounded-full border border-white/10' : 'w-10'}`}>
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            >
                                <Search size={18} />
                            </button>
                            {searchOpen && (
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search articles..."
                                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                                />
                            )}
                        </div>
                    </div>
                </section>

                {/* CONTENT GRID */}
                <section className="min-h-[60vh]">
                    <div className="flex items-center justify-center gap-4 mb-16 opacity-60">
                        <span className="h-px w-32 bg-gradient-to-r from-transparent to-amber-500/50" />
                        <span className="font-serif italic text-amber-500/80 text-lg">The Archives</span>
                        <span className="h-px w-32 bg-gradient-to-l from-transparent to-amber-500/50" />
                    </div>

                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[420px]">
                            {filteredPosts.map((post, idx) => (
                                <Link href={`/blog/${post.slug}`} key={post.id} className="block">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative flex flex-col h-full rounded-2xl bg-[#0a0f1e] border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-500 cursor-pointer"
                                    >
                                        {/* Noise Overlay */}
                                        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.04] pointer-events-none z-20" />

                                        {/* Cover Image/Gradient */}
                                        <div className={`relative w-full h-2/3 overflow-hidden ${post.meshGradient || getGradient(idx)} group-hover:scale-[1.02] transition-transform duration-700`}>
                                            {post.image && (
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                                            <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white shadow-lg">
                                                {post.category}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-8 flex flex-col relative bg-[#0a0f1e] z-10 border-t border-white/5">
                                            <div className="flex items-center gap-2 mb-4 text-xs text-slate-500 font-mono">
                                                <Clock size={12} className="text-amber-500/70" /> {post.readTime} min
                                                <span className="mx-2 text-white/10">•</span>
                                                {post.date}
                                            </div>

                                            <h3 className="text-xl font-serif font-medium leading-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-200 group-hover:to-indigo-300 transition-all duration-300 line-clamp-2">
                                                {post.title}
                                            </h3>

                                            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-6">
                                                {post.excerpt}
                                            </p>

                                            <div className="mt-auto flex items-center gap-3">
                                                {post.author.avatar ? (
                                                    <img
                                                        src={post.author.avatar}
                                                        alt={post.author.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(post.author.name)} p-[1px]`}>
                                                        <div className="w-full h-full rounded-full bg-[#0a0f1e] flex items-center justify-center text-xs font-bold font-serif text-white">
                                                            {post.author.name.charAt(0)}
                                                        </div>
                                                    </div>
                                                )}
                                                <span className="text-xs font-bold text-amber-100/70 uppercase tracking-wide">{post.author.name}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}

                            {/* Empty Space Filler */}
                            {filteredPosts.length < 5 && (
                                <div className="hidden lg:flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] text-center hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <BookOpen size={24} className="text-slate-600 group-hover:text-slate-400" />
                                    </div>
                                    <div className="font-serif italic text-slate-500 group-hover:text-slate-400 transition-colors">
                                        "More articles coming soon."
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <Search size={24} className="text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No articles found</h3>
                            <p className="text-slate-400 mb-6">Try adjusting your search or filter</p>
                            <button
                                onClick={() => { setActiveTopic('All'); setSearchQuery(''); }}
                                className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 text-sm"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </section>

                {/* NEWSLETTER SECTION */}
                {showNewsletter && (
                    <BlogNewsletterSection title={newsletterTitle} subtitle={newsletterSubtitle} />
                )}

            </div>
        </main>
    );
}
