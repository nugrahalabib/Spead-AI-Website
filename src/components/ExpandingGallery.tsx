'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Users, Code, ArrowUpRight } from 'lucide-react';

const panels = [
    {
        id: 'builder',
        title: 'Tech Innovation',
        category: 'Founder of Spead AI',
        desc: 'Building autonomous AI systems. Spead AI (Selected for Google for Startups Cloud Program) & Shila Personal Assistant.',
        icon: Code,
        // Glassmorphism: Semi-transparent dark emerald
        color: 'from-emerald-900/60 to-teal-900/60',
        accent: 'text-emerald-400',
        visual: (
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 font-mono text-[10px] text-emerald-500/20 break-all p-4 leading-none select-none">
                    {Array(500).fill(0).map((_, i) => (i % 2 === 0 || i % 5 === 0) ? '1' : '0').join('')}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
            </div>
        ),
    },
    {
        id: 'creator',
        title: 'Digital Influence',
        category: 'Content Creator (@cuanincuy)',
        desc: 'Bridging tech & lifestyle for 140,000+ followers with 40M+ views. Official Shopee Affiliate & Brand Partner.',
        icon: Users,
        // Glassmorphism: Semi-transparent dark purple
        color: 'from-purple-900/60 to-fuchsia-900/60',
        accent: 'text-purple-400',
        visual: (
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent" />
            </div>
        ),
    },
    {
        id: 'strategist',
        title: 'Strategic Growth',
        category: 'Strategic Initiative Analyst',
        desc: 'Driving corporate vision execution at Caliana Indonesia. Previously managed national contracts at Waskita Karya (BUMN).',
        icon: Briefcase,
        // Glassmorphism: Semi-transparent dark slate
        color: 'from-slate-900/60 to-slate-800/60',
        accent: 'text-blue-400',
        visual: (
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/80" />
            </div>
        ),
    },
];

const ExpandingGallery = () => {
    const [activeId, setActiveId] = useState<string>('builder');

    return (
        <section className="px-6 md:px-20 py-20 z-10 relative">
            <div className="max-w-7xl mx-auto mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)]">The Trinity.</h2>
            </div>

            <div className="flex flex-col md:flex-row h-[700px] md:h-[600px] gap-2 w-full max-w-7xl mx-auto">
                {panels.map((panel) => {
                    const isActive = activeId === panel.id;
                    return (
                        <motion.div
                            key={panel.id}
                            layout
                            onClick={() => setActiveId(panel.id)}
                            onMouseEnter={() => setActiveId(panel.id)}
                            className={`
                relative overflow-hidden rounded-2xl cursor-pointer
                bg-gradient-to-b ${panel.color}
                backdrop-blur-xl border border-white/10 hover:border-white/20
                shadow-2xl shadow-black/20
              `}
                            animate={{
                                flex: isActive ? 4 : 1,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 150,
                                damping: 20,
                                mass: 1
                            }}
                        >
                            {/* Visual Layer */}
                            {panel.visual}

                            {/* Overlay for Idle State (Mystery) */}
                            <motion.div
                                className="absolute inset-0 bg-black/20" // Lighter overlay for glass effect
                                animate={{ opacity: isActive ? 0 : 1 }}
                            />

                            {/* Content Container */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">

                                {/* Top: Icon */}
                                <div className="flex justify-between items-start">
                                    <div className={`p-2 rounded-full bg-white/10 backdrop-blur-md ${panel.accent} border border-white/5`}>
                                        <panel.icon size={20} />
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <ArrowUpRight className="text-white" size={24} />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Bottom: Text Content */}
                                <div className="mt-auto relative">
                                    <AnimatePresence mode="wait">
                                        {isActive ? (
                                            <motion.div
                                                key="expanded"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                            >
                                                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${panel.accent}`}>
                                                    {panel.category}
                                                </p>
                                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 font-[family-name:var(--font-outfit)] leading-tight drop-shadow-lg">
                                                    {panel.title}
                                                </h3>
                                                <p className="text-gray-200 text-sm md:text-base max-w-md drop-shadow-md">
                                                    {panel.desc}
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="collapsed"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="hidden md:block absolute bottom-0 left-0 origin-bottom-left -rotate-90 translate-x-1"
                                            >
                                                <h3 className="text-xl font-bold text-white/60 whitespace-nowrap tracking-widest uppercase drop-shadow-md">
                                                    {panel.title}
                                                </h3>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="md:hidden">
                                        {!isActive && <h3 className="text-lg font-bold text-white/80">{panel.title}</h3>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default ExpandingGallery;
