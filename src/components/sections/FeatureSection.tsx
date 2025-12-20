'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FeatureSection = () => {
    return (
        <section id="feature-section" className="relative py-32 px-6 z-10 bg-[#F8FAFC] dark:bg-transparent transition-colors duration-500">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Floating 3D Cards */}
                <div className="relative h-[600px] w-full">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-400/20 dark:bg-violet-600/20 blur-[120px] rounded-full" />

                    {/* Card 1 (Back Left) */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 left-0 w-64 h-80 glass-card bg-white/40 dark:bg-gradient-to-br dark:from-white/10 dark:to-white/0 border border-slate-200 dark:border-white/10 overflow-hidden transform -rotate-12 hover:rotate-0 transition-transform shadow-xl dark:shadow-none"
                    >
                        <div className="h-full w-full bg-indigo-50/50 dark:bg-indigo-900/50 flex items-center justify-center">
                            <span className="text-5xl">🤖</span>
                        </div>
                    </motion.div>

                    {/* Card 2 (Front Center) */}
                    <motion.div
                        className="absolute top-40 left-1/2 -translate-x-1/2 w-72 h-96 glass-card bg-white/60 dark:bg-gradient-to-br dark:from-white/15 dark:to-white/5 border border-slate-200 dark:border-white/20 overflow-hidden shadow-2xl z-20"
                    >
                        <div className="h-2/3 bg-gradient-to-b from-cyan-100 to-violet-100 dark:from-cyan-500/20 dark:to-violet-500/20 relative group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-400 to-violet-500 blur-md animate-pulse opacity-50 dark:opacity-100" />
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="h-2 w-16 bg-slate-300 dark:bg-white/20 rounded mb-2" />
                            <div className="h-2 w-24 bg-slate-200 dark:bg-white/10 rounded" />
                        </div>
                    </motion.div>

                    {/* Card 3 (Back Right) */}
                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-20 right-0 w-60 h-72 glass-card bg-white/40 dark:bg-gradient-to-br dark:from-white/10 dark:to-white/0 border border-slate-200 dark:border-white/10 overflow-hidden transform rotate-12 hover:rotate-0 transition-transform shadow-xl dark:shadow-none"
                    >
                        <div className="h-full w-full bg-violet-50/50 dark:bg-violet-900/50 flex items-center justify-center">
                            <span className="text-5xl">🧠</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Text Content */}
                <div>
                    <div className="inline-block px-4 py-1 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-neutral-300 mb-6">
                        About us
                    </div>
                    <h2 className="text-5xl font-bold font-[family-name:var(--font-outfit)] mb-8 leading-tight text-slate-900 dark:text-white">
                        High Quality <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-neutral-400">Knowledge Engines</span>
                    </h2>

                    <p className="text-slate-600 dark:text-neutral-400 text-lg leading-relaxed mb-8">
                        Spead AI is the premier platform for enterprise intelligence, transforming your scattered documents into a unified brain.
                    </p>

                    <p className="text-slate-500 dark:text-neutral-500 text-sm mb-10 leading-relaxed">
                        Deploy on your own infrastructure with total data sovereignty. No data leaves your perimeter without your explicit permission.
                    </p>

                    <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-violet-500/20 hover:scale-105 transition-all flex items-center gap-2">
                        More About Us <ArrowRight size={18} />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default FeatureSection;
