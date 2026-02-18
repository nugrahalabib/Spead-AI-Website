'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { Calendar, ArrowLeft, Share2, Clock, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { DIRECTUS_URL } from '@/lib/directus';
import { useState, useEffect } from 'react';

// --- Components ---
const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-50"
            style={{ scaleX }}
        />
    );
};

export default function ArticleLayout({ post }: { post: any }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-hidden font-[family-name:var(--font-outfit)]">
            <ScrollProgress />

            {/* 1. ANIMATED BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
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

            <main className="relative z-10 pt-32 pb-20 px-6 md:px-0">
                <div className="max-w-4xl mx-auto">

                    {/* Back Button */}
                    <Link href="/news" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium tracking-wide uppercase">Back to Intelligence</span>
                    </Link>

                    {/* HERO SECTION */}
                    <header className="mb-16">
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mb-6 uppercase tracking-wider">
                            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <Calendar size={12} />
                                {new Date(post.published_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <Clock size={12} />
                                5 MIN READ
                            </span>
                            {post.category && (
                                <span className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${post.category.color || 'text-indigo-400'}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                    {post.category.name || post.category}
                                </span>
                            )}
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold mb-8 leading-tight font-[family-name:var(--font-display)]"
                        >
                            {post.title}
                        </motion.h1>


                        {/* Feature Image with Parallax-like feel (static for now but styled) */}
                        {post.image && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10 group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 z-10" />
                                <img
                                    src={post.image.startsWith('http') ? post.image : `${DIRECTUS_URL}/assets/${post.image}`}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s]"
                                />
                                {/* Overlay Stats/Tech */}
                                <div className="absolute bottom-6 left-6 z-20 flex gap-4">
                                    <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-mono text-white/80">
                                        <ShieldCheck size={14} className="text-emerald-400" /> VERIFIED SOURCE
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </header>

                    {/* EXECUTIVE SUMMARY */}
                    {post.key_takeaways && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/20 via-slate-900/40 to-slate-900/20 border border-indigo-500/20 p-8 md:p-10"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <Cpu size={120} className="text-indigo-500" />
                            </div>
                            <h3 className="relative z-10 text-xs font-bold text-indigo-400 mb-6 uppercase tracking-[0.2em] font-mono flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                Executive Summary
                            </h3>
                            <div className="relative z-10 text-slate-200 prose prose-invert prose-p:leading-relaxed prose-li:marker:text-indigo-500">
                                <MarkdownRenderer content={post.key_takeaways} />
                            </div>
                        </motion.div>
                    )}

                    {/* MAIN CONTENT */}
                    <motion.article
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="prose prose-xl prose-invert max-w-none 
                        prose-headings:font-bold prose-headings:font-[family-name:var(--font-display)] prose-headings:text-white 
                        prose-p:text-slate-400 prose-p:leading-8 prose-p:font-light
                        prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300 prose-a:border-b prose-a:border-indigo-500/30 hover:prose-a:border-indigo-500
                        prose-strong:text-white prose-strong:font-semibold
                        prose-blockquote:border-l-indigo-500 prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                        prose-li:marker:text-slate-600 prose-img:rounded-2xl prose-img:border prose-img:border-white/10"
                    >
                        <MarkdownRenderer content={post.content} />
                    </motion.article>

                    {/* FOOTER / SHARE */}
                    <div className="mt-20 pt-10 border-t border-white/10">
                        {/* Author - compact */}
                        {post.author && (
                            <div className="flex items-center gap-3 mb-6">
                                {post.author.avatar ? (
                                    <img
                                        src={`${DIRECTUS_URL}/assets/${post.author.avatar}`}
                                        alt={post.author.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                        {(post.author.name || 'A').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="text-slate-400 text-sm">
                                    <span className="text-white">{post.author.name}</span>
                                    {post.author.role && <span> · {post.author.role}</span>}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="text-slate-500 text-sm font-mono">
                                // END OF TRANSMISSION
                            </div>
                            <div className="flex gap-4">
                                <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-indigo-400 transition-colors">
                                    <Share2 size={18} />
                                </button>
                                <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-indigo-400 transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
