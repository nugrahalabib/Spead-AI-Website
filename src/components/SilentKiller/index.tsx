'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LpRadar } from '@/lib/directus';
import { parseSmartText } from '@/utils/textParser';
import ProblemNode from './ProblemNode';
import RadarCenter from './RadarCenter';

interface SilentKillerProps {
    data?: LpRadar | null;
}

const SilentKiller = ({ data }: SilentKillerProps) => {
    if (!data) return null;

    // Default Fallbacks implemented via explicit checks or just trusting the data presence from singleton
    // Since directus.ts types are strict, we assume data structure matches if present.

    return (
        <section className="relative py-24 px-6 overflow-hidden bg-[#020617]">
            {/* Background Grids */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                {/* 1. HEADLINE */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        {parseSmartText(data.section_headline || "The {Silent Killer:pink} of Enterprise Valuation")}
                    </h2>
                </div>

                {/* 2. RADAR LAYOUT DASHBOARD */}
                {/* Mobile: Vertical Stack | Desktop: Triangular Radar */}
                <div className="relative w-full max-w-4xl mx-auto min-h-[800px] md:min-h-[600px] flex flex-col md:block items-center justify-center gap-16 md:gap-0">

                    {/* SVG CONNECTORS (Desktop Only) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Center (50, 50) to TopLeft (20, 20), TopRight (80, 20), Bottom (50, 80) */}
                        <defs>
                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
                                <stop offset="50%" stopColor="rgba(168, 85, 247, 0.3)" />
                                <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                            </linearGradient>
                        </defs>
                        {/* Lines */}
                        <motion.path d="M 50 50 L 15 20" stroke="url(#lineGrad)" strokeWidth="0.5" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity }} />
                        <motion.path d="M 50 50 L 85 20" stroke="url(#lineGrad)" strokeWidth="0.5" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5, repeat: Infinity }} />
                        <motion.path d="M 50 50 L 50 85" stroke="url(#lineGrad)" strokeWidth="0.5" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1, repeat: Infinity }} />
                    </svg>

                    {/* NODE 1: TOP LEFT (Financial) */}
                    <div className="md:absolute md:top-10 md:left-10 z-20">
                        <ProblemNode
                            position="top-left"
                            color="rose"
                            data={{
                                badge: data.node_1_badge,
                                title: data.node_1_title,
                                subtitle: data.node_1_subtitle,
                                chartType: data.node_1_chart_type,
                                bullets: data.node_1_bullets
                            }}
                        />
                    </div>

                    {/* NODE 2: TOP RIGHT (Admin) */}
                    <div className="md:absolute md:top-10 md:right-10 z-20">
                        <ProblemNode
                            position="top-right"
                            color="amber"
                            data={{
                                badge: data.node_2_badge,
                                title: data.node_2_title,
                                subtitle: data.node_2_subtitle,
                                chartType: data.node_2_chart_type,
                                bullets: data.node_2_bullets
                            }}
                        />
                    </div>

                    {/* CENTER: RADAR CORE */}
                    <div className="md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 order-first md:order-none mb-10 md:mb-0">
                        <RadarCenter />
                    </div>

                    {/* NODE 3: BOTTOM (Liability) */}
                    <div className="md:absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2 z-20">
                        <ProblemNode
                            position="bottom-center"
                            color="violet"
                            data={{
                                badge: data.node_3_badge,
                                title: data.node_3_title,
                                subtitle: data.node_3_subtitle,
                                chartType: data.node_3_chart_type,
                                bullets: data.node_3_bullets
                            }}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SilentKiller;
