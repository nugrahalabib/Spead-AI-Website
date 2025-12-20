'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Satellite, Radio, ArrowRight, ArrowUpRight, Filter, Zap, Globe, ShieldAlert, Sparkles } from 'lucide-react';
import { DIRECTUS_URL } from '@/lib/directus';

// --- Types ---
export interface NewsPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    date: string;
    image: string;
    category: string;
    color: string;
    gradient: string;
    featured: boolean;
    readTime?: number;
    author?: string;
    tags?: string[];
}

// Settings from Directus news_page_settings
export interface NewsPageSettings {
    hero_badge?: string;
    hero_title?: string;
    hero_subtitle?: string;
    featured_badge_text?: string;
    latest_badge_text?: string;
    newsletter_enabled?: string;
    newsletter_title?: string;
    newsletter_subtitle?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: any[];
    og_title?: string;
    og_description?: string;
    og_image?: string;
    twitter_card?: string;
    canonical_url?: string;
    robots?: string;
}

const CategoryBadge = ({ category, color }: { category: string; color: string }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 ${color} text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm z-10 relative`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {category}
    </span>
);

// Helper to normalize category for filtering
const normalizeCategory = (cat: string): string => {
    const lower = cat.toLowerCase();
    if (lower.includes('update') || lower.includes('product')) return 'update';
    if (lower.includes('press') || lower.includes('release')) return 'press';
    if (lower.includes('event')) return 'event';
    if (lower.includes('alert') || lower.includes('security')) return 'alert';
    if (lower.includes('engineering')) return 'engineering';
    return 'other';
};

// Helper to get icon based on category
const getCategoryIcon = (category: string) => {
    const type = normalizeCategory(category);
    switch (type) {
        case 'update': return <Zap size={14} className="text-emerald-400" />;
        case 'press': return <Globe size={14} className="text-blue-400" />;
        case 'alert': return <ShieldAlert size={14} className="text-red-400" />;
        case 'event': return <Sparkles size={14} className="text-purple-400" />;
        default: return <Zap size={14} className="text-cyan-400" />;
    }
};

// Newsletter Section Component
const NewsletterSection = ({ settings }: { settings: NewsPageSettings }) => {
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
                body: JSON.stringify({ email, source: 'news', subscribed_to: ['news'] }),
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
        <section className="relative border-t border-white/5 bg-[#020617] overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-xl">
                    <h2 className="text-4xl font-bold mb-4 font-[family-name:var(--font-display)] tracking-tight">
                        {settings.newsletter_title || "Don't miss a beat."}
                    </h2>
                    <p className="text-slate-400 text-lg">
                        {settings.newsletter_subtitle || 'Join 15,000+ enterprise leaders in the intelligence stream. No noise, just signal.'}
                    </p>
                </div>

                <div className="w-full md:w-auto flex-1 max-w-md">
                    {status === 'success' ? (
                        <div className="h-16 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                            {message}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative flex items-center group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="work@company.com"
                                required
                                className="w-full h-16 pl-8 pr-36 rounded-full bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all font-medium"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="absolute right-1.5 top-1.5 bottom-1.5 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                    )}
                    {status === 'error' && (
                        <p className="mt-2 text-red-400 text-sm text-center">{message}</p>
                    )}
                    <div className="mt-4 flex items-center gap-6 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><ShieldAlert size={14} className="text-indigo-400" /> End-to-End Encrypted</span>
                        <span className="flex items-center gap-1.5"><Zap size={14} className="text-indigo-400" /> Weekly Updates</span>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default function NewsClient({ posts, categories = [], settings = {} }: { posts: NewsPost[], categories?: string[], settings?: NewsPageSettings }) {
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [yearFilter, setYearFilter] = useState<string>('All');

    // Get featured post (is_featured = true) or fallback to first post
    const featuredPost = posts.find(p => p.featured) || posts[0];

    // Use categories from props (all from Directus) - fallback to extracting from posts
    const categoryFilters = categories.length > 0
        ? ['All', ...categories]
        : ['All', ...Array.from(new Set(posts.map(p => p.category))).filter(Boolean)];

    // Generate unique years from posts data
    const uniqueYears = Array.from(new Set(posts.map(p => {
        const match = p.date.match(/\d{4}/);
        return match ? match[0] : null;
    }))).filter(Boolean).sort((a, b) => Number(b) - Number(a)) as string[];
    const yearOptions = ['All', ...uniqueYears];

    // Filtering Logic - works with new Directus category names
    const filteredNews = posts.filter(item => {
        // Category filter
        const matchesCategory = activeFilter === 'All'
            ? true
            : item.category.toLowerCase().includes(activeFilter.toLowerCase());

        // Year filter
        const itemYear = item.date.match(/\d{4}/)?.[0];
        const matchesYear = yearFilter === 'All' ? true : itemYear === yearFilter;

        // Search filter
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

        return matchesCategory && matchesYear && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-hidden relative">

            {/* 1. BACKGROUND UPGRADE: LIVING FLOOR */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Grid Floor */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                {/* Floating Orbs */}
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/20 blur-[100px] rounded-full opacity-30"
                />
                <motion.div
                    animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-900/20 blur-[100px] rounded-full opacity-20"
                />
            </div>

            <div className="relative z-10">

                {/* 2. HERO SECTION UPGRADE */}
                <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12 items-center">
                        {/* Left: Text */}
                        <div className="lg:col-span-3 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
                            >
                                <Radio size={12} className="animate-pulse" /> {settings.hero_badge || 'Live Intelligence Feed'}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-7xl md:text-8xl font-bold tracking-tighter font-[family-name:var(--font-display)]"
                            >
                                {(settings.hero_title || 'Spead Newsroom.').split(' ').slice(0, 1)} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">{(settings.hero_title || 'Spead Newsroom.').split(' ').slice(1).join(' ') || 'Newsroom.'}</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl text-slate-400 max-w-xl leading-relaxed font-light"
                            >
                                {(settings.hero_subtitle || 'The frontier of Enterprise AI.\nUpdates from the Neural Operating System.').split('\n').map((line, i) => (
                                    <span key={i}>{line}{i === 0 && <br />}</span>
                                ))}
                            </motion.p>
                        </div>

                        {/* Right: Featured Card - Now Dynamic! */}
                        {featuredPost && (
                            <Link href={`/news/${featuredPost.slug}`} className="lg:col-span-2 block">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="group relative h-[400px] md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-[#0f172a] hover:border-indigo-500/50 hover:shadow-[0_0_50px_rgba(99,102,241,0.2)] transition-all duration-500 cursor-pointer"
                                >
                                    {/* Background Image or Gradient */}
                                    {featuredPost.image ? (
                                        <img
                                            src={featuredPost.image}
                                            alt={featuredPost.title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#020617] to-pink-900/40 group-hover:scale-110 transition-transform duration-1000" />
                                    )}

                                    {/* Abstract Shapes */}
                                    <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white/5 rounded-full group-hover:border-white/20 transition-colors duration-500" />
                                    <div className="absolute bottom-1/2 left-10 w-24 h-24 border border-indigo-500/30 rounded-full group-hover:scale-150 transition-transform duration-700 delay-100" />

                                    <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1.5 bg-red-600 text-white text-[11px] font-bold tracking-widest uppercase rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse">
                                                {featuredPost.featured ? (settings.featured_badge_text || 'Featured') : (settings.latest_badge_text || 'Latest')}
                                            </span>
                                            <span className="text-slate-300 text-sm font-mono">{featuredPost.date}</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 group-hover:text-indigo-300 transition-colors line-clamp-3">
                                            {featuredPost.title}
                                        </h3>
                                        {featuredPost.excerpt && (
                                            <p className="text-slate-400 text-sm mb-4 line-clamp-2 hidden md:block">
                                                {featuredPost.excerpt}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/80 group-hover:text-white group-hover:gap-4 transition-all">
                                            Read Story <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        )}
                    </div>
                </section>

                {/* 3. CONTROL DECK WITH FILTERS */}
                <section className="sticky top-0 z-40 w-full border-y border-white/5 bg-[#020617]/80 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px] max-w-sm relative group">
                            <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent pl-8 pr-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none border-b border-white/10 group-focus-within:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Category Filter Tabs - Dynamic */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            {categoryFilters.map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeFilter === filter
                                        ? 'text-white'
                                        : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {activeFilter === filter && (
                                        <motion.div
                                            layoutId="activeFilter"
                                            className="absolute inset-0 bg-white/10 border border-white/10 rounded-full"
                                        />
                                    )}
                                    <span className="relative z-10">{filter}</span>
                                </button>
                            ))}
                        </div>

                        {/* Year Filter Dropdown */}
                        <div className="relative">
                            <select
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-8 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                            >
                                {yearOptions.map(year => (
                                    <option key={year} value={year} className="bg-slate-900 text-white">
                                        {year === 'All' ? 'All Years' : year}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. NEWS GRID UPGRADE: THUMBNAILS & HOVER */}
                <section className="px-6 py-20 max-w-7xl mx-auto min-h-[60vh]">

                    {filteredNews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                            {filteredNews.map((item, idx) => (
                                <Link href={`/news/${item.slug || item.id}`} key={item.id} className={`${item.featured ? 'md:col-span-2' : ''} block h-full`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`group relative flex flex-col h-full rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/30 overflow-hidden transition-all duration-500 hover:-translate-y-2`}
                                    >
                                        {/* THUMBNAIL AREA (ABSTRACT GEOMETRY) */}
                                        <div className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${item.gradient}`}>
                                            {/* Abstract Tech Patterns */}
                                            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0b101d] to-transparent" />

                                            {/* Render Image if exists, else gradient */}
                                            {item.image && (
                                                <img
                                                    src={item.image.startsWith('http') ? item.image : `${DIRECTUS_URL}/assets/${item.image}`}
                                                    alt={item.title}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay group-hover:opacity-70 transition-opacity"
                                                />
                                            )}

                                            {/* Floating elements inside thumbnail */}
                                            <div className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                                                {getCategoryIcon(item.category)}
                                            </div>
                                        </div>

                                        <div className="flex-1 p-8 flex flex-col bg-[#0b101d]">
                                            <div className="flex items-center justify-between mb-4">
                                                <CategoryBadge category={item.category} color={item.color} />
                                                <span className="text-slate-500 text-xs font-mono">{item.date}</span>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-300 transition-all duration-300">
                                                {item.title}
                                            </h3>

                                            <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
                                                {item.excerpt}
                                            </p>

                                            {/* Author */}
                                            {item.author && (
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                                                        {item.author.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-slate-400 text-xs">{item.author}</span>
                                                </div>
                                            )}

                                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Read Article</span>
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all transform group-hover:rotate-45">
                                                    <ArrowUpRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        // EMPTY STATE
                        <div className="flex flex-col items-center justify-center py-32 text-center opacity-80">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                                <Satellite size={64} className="relative text-red-400 animate-pulse-slow" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Signal Lost</h3>
                            <p className="text-slate-400 max-w-xs mx-auto mb-8">No intelligence found matching your current frequency parameters.</p>
                            <button
                                onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
                                className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors"
                            >
                                Reset Transmitters
                            </button>
                        </div>
                    )}

                </section>

                {/* 6. NEWSLETTER CTA WITH NOISE */}
                {settings.newsletter_enabled !== 'no' && (
                    <NewsletterSection settings={settings} />
                )}

            </div>
        </main>
    );
}
