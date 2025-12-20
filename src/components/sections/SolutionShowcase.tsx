'use client';

import { motion } from 'framer-motion';
import { FileText, Bot, Zap, Calendar, ArrowUpRight, Search, ShieldCheck, BarChart3, LucideIcon } from 'lucide-react';

interface Solution {
    id: number;
    title: string;
    description: string;
    icon: string;
    sort: number;
    className?: string; // Add optional className
}

interface SolutionShowcaseProps {
    solutions: Solution[];
}

const iconMap: Record<string, LucideIcon> = {
    'FileText': FileText,
    'Bot': Bot,
    'Zap': Zap,
    'Calendar': Calendar,
    'Search': Search,
    'ShieldCheck': ShieldCheck,
    'BarChart3': BarChart3
};

const SolutionShowcase = ({ solutions = [] }: SolutionShowcaseProps) => {
    // Enhanced Fallback data with size properties for Bento Grid
    const items = solutions.length > 0 ? solutions : [
        {
            id: 1,
            title: 'Builder Generator',
            description: 'Draft Audit Reports, Legal Contracts, or Proposals 87% faster with context-aware AI.',
            icon: 'FileText',
            className: "md:col-span-2 md:row-span-2", // Large Card
            sort: 1
        },
        {
            id: 2,
            title: 'Enterprise Search',
            description: 'Instant recall across all PDFs & Docs.',
            icon: 'Search',
            className: "md:col-span-1 md:row-span-1",
            sort: 2
        },
        {
            id: 3,
            title: 'Strategic Partner',
            description: 'Brainstorming aligned with company vision.',
            icon: 'Zap',
            className: "md:col-span-1 md:row-span-1",
            sort: 3
        },
        {
            id: 4,
            title: 'Daily Assistant',
            description: 'Automated scheduling & prioritization.',
            icon: 'Calendar',
            className: "md:col-span-2 md:row-span-1",
            sort: 4
        }
    ];

    return (
        <section className="py-24 px-4 md:px-0 bg-[#030014] relative overflow-hidden" id="solutions">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-3 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300 uppercase tracking-widest"
                    >
                        Features
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4 font-display tracking-tight"
                    >
                        Total <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Synchronicity.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-neutral-400 text-lg max-w-2xl mx-auto"
                    >
                        Replace your fragmented toolset with a unified intelligence layer.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 h-auto md:h-[650px]">
                    {items.map((item: any, i) => {
                        const IconComponent = iconMap[item.icon] || Zap;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className={`group relative p-6 rounded-3xl glass-card overflow-hidden flex flex-col justify-between ${item.className || "md:col-span-1"}`}
                            >
                                {/* Hover Gradient & Shimmer */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-shimmer" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-300 group-hover:text-white group-hover:bg-indigo-500 transition-all duration-300">
                                            <IconComponent size={24} />
                                        </div>
                                        {/* Corner Action */}
                                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <ArrowUpRight size={14} />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2 tracking-tight group-hover:text-indigo-100 transition-colors">{item.title}</h3>
                                        <p className="text-sm text-neutral-400 leading-relaxed font-light">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default SolutionShowcase;
