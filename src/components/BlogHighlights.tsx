import Link from 'next/link';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { DIRECTUS_URL } from '@/lib/directus';

interface BlogHighlightsProps {
    headline: string;
    posts: any[]; // Using any for flexibility with the expanded M2M structure
}

export default function BlogHighlights({ headline, posts }: BlogHighlightsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="py-20 px-6 md:px-20 relative z-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-end justify-between mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)]">
                        {headline || "Latest Insights"}
                    </h2>
                    <Link
                        href="/blog"
                        className="hidden md:flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                    >
                        See More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {posts.map((item: any) => {
                        // Handle M2M structure: item.posts_id is the actual post object
                        const post = item.posts_id;
                        if (!post) return null;

                        return (
                            <Link
                                key={item.id}
                                href={`/blog/${post.slug}`}
                                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 flex flex-col h-full"
                            >
                                {/* Image */}
                                <div className="aspect-video w-full overflow-hidden bg-neutral-900">
                                    {post.image ? (
                                        <img
                                            src={`${DIRECTUS_URL}/assets/${post.image}`}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-700">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-3 text-xs text-neutral-400 mb-4 font-mono">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(post.published_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                        {post.category && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white">
                                                <Tag size={10} /> {post.category}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>

                                    <p className="text-neutral-400 text-sm line-clamp-3 mb-6 flex-grow">
                                        {post.seo_description || "Read this article to learn more..."}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm font-medium text-white group-hover:gap-3 transition-all">
                                        Read Article <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile See More */}
                <div className="md:hidden flex justify-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors"
                    >
                        See More Articles <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
