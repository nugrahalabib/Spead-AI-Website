'use client';

import { motion } from 'framer-motion';
import { Wallet, Clock, AlertTriangle, Activity, TrendingDown } from 'lucide-react';
import { LpRadar } from '@/lib/directus';
import { parseSmartText } from '@/utils/textParser';

interface ProblemSectionProps {
    data?: LpRadar | null;
}

// Helper to parse bullets from Directus (can be array of objects or strings)
const parseBullets = (bullets: any): string[] => {
    if (!bullets) return [];
    if (Array.isArray(bullets)) {
        return bullets.map(item => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && item.value) return item.value;
            return String(item);
        });
    }
    if (typeof bullets === 'string') {
        try {
            const parsed = JSON.parse(bullets);
            return parseBullets(parsed);
        } catch {
            return [bullets];
        }
    }
    return [];
};

const ProblemSection = ({ data }: ProblemSectionProps) => {
    // Use data from Directus if available, otherwise use defaults
    const headline = data?.section_headline || "The Silent Killer of Enterprise Valuation: Administrative Drag.";

    // Parse bullets for each node
    const node1Bullets = parseBullets(data?.node_1_bullets) || ['Equiv. to 9.3 hours/week lost just searching.', 'Paying full salary for 75% output.'];
    const node2Bullets = parseBullets(data?.node_2_bullets) || ['Manual formatting & data entry work.', 'Blocks strategic client advisory.'];
    const node3Bullets = parseBullets(data?.node_3_bullets) || ['Human typos in contracts = Lawsuits.', 'Public AI leaks sensitive client data.'];

    return (
        <section className="relative py-32 px-6 z-10 overflow-hidden bg-[#020617] lg:h-[1000px] flex flex-col items-center justify-center font-sans">

            {/* ATMOSPHERE */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] bg-indigo-900/5 blur-[120px] rounded-full pointer-events-none" />

            {/* ROTATING RADAR RINGS (Faint Background) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/10 opacity-30 pointer-events-none animate-[spin_120s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/10 opacity-20 pointer-events-none animate-[spin_80s_linear_infinite_reverse]" />

            <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center h-full justify-start pt-20 lg:pt-0 lg:justify-center">

                {/* HEADLINE */}
                <div className="text-center mb-32 lg:absolute lg:top-8 lg:mb-0 z-20">
                    <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
                        {parseSmartText(headline)}
                    </h2>
                </div>

                {/* THE FLOATING HUD SYSTEM */}
                <div className="relative w-full max-w-5xl h-[600px] flex flex-col lg:block gap-16 lg:gap-0 mt-10 lg:mt-48">

                    {/* 1. THE CORE (Center Anchor) - ENHANCED GLOW */}
                    <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center z-10">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            {/* OUTER GLOW */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 to-rose-500/20 blur-2xl animate-pulse" />

                            {/* Shockwaves - More visible */}
                            <div className="absolute inset-0 rounded-full border-2 border-violet-500/40 animate-[ping_2s_ease-out_infinite]" />
                            <div className="absolute inset-4 rounded-full border border-violet-400/30 animate-[ping_2.5s_ease-out_infinite_0.5s]" />
                            <div className="absolute inset-8 rounded-full border border-rose-400/20 animate-[ping_3s_ease-out_infinite_1s]" />

                            {/* Dark Matter Orb - Enhanced */}
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#0a0a20] to-[#1a1a3a] border border-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.3),0_0_80px_rgba(139,92,246,0.1)] flex flex-col items-center justify-center backdrop-blur-md z-20">
                                <Activity size={28} className="text-violet-400 animate-pulse mb-1 drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                                <div className="text-[10px] text-violet-300 tracking-[0.2em] font-medium text-center leading-tight">SYSTEM<br />DIAGNOSIS</div>
                            </div>

                            {/* Rotating scanner line */}
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-violet-500/80 to-transparent origin-left animate-[spin_4s_linear_infinite]" />
                            </div>
                        </div>

                        {/* LASER CONNECTIONS */}
                        <svg className="absolute inset-0 w-[900px] h-[700px] -translate-x-[370px] -translate-y-[270px] pointer-events-none overflow-visible">
                            <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-rose-500/30" />
                            <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-amber-500/30" />
                            <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-violet-500/30" />
                        </svg>
                    </div>

                    {/* NODE 1: MONEY BURNED (Top Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:absolute lg:top-[5%] lg:left-[15%] w-full lg:w-auto flex flex-col items-center lg:items-end text-center lg:text-right group z-20 hover:z-50"
                    >
                        <div className="flex flex-col items-center lg:items-end gap-2 relative">

                            {/* NEON CATEGORY TAG */}
                            <div className="text-[10px] uppercase tracking-widest font-bold text-rose-400 border border-rose-500/30 rounded-full px-3 py-1 bg-rose-950/20 mb-2 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                                {data?.node_1_badge || 'Financial Leak'}
                            </div>

                            {/* ICON */}
                            <div className="relative group-hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full" />
                                <Wallet size={48} className="text-rose-400 relative z-10 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                            </div>

                            {/* DATA */}
                            <div>
                                <div className="text-4xl md:text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-rose-300 to-rose-600 mb-1 drop-shadow-lg">
                                    {data?.node_1_title || 'IDR 102M'}
                                </div>
                                <div className="text-rose-200/70 text-sm tracking-widest uppercase font-medium">
                                    {data?.node_1_subtitle || 'Loss per employee / yr'}
                                </div>
                            </div>

                            {/* HOLOGRAPHIC PROJECTION (Popup) */}
                            <div className="
                                absolute top-full right-0 mt-4 w-[280px] bg-[#0f172a]/90 backdrop-blur-xl border border-rose-500/30 rounded-xl overflow-hidden
                                opacity-0 invisible translate-y-4 scale-95
                                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100
                                transition-all duration-300 ease-out origin-top-right shadow-2xl dark:shadow-none
                             ">
                                <div className="h-1 w-full bg-rose-500/50" />
                                <div className="p-5 text-left">
                                    {/* Mini Animation: Falling Bars */}
                                    <div className="flex items-end gap-2 h-16 mb-4 border-b border-rose-500/20 pb-2 px-2">
                                        <div className="w-1/4 bg-rose-500/20 h-full rounded-t-sm relative overflow-hidden"><div className="absolute bottom-0 w-full bg-rose-500/40 h-[80%] animate-pulse" /></div>
                                        <div className="w-1/4 bg-rose-500/20 h-full rounded-t-sm relative overflow-hidden"><div className="absolute bottom-0 w-full bg-rose-500/60 h-[60%] animate-pulse delay-75" /></div>
                                        <div className="w-1/4 bg-rose-500/20 h-full rounded-t-sm relative overflow-hidden"><div className="absolute bottom-0 w-full bg-rose-500/80 h-[40%] animate-pulse delay-150" /></div>
                                        <div className="w-1/4 bg-rose-500/20 h-full rounded-t-sm relative overflow-hidden"><div className="absolute bottom-0 w-full bg-rose-500 h-[20%] animate-pulse delay-200" /></div>
                                    </div>

                                    <ul className="space-y-2 text-rose-100/90 text-sm">
                                        {node1Bullets.length > 0 ? node1Bullets.map((bullet, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-rose-500 mt-1">●</span>
                                                <span>{bullet}</span>
                                            </li>
                                        )) : (
                                            <>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-rose-500 mt-1">●</span>
                                                    <span>Equiv. to 9.3 hours/week lost just searching.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-rose-500 mt-1">●</span>
                                                    <span>Paying full salary for 75% output.</span>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                    {/* NODE 2: TIME WASTED (Top Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:absolute lg:top-[5%] lg:right-[15%] w-full lg:w-auto flex flex-col items-center lg:items-start text-center lg:text-left group z-20 hover:z-50"
                    >
                        <div className="flex flex-col items-center lg:items-start gap-2 relative">

                            {/* NEON CATEGORY TAG */}
                            <div className="text-[10px] uppercase tracking-widest font-bold text-amber-400 border border-amber-500/30 rounded-full px-3 py-1 bg-amber-950/20 mb-2 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                                {data?.node_2_badge || 'Admin Drain'}
                            </div>

                            {/* ICON */}
                            <div className="relative group-hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
                                <Clock size={48} className="text-amber-400 relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                            </div>

                            {/* DATA */}
                            <div>
                                <div className="text-4xl md:text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-bl from-amber-300 to-amber-600 mb-1 drop-shadow-lg">
                                    {data?.node_2_title || '40% Time'}
                                </div>
                                <div className="text-amber-200/70 text-sm tracking-widest uppercase font-medium">
                                    {data?.node_2_subtitle || 'Non-billable Work'}
                                </div>
                            </div>

                            {/* HOLOGRAPHIC PROJECTION (Popup) */}
                            <div className="
                                absolute top-full left-0 mt-4 w-[280px] bg-[#0f172a]/90 backdrop-blur-xl border border-amber-500/30 rounded-xl overflow-hidden
                                opacity-0 invisible translate-y-4 scale-95
                                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100
                                transition-all duration-300 ease-out origin-top-left shadow-2xl dark:shadow-none
                             ">
                                <div className="h-1 w-full bg-amber-500/50" />
                                <div className="p-5 text-left">
                                    {/* Mini Animation: Pie Chart Filling */}
                                    <div className="flex items-center justify-center h-16 mb-4">
                                        <div className="relative w-12 h-12 rounded-full border-4 border-amber-900/50 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                <circle cx="24" cy="24" r="20" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="125" strokeDashoffset="125" className="group-hover:animate-[dash_1s_ease-out_forwards]" />
                                            </svg>
                                            <span className="text-[10px] text-amber-500 font-bold">40%</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-2 text-amber-100/90 text-sm">
                                        {node2Bullets.length > 0 ? node2Bullets.map((bullet, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-amber-500 mt-1">●</span>
                                                <span>{bullet}</span>
                                            </li>
                                        )) : (
                                            <>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-amber-500 mt-1">●</span>
                                                    <span>Manual formatting & data entry work.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-amber-500 mt-1">●</span>
                                                    <span>Blocks strategic client advisory.</span>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                    {/* NODE 3: FATAL RISK (Bottom Center) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="lg:absolute lg:bottom-[5%] lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-auto flex flex-col items-center text-center group z-20 hover:z-50"
                    >
                        <div className="flex flex-col items-center gap-2 relative">

                            {/* HOLOGRAPHIC PROJECTION (Popup - Opens UPWARDS due to bottom position) */}
                            <div className="
                                absolute bottom-full mb-4 w-[300px] bg-[#0f172a]/90 backdrop-blur-xl border border-violet-500/30 rounded-xl overflow-hidden
                                opacity-0 invisible -translate-y-4 scale-95
                                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100
                                transition-all duration-300 ease-out origin-bottom shadow-2xl z-50 dark:shadow-none
                             ">
                                <div className="h-1 w-full bg-violet-500/50" />
                                <div className="p-5 text-left">
                                    {/* Mini Animation: Glitch Pulse */}
                                    <div className="h-12 mb-4 bg-violet-900/20 rounded flex items-center overflow-hidden relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full h-0.5 bg-violet-500/30" />
                                        </div>
                                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_infinite] absolute left-1/2" />
                                        <div className="text-[10px] text-violet-300 font-mono w-full text-center">ERROR DETECTED</div>
                                    </div>

                                    <ul className="space-y-2 text-violet-100/90 text-sm">
                                        {node3Bullets.length > 0 ? node3Bullets.map((bullet, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-violet-500 mt-1">●</span>
                                                <span>{bullet}</span>
                                            </li>
                                        )) : (
                                            <>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-violet-500 mt-1">●</span>
                                                    <span>Human typos in contracts = Lawsuits.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-violet-500 mt-1">●</span>
                                                    <span>Public AI leaks sensitive client data.</span>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* NEON CATEGORY TAG */}
                            <div className="text-[10px] uppercase tracking-widest font-bold text-violet-400 border border-violet-500/30 rounded-full px-3 py-1 bg-violet-950/20 mb-2 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                                {data?.node_3_badge || 'Critical Liability'}
                            </div>

                            {/* ICON */}
                            <div className="relative group-hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full" />
                                <AlertTriangle size={56} className="text-violet-400 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                            </div>

                            {/* DATA */}
                            <div className="relative">
                                <div className="text-4xl md:text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-violet-300 to-violet-600 mb-1 drop-shadow-lg relative z-10">
                                    {data?.node_3_title || 'High Liability'}
                                </div>
                                <div className="absolute inset-0 text-4xl md:text-6xl font-mono font-bold text-violet-500/30 blur-[1px] animate-pulse">
                                    {data?.node_3_title || 'High Liability'}
                                </div>
                                <div className="text-violet-200/70 text-sm tracking-widest uppercase font-medium">
                                    {data?.node_3_subtitle || 'Human Error & Leaks'}
                                </div>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
