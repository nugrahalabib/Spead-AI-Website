'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Search, Tag, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlogList = ({ initialPosts = [], categories = [] }: { initialPosts: any[]; categories?: any[] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedYear, setSelectedYear] = useState('All');

    // Extract unique years from posts
    const years = useMemo(() => {
        const uniqueYears = new Set(initialPosts.map(post => new Date(post.published_date).getFullYear().toString()));
        return ['All', ...Array.from(uniqueYears).sort().reverse()];
    }, [initialPosts]);

    const filteredPosts = initialPosts.filter((post) => {
        // 1. Search
        const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.seo_description && post.seo_description?.toLowerCase().includes(searchQuery.toLowerCase()));

        // 2. Category
        const catName = post.category_id?.name || post.category;
        const matchesCategory = selectedCategory === 'All' || catName === selectedCategory;

        // 3. Year
        const matchesYear = selectedYear === 'All' || new Date(post.published_date).getFullYear().toString() === selectedYear;

        return matchesSearch && matchesCategory && matchesYear;
    });

    return (
        <div className="w-full">
            {/* Filters & Search */}
            <div className="mb-16 space-y-6 pointer-events-auto">
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all backdrop-blur-sm shadow-lg"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedCategory === 'All'
                                ? 'bg-white text-black border-white'
                                : 'bg-black/40 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedCategory === cat.name
                                    ? 'bg-white text-black border-white'
                                    : 'bg-black/40 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Year Filter */}
                    <div className="relative group">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="appearance-none bg-black/40 border border-white/10 text-neutral-400 rounded-full px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:border-white/30 hover:border-white/30 transition-all cursor-pointer"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year === "All" ? "All Years" : year}</option>
                            ))}
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pointer-events-auto">
                <AnimatePresence mode="popLayout">
                    {filteredPosts.map((post, index) => {
                        // Resolve Category Data
                        const catObject = typeof post.category_id === 'object' ? post.category_id : null;
                        const catName = catObject?.name || post.category;
                        const catColor = catObject?.color || '#a3a3a3';

                        return (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                layout
                            >
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="group relative flex flex-col h-full bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                                >
                                    {/* Image */}
                                    <div className="aspect-[4/3] w-full bg-neutral-900 relative overflow-hidden">
                                        {post.image ? (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${post.image}`}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                                                <span className="text-neutral-700 font-bold text-4xl">NL</span>
                                            </div>
                                        )}

                                        {/* Category Badge - Dynamic Styles */}
                                        {catName && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md"
                                                    style={{
                                                        color: catColor,
                                                        borderColor: `${catColor}4D`, // 30% opacity
                                                        backgroundColor: `${catColor}1A` // 10% opacity
                                                    }}
                                                >
                                                    {catName}
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-8 flex flex-col relative -mt-20">
                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4 font-mono tracking-wider uppercase">
                                            <Calendar size={12} />
                                            {new Date(post.published_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>

                                        <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-400 transition-colors leading-tight">
                                            {post.title}
                                        </h2>

                                        <p className="text-neutral-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                            {post.seo_description || "Read more about this topic..."}
                                        </p>

                                        {/* Tags */}
                                        {Array.isArray(post.tags) && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {post.tags.slice(0, 3).map((tag: string, i: number) => (
                                                    <span key={i} className="flex items-center gap-1 text-[10px] text-neutral-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                                                        <Tag size={10} /> {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-sm font-medium text-white group-hover:translate-x-1 transition-transform mt-auto pt-6 border-t border-white/5">
                                            Read Article <ArrowRight size={16} className="text-indigo-500" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm pointer-events-auto">
                    <p className="text-neutral-500">No posts found matching your criteria.</p>
                    <button
                        onClick={() => { setSearchQuery(""); setSelectedYear("All"); setSelectedCategory("All"); }}
                        className="mt-4 text-white underline underline-offset-4 hover:text-neutral-300"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default BlogList;

