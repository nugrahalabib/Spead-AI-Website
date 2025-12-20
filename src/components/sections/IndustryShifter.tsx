'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Briefcase, FileSpreadsheet, Palette, CheckCircle2, Sparkles, Heart, Factory, Building, GraduationCap, LucideIcon } from 'lucide-react';
import { IndustryHeader, IndustryTab } from '@/lib/directus';
import { parseSmartText } from '@/utils/textParser';

// Icon Map
const IconMap: Record<string, LucideIcon> = {
    Scale, Briefcase, FileSpreadsheet, Palette, Heart, Factory, Building, GraduationCap, Sparkles
};

// Color Map with hex values for dynamic styling
const ColorMap: Record<string, { hex: string; shadowColor: string }> = {
    rose: { hex: '#e11d48', shadowColor: '225, 29, 72' },
    indigo: { hex: '#4f46e5', shadowColor: '79, 70, 229' },
    teal: { hex: '#0d9488', shadowColor: '13, 148, 136' },
    fuchsia: { hex: '#c026d3', shadowColor: '192, 38, 211' },
    amber: { hex: '#f59e0b', shadowColor: '245, 158, 11' },
    emerald: { hex: '#10b981', shadowColor: '16, 185, 129' },
    purple: { hex: '#8b5cf6', shadowColor: '139, 92, 246' },
    cyan: { hex: '#06b6d4', shadowColor: '6, 182, 212' }
};

// Helper to parse benefits from Directus
const parseBenefits = (benefits: any): string[] => {
    if (!benefits) return [];
    if (Array.isArray(benefits)) {
        return benefits.map(item => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && item.value) return item.value;
            return String(item);
        });
    }
    return [];
};

// Default industries with full visual assets (fallback)
const defaultIndustries = [
    { id: 'legal', label: 'Legal & Law Firms', icon: 'Scale', color: 'rose', headline: "Defend Your Clients, Not Your Paperwork.", subtitle: "Stop wasting 40% of billable hours on contract drafting and precedent research.", benefits: ["Draft 50-page contracts in minutes", "Instant Case Law Discovery", "Data Sovereignty (No cloud leaks)"] },
    { id: 'consulting', label: 'Management Consulting', icon: 'Briefcase', color: 'indigo', headline: "Sell Strategy, Automate the Slides.", subtitle: "Your value is in the insight, not in formatting 100-page decks till 2 AM.", benefits: ["Instant Market Research Synthesis", "Automated Proposal Generation", "Access firm-wide knowledge history"] },
    { id: 'audit', label: 'Audit & Accounting', icon: 'FileSpreadsheet', color: 'teal', headline: "Audit at the Speed of Light.", subtitle: "Eliminate human error in financial reporting and invoice extraction.", benefits: ["Zero-error Data Extraction", "Automated Financial Reporting", "Fraud Detection Algorithms"] },
    { id: 'creative', label: 'Creative Agencies', icon: 'Palette', color: 'fuchsia', headline: "Scale Creativity, Kill Administration.", subtitle: "Don't let admin blockers kill your creative flow.", benefits: ["Auto-generate Client Reports", "Project Timeline Automation", "Campaign Research Assistant"] }
];

interface IndustryShifterProps {
    header?: IndustryHeader | null;
    tabs?: IndustryTab[];
}

const IndustryShifter = ({ header, tabs = [] }: IndustryShifterProps) => {
    // Use data from Directus if available
    const sectionHeadline = header?.headline || "Engineered for the {High-Stakes:amber} Economy.";
    const sectionSubtitle = header?.subtitle || "Spead AI adapts to your industry's specific workflows, compliance needs, and language.";

    // Filter published tabs and merge with visual data
    const publishedTabs = tabs.filter(t => t.status === 'published');

    // Build industries array from Directus data or use defaults
    const industries = publishedTabs.length > 0
        ? publishedTabs.map((tab, index) => ({
            id: `tab-${tab.id}`,
            label: tab.label,
            icon: tab.icon,
            color: tab.color,
            hex: ColorMap[tab.color]?.hex || '#3b82f6',
            shadowColor: ColorMap[tab.color]?.shadowColor || '59, 130, 246',
            headline: tab.headline,
            subtitle: tab.subtitle,
            benefits: parseBenefits(tab.benefits)
        }))
        : defaultIndustries.map(ind => ({
            ...ind,
            hex: ColorMap[ind.color]?.hex || '#3b82f6',
            shadowColor: ColorMap[ind.color]?.shadowColor || '59, 130, 246'
        }));

    const [activeId, setActiveId] = useState(industries[0]?.id || 'legal');
    const activeIndustry = industries.find(i => i.id === activeId) || industries[0];
    const ActiveIcon = IconMap[activeIndustry?.icon] || Scale;

    return (
        <section id="solutions" className="relative py-32 z-10 overflow-hidden bg-[#020617]">
            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-20 max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-white mb-6 leading-none">
                        {parseSmartText(sectionHeadline)}
                    </h2>
                    <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto">
                        {sectionSubtitle}
                    </p>
                </div>

                {/* THE COCKPIT CONTAINER */}
                <div className="relative rounded-3xl border border-white/10 bg-[#0f172a]/40 backdrop-blur-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col lg:flex-row">

                    {/* LEFT NAV COLUMN (30%) */}
                    <div className="lg:w-[30%] border-r border-white/5 flex flex-col py-8 bg-black/20">
                        {industries.map((ind) => {
                            const isActive = activeId === ind.id;
                            const NavIcon = IconMap[ind.icon] || Scale;
                            return (
                                <div
                                    key={ind.id}
                                    onClick={() => setActiveId(ind.id)}
                                    className={`
                                         group relative py-5 px-8 cursor-pointer transition-all duration-300
                                         ${isActive ? 'bg-white/5' : 'hover:bg-white/[0.02]'}
                                     `}
                                >
                                    {/* Slim Glowing Line Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navLine"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-current"
                                            style={{ backgroundColor: ind.hex, boxShadow: `0 0 10px ${ind.hex}` }}
                                        />
                                    )}

                                    <div className="flex items-center gap-4">
                                        <NavIcon size={20} className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`} style={{ color: isActive ? ind.hex : undefined }} />
                                        <span className={`text-sm md:text-base font-medium tracking-tight transition-colors duration-300 ${isActive ? 'text-white shadow-current' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                            {ind.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT CONTENT COLUMN (70%) */}
                    <div className="lg:w-[70%] p-8 md:p-12 relative flex items-center bg-[#0B0F19]/50">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndustry.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full flex flex-col justify-center"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                                    {/* Text Content */}
                                    <div className="order-2 md:order-1">
                                        <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6 leading-tight">
                                            {activeIndustry.headline}
                                        </h3>
                                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                            {activeIndustry.subtitle}
                                        </p>
                                        <ul className="space-y-4">
                                            {activeIndustry.benefits.map((benefit, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <CheckCircle2 size={18} className="shrink-0" style={{ color: activeIndustry.hex }} />
                                                    <span className="text-slate-300 text-sm font-medium">{benefit}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Visual Mockups - Based on Icon */}
                                    <div className="order-1 md:order-2 flex justify-center items-center h-[320px]">

                                        {/* LEGAL (Scale icon) */}
                                        {activeIndustry.icon === 'Scale' && (
                                            <div className="relative w-56 h-72 bg-[#1a1a1a] rounded-xl flex flex-col p-6 border border-white/5 shadow-2xl">
                                                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                                                    <Scale size={20} className="text-rose-500" />
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-mono mb-2">Contract_v1.pdf</div>
                                                <div className="h-2 w-12 bg-rose-500/20 rounded mb-4" />
                                                <div className="space-y-2 mt-auto">
                                                    <div className="h-1.5 bg-white/10 rounded w-full" />
                                                    <div className="h-1.5 bg-white/10 rounded w-full" />
                                                    <div className="h-1.5 bg-white/10 rounded w-2/3" />
                                                </div>
                                                <motion.div
                                                    animate={{ top: ["0%", "100%"] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_20px_#e11d48] z-10"
                                                />
                                                <div className="absolute bottom-4 right-4 bg-rose-500 text-white text-[10px] px-2 py-1 rounded shadow-lg">
                                                    Risk Found
                                                </div>
                                            </div>
                                        )}

                                        {/* CONSULTING (Briefcase icon) */}
                                        {activeIndustry.icon === 'Briefcase' && (
                                            <div className="relative w-full max-w-[240px]">
                                                <motion.div
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.8] }}
                                                    className="absolute inset-0 bg-[#0f172a] border border-white/5 rounded-xl p-4 shadow-lg"
                                                >
                                                    <div className="grid grid-cols-4 gap-2 mb-2">
                                                        {[...Array(12)].map((_, i) => <div key={i} className="h-1 bg-white/10 rounded" />)}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 text-center mt-8">Raw Data</div>
                                                </motion.div>
                                                <motion.div
                                                    animate={{ opacity: [0, 1, 0] }}
                                                    transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.8] }}
                                                    className="absolute inset-0 bg-[#1e1b4b] border border-indigo-500/30 rounded-xl p-4 flex flex-col justify-end items-center shadow-[0_0_30px_rgba(79,70,229,0.3)]"
                                                >
                                                    <div className="flex items-end gap-2 h-24 w-full justify-center">
                                                        <div className="w-1/4 h-[40%] bg-indigo-500 rounded-t" />
                                                        <div className="w-1/4 h-[70%] bg-indigo-400 rounded-t" />
                                                        <div className="w-1/4 h-[50%] bg-indigo-300 rounded-t" />
                                                    </div>
                                                    <div className="text-[10px] text-indigo-300 mt-4">Strategy Ready</div>
                                                </motion.div>
                                            </div>
                                        )}

                                        {/* AUDIT (FileSpreadsheet icon) */}
                                        {activeIndustry.icon === 'FileSpreadsheet' && (
                                            <div className="relative h-64 w-64 flex items-center justify-center">
                                                <motion.div
                                                    className="absolute inset-0 border border-teal-500/20 rounded-xl flex items-center justify-center bg-transparent"
                                                    animate={{ scale: [1, 0.95, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <FileSpreadsheet size={32} className="text-teal-500" />
                                                </motion.div>
                                                {[...Array(6)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200, opacity: 0 }}
                                                        animate={{ x: 0, y: 0, opacity: [0, 1, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                                        className="absolute w-8 h-10 bg-white/10 rounded flex items-center justify-center"
                                                    >
                                                        <div className="w-4 h-0.5 bg-white/30" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {/* CREATIVE (Palette icon) */}
                                        {activeIndustry.icon === 'Palette' && (
                                            <div className="relative w-64 h-48 flex items-center justify-center">
                                                <div className="relative w-40 h-56 bg-[#1a1a1a] border border-white/5 rounded-lg p-4 flex flex-col items-center justify-center shadow-2xl">
                                                    <div className="text-lg font-serif text-white mb-2">Brief</div>
                                                    <motion.div
                                                        animate={{ width: ["0%", "100%"] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="h-1 bg-fuchsia-500 rounded mb-2"
                                                    />
                                                    <Sparkles size={16} className="text-yellow-400 mt-2" />
                                                </div>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                                                    animate={{ opacity: 1, scale: 1, x: 50 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="absolute top-4 -right-12 bg-fuchsia-900/80 backdrop-blur border border-fuchsia-500/30 px-3 py-1 rounded-full text-[10px] text-fuchsia-100"
                                                >
                                                    Timeline Gen
                                                </motion.div>
                                            </div>
                                        )}

                                        {/* FALLBACK for other icons - Generic visual */}
                                        {!['Scale', 'Briefcase', 'FileSpreadsheet', 'Palette'].includes(activeIndustry.icon) && (
                                            <div className="relative w-56 h-72 bg-[#1a1a1a] rounded-xl flex flex-col p-6 border border-white/5 shadow-2xl">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${activeIndustry.hex}20` }}>
                                                    <ActiveIcon size={20} style={{ color: activeIndustry.hex }} />
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-mono mb-2">Document.pdf</div>
                                                <div className="h-2 w-12 rounded mb-4" style={{ backgroundColor: `${activeIndustry.hex}30` }} />
                                                <div className="space-y-2 mt-auto">
                                                    <div className="h-1.5 bg-white/10 rounded w-full" />
                                                    <div className="h-1.5 bg-white/10 rounded w-full" />
                                                    <div className="h-1.5 bg-white/10 rounded w-2/3" />
                                                </div>
                                                <motion.div
                                                    animate={{ top: ["0%", "100%"] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute left-0 right-0 h-0.5 z-10"
                                                    style={{ backgroundColor: activeIndustry.hex, boxShadow: `0 0 20px ${activeIndustry.hex}` }}
                                                />
                                                <div className="absolute bottom-4 right-4 text-white text-[10px] px-2 py-1 rounded shadow-lg" style={{ backgroundColor: activeIndustry.hex }}>
                                                    AI Ready
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default IndustryShifter;
