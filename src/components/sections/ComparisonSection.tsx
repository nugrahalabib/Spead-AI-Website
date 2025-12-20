'use client';

import { motion } from 'framer-motion';
import { Brain, Globe, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface ComparisonSectionProps {
    data: {
        comparison_headline?: string;
        comparison_left_title?: string;
        comparison_left_text?: string;
        comparison_right_title?: string;
        comparison_right_text?: string;
    };
}

const ComparisonSection = ({ data }: ComparisonSectionProps) => {
    return (
        <section className="py-24 px-4 md:px-0 bg-[#F8FAFC] dark:bg-[#030014] relative overflow-hidden transition-colors duration-500">
            {/* Gradient Ambience */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-indigo-100/40 dark:bg-gradient-to-b dark:from-indigo-950/20 dark:to-transparent pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-3xl md:text-5xl font-bold text-center text-slate-900 dark:text-white mb-20 tracking-tighter font-display"
                >
                    {data?.comparison_headline || "Generic AI is Smart, But 'Blind' to Your Business Context."}
                </motion.h2>

                <div className="grid lg:grid-cols-2 gap-8 relative">

                    {/* Left: Generic AI (The 'Bad' Option) */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        className="relative p-10 rounded-3xl border border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden group shadow-lg dark:shadow-none"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] grayscale transition-opacity group-hover:opacity-[0.05]">
                            <Globe size={180} />
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-neutral-800/50 flex items-center justify-center border border-slate-200 dark:border-white/5">
                                <XCircle className="text-slate-400 dark:text-neutral-500" size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-500 dark:text-neutral-400 font-display tracking-tight">
                                {data?.comparison_left_title || "Generic Public AI"}
                            </h3>
                        </div>

                        <div className="space-y-4 mb-10">
                            {[
                                "Hallucinates facts & figures",
                                "Unaware of company SOPs",
                                "Data privacy risks"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-slate-500 dark:text-neutral-500 font-medium">
                                    <AlertTriangle size={18} className="text-red-500/50 dark:text-red-900/50" />
                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* Terminal UI - Fail State */}
                        <div className="p-5 bg-slate-50 dark:bg-[#050505] rounded-xl border border-slate-200 dark:border-white/[0.05] font-mono text-xs text-slate-500 dark:text-neutral-500 leading-relaxed relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 bg-red-500/30 dark:bg-red-900/20 h-full" />
                            <div className="flex flex-col gap-2">
                                <span className="opacity-50 text-slate-400 dark:text-neutral-400">&gt; INPUT: "Draft contract per Q3 rules..."</span>
                                <span className="text-red-600 dark:text-red-800/80 animate-pulse">ERROR: CONTEXT_NOT_FOUND.</span>
                                <span className="opacity-40">Resorting to generic template...</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Spead AI (The 'Good' Option) */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        className="relative p-10 rounded-3xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-900/[0.05] backdrop-blur-md overflow-hidden shadow-xl dark:shadow-[0_0_50px_rgba(79,70,229,0.05)] group hover:shadow-2xl dark:hover:shadow-[0_0_80px_rgba(79,70,229,0.15)] transition-all duration-500"
                    >
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                    <CheckCircle2 className="text-indigo-600 dark:text-indigo-300" size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-3">
                                    {data?.comparison_right_title || "Spead AI Enterprise"}
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white uppercase tracking-wider">Pro</span>
                                </h3>
                            </div>

                            <div className="space-y-4 mb-10">
                                {[
                                    "Context-Aware: Knows your history",
                                    "Secure: Private knowledge base",
                                    "Accurate: Citations from your docs"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-indigo-900 dark:text-indigo-100 font-medium">
                                        <CheckCircle2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                                        {item}
                                    </div>
                                ))}
                            </div>

                            {/* Terminal UI - Success State */}
                            <div className="p-5 bg-indigo-950 dark:bg-[#080810] rounded-xl border border-indigo-200 dark:border-indigo-500/20 font-mono text-xs text-indigo-100 dark:text-indigo-200 leading-relaxed relative overflow-hidden group-hover:border-indigo-500/40 transition-colors">
                                <div className="absolute top-0 left-0 w-1 bg-indigo-500 h-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                <div className="flex flex-col gap-2">
                                    <span className="opacity-70 text-indigo-300">&gt; INPUT: "Draft contract per Q3 rules..."</span>
                                    <span className="text-emerald-400 font-bold">SUCCESS: Found 'Q3_Guidelines.pdf'.</span>
                                    <span className="opacity-80">Generating draft with 99% accuracy...</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ComparisonSection;
