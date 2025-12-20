'use client';

import { motion } from 'framer-motion';
import { Bot, Calendar, FileText, Sparkles, Shield, ArrowUpRight, CheckCircle2, BarChart, MessageSquare, Lock, Zap, Target, LucideIcon } from 'lucide-react';
import { SolutionHeader, SolutionCard } from '@/lib/directus';
import { parseSmartText } from '@/utils/textParser';

// Map string icon names to Lucide components
const IconMap: Record<string, LucideIcon> = {
    Bot, Calendar, FileText, Sparkles, Shield, BarChart, MessageSquare, Lock, Zap, Target
};

// Map color names to Tailwind classes
const ColorMap: Record<string, { bg: string; text: string; border: string; hover: string; gradient: string }> = {
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/50', hover: 'hover:border-cyan-500/50', gradient: 'from-cyan-500/5' },
    amber: { bg: 'bg-amber-500/20', text: 'text-amber-500', border: 'border-amber-500/50', hover: 'hover:border-amber-500/50', gradient: 'from-amber-500/5' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-500', border: 'border-purple-500/50', hover: 'hover:border-purple-500/50', gradient: 'from-purple-500/5' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-500', border: 'border-pink-500/50', hover: 'hover:border-pink-500/50', gradient: 'from-pink-500/5' },
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-500', border: 'border-emerald-500/50', hover: 'hover:border-emerald-500/50', gradient: 'from-emerald-500/5' },
};

interface SolutionModulesProps {
    header?: SolutionHeader | null;
    cards?: SolutionCard[];
}

const SolutionModules = ({ header, cards = [] }: SolutionModulesProps) => {
    // Default values if no data
    const headline = header?.headline || "Command Center {Capabilities.:cyan}";
    const subtitle = header?.subtitle || "A unified operating system. The ecosystem that breathes with your business.";

    // Filter published cards
    const publishedCards = cards.filter(c => c.status === 'published');

    // Default cards if none provided
    const defaultCards: SolutionCard[] = [
        { id: 1, sort: 1, status: 'published', title: 'Builder Generator', description: 'Draft complex legal contracts, audit reports, and proposals in minutes.', icon: 'Bot', card_size: 'large', color: 'cyan', badge_text: '87% Faster', cta_text: 'Start Building' },
        { id: 2, sort: 2, status: 'published', title: 'Daily Planner', description: 'Automated schedule optimization.', icon: 'Calendar', card_size: 'small', color: 'amber' },
        { id: 3, sort: 3, status: 'published', title: 'Docs Assistant', description: 'Chat with knowledge.', icon: 'FileText', card_size: 'small', color: 'purple' },
        { id: 4, sort: 4, status: 'published', title: 'AI Partner', description: 'Strategic Fusion.', icon: 'Sparkles', card_size: 'small', color: 'pink' },
        { id: 5, sort: 5, status: 'published', title: 'Digital Vault', description: 'Sovereign Infrastructure.', icon: 'Shield', card_size: 'small', color: 'emerald' },
    ];

    const displayCards = publishedCards.length > 0 ? publishedCards : defaultCards;

    return (
        <section id="features" className="relative py-32 px-6 z-10 overflow-hidden">
            {/* Visual Harmonization: Large Background Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[800px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-4 text-white">
                        {parseSmartText(headline)}
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        {subtitle}
                    </p>
                </div>

                {/* BENTO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(320px,auto)] gap-6">
                    {displayCards.map((card, index) => {
                        const Icon = IconMap[card.icon] || Bot;
                        const colors = ColorMap[card.color] || ColorMap.cyan;

                        if (card.card_size === 'large') {
                            // LARGE HERO CARD
                            return (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group relative md:col-span-8 rounded-[2rem] bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl border border-white/10 overflow-hidden ${colors.hover} hover:shadow-[0_0_50px_rgba(34,211,238,0.1)] transition-all duration-500`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className="relative z-10 h-full flex flex-col md:flex-row p-8 md:p-10 gap-8">
                                        <div className="flex flex-col justify-between md:w-2/5 z-20">
                                            <div>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text}`}><Icon size={24} /></div>
                                                    {card.badge_text && (
                                                        <motion.div
                                                            animate={{ y: [0, -4, 0] }}
                                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                            className={`px-3 py-1 rounded-full ${colors.bg.replace('/20', '/10')} border ${colors.border.replace('/50', '/20')} ${colors.text} text-xs font-bold`}
                                                        >
                                                            {card.badge_text}
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <h3 className="text-3xl font-bold text-white mb-2">{card.title}</h3>
                                                <p className="text-slate-400 leading-relaxed">{card.description}</p>
                                            </div>
                                            {card.cta_text && (
                                                <a href={card.cta_link || '#'} className={`mt-8 flex items-center gap-2 ${colors.text} font-bold cursor-pointer group-hover:translate-x-2 transition-transform`}>
                                                    {card.cta_text} <ArrowUpRight size={18} />
                                                </a>
                                            )}
                                        </div>
                                        <div className="relative flex-1 bg-[#0F1729] rounded-xl border border-white/5 p-1 shadow-2xl group-hover:-translate-y-2 transition-transform duration-500">
                                            <div className="h-full w-full bg-[#020617] rounded-lg overflow-hidden relative p-4 flex flex-col gap-3">
                                                <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    <div className="text-[10px] text-slate-500 ml-2">contract_draft_v1.md</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <motion.div initial={{ width: 0 }} whileInView={{ width: "60%" }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="h-2 bg-slate-700/50 rounded-full" />
                                                    <motion.div initial={{ width: 0 }} whileInView={{ width: "80%" }} transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 3 }} className="h-2 bg-slate-700/50 rounded-full" />
                                                    <motion.div initial={{ width: 0 }} whileInView={{ width: "40%" }} transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 3 }} className="h-2 bg-slate-700/50 rounded-full" />
                                                </div>
                                                <div className={`mt-auto p-3 rounded-lg ${colors.bg.replace('/20', '/10')} border ${colors.border.replace('/50', '/20')}`}>
                                                    <div className={`flex items-center gap-2 ${colors.text} text-xs font-mono`}>
                                                        <span className="animate-pulse">_</span> Generating clauses...
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        } else {
                            // SMALL CARD
                            return (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group relative md:col-span-4 rounded-[2rem] bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl border border-white/10 overflow-hidden ${colors.hover} transition-all duration-500 flex flex-col`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className="p-8 relative z-10 flex-1 flex flex-col">
                                        {/* Icon + Badge in same row */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className={`${colors.bg} ${colors.text} p-2.5 rounded-xl`}><Icon size={24} /></div>
                                            {card.badge_text && (
                                                <motion.div
                                                    animate={{ y: [0, -3, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                    className={`px-3 py-1 rounded-full ${colors.bg.replace('/20', '/10')} border ${colors.border.replace('/50', '/20')} ${colors.text} text-xs font-bold`}
                                                >
                                                    {card.badge_text}
                                                </motion.div>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4">{card.description}</p>

                                        {card.cta_text && (
                                            <a href={card.cta_link || '#'} className={`flex items-center gap-2 ${colors.text} text-sm font-bold cursor-pointer group-hover:translate-x-1 transition-transform mb-4`}>
                                                {card.cta_text} <ArrowUpRight size={16} />
                                            </a>
                                        )}

                                        {/* Unique Animation per Icon Type */}
                                        <div className="mt-auto relative group-hover:-translate-y-1 transition-transform duration-500">
                                            {card.icon === 'Calendar' && (
                                                /* DAILY PLANNER: Timeline Animation */
                                                <div className="relative pl-4 border-l border-white/10 space-y-4">
                                                    <motion.div
                                                        animate={{ top: ["0%", "100%"] }}
                                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                        className={`absolute left-[-1px] top-0 w-0.5 h-8 bg-gradient-to-b ${colors.text.replace('text-', 'from-')} to-transparent z-10`}
                                                    />
                                                    <div className="relative">
                                                        <motion.div
                                                            animate={{ opacity: [0, 1, 0] }}
                                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                                                            className="absolute -left-[21px] top-1"
                                                        >
                                                            <CheckCircle2 size={14} className="text-green-500 bg-[#020617] rounded-full" />
                                                        </motion.div>
                                                        <div className={`text-[10px] ${colors.text} font-mono mb-1 tracking-wider`}>Current</div>
                                                        <div className="text-xs text-white font-medium bg-white/5 px-3 py-2 rounded-lg border border-white/5">Client Strategy Review</div>
                                                    </div>
                                                    <div className="relative opacity-50">
                                                        <div className="text-[10px] text-slate-500 font-mono mb-1 tracking-wider">Upcoming</div>
                                                        <div className="text-xs text-slate-400 bg-white/5 px-3 py-2 rounded-lg border border-white/5">Q4 Planning</div>
                                                    </div>
                                                </div>
                                            )}

                                            {card.icon === 'FileText' && (
                                                /* DOCS ASSISTANT: AI-Powered Document Intelligence */
                                                <div className="relative h-36 flex items-center justify-center overflow-hidden">
                                                    {/* Background Glow */}
                                                    <motion.div
                                                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                                                        transition={{ duration: 3, repeat: Infinity }}
                                                        className="absolute inset-0 bg-gradient-radial from-purple-500/30 via-transparent to-transparent rounded-xl"
                                                    />

                                                    {/* Chat Interface */}
                                                    <div className="relative w-full max-w-[180px] bg-[#0a0a1a] rounded-xl border border-purple-500/20 p-3 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                                                        {/* Header */}
                                                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                                                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                                <MessageSquare size={12} className="text-purple-400" />
                                                            </div>
                                                            <span className="text-[10px] text-purple-300 font-medium">Chat with 1M docs company</span>
                                                        </div>

                                                        {/* User Question */}
                                                        <motion.div
                                                            initial={{ opacity: 0, x: 10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.5 }}
                                                            className="flex justify-end mb-2"
                                                        >
                                                            <div className="bg-purple-600/30 text-[9px] text-white px-2 py-1 rounded-lg max-w-[80%]">
                                                                "What's the NDA term?"
                                                            </div>
                                                        </motion.div>

                                                        {/* AI Response with typing effect */}
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.5 }}
                                                            className="flex gap-2"
                                                        >
                                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                                                <Sparkles size={10} className="text-white" />
                                                            </div>
                                                            <div className="bg-white/5 text-[9px] text-slate-300 px-2 py-1.5 rounded-lg">
                                                                <motion.span
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: [0, 1] }}
                                                                    transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
                                                                >
                                                                    Found in <span className="text-purple-400">Contract_v3.pdf</span>:
                                                                    <span className="text-emerald-400 font-bold"> 2-year term</span>
                                                                </motion.span>
                                                            </div>
                                                        </motion.div>

                                                        {/* Scanning indicator */}
                                                        <motion.div
                                                            animate={{ width: ["0%", "100%", "0%"] }}
                                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                                                            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {card.icon === 'Sparkles' && (
                                                /* AI PARTNER: Neural Brain Network */
                                                <div className="relative h-36 flex items-center justify-center overflow-hidden">
                                                    {/* Pulsing Background */}
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                                        transition={{ duration: 3, repeat: Infinity }}
                                                        className="absolute w-40 h-40 bg-gradient-radial from-pink-500/40 via-orange-500/20 to-transparent rounded-full blur-xl"
                                                    />

                                                    {/* Central AI Core with Ring */}
                                                    <div className="relative">
                                                        {/* Outer Rotating Ring */}
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                            className="absolute -inset-6 rounded-full border border-pink-500/30"
                                                        >
                                                            {/* Orbiting dots */}
                                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full shadow-[0_0_10px_#ec4899]" />
                                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-400 rounded-full shadow-[0_0_10px_#f97316]" />
                                                        </motion.div>

                                                        {/* Inner Rotating Ring (opposite) */}
                                                        <motion.div
                                                            animate={{ rotate: -360 }}
                                                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                                            className="absolute -inset-3 rounded-full border border-pink-500/20"
                                                        >
                                                            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_#facc15]" />
                                                        </motion.div>

                                                        {/* Core Sphere - Breathing */}
                                                        <motion.div
                                                            animate={{
                                                                scale: [1, 1.15, 1],
                                                                boxShadow: [
                                                                    "0 0 30px rgba(236,72,153,0.5)",
                                                                    "0 0 50px rgba(236,72,153,0.8)",
                                                                    "0 0 30px rgba(236,72,153,0.5)"
                                                                ]
                                                            }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="relative w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 flex items-center justify-center"
                                                        >
                                                            <Sparkles size={20} className="text-white" />
                                                        </motion.div>
                                                    </div>

                                                    {/* Floating "100% Smart" badge */}
                                                    <motion.div
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute top-0 right-4 px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-[9px] text-pink-300 font-bold"
                                                    >
                                                        100% Smart
                                                    </motion.div>

                                                    {/* Neural connection lines */}
                                                    {[45, 135, 225, 315].map((angle, i) => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1, 0.8] }}
                                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                                            className="absolute w-16 h-[1px] bg-gradient-to-r from-pink-500/50 to-transparent origin-left"
                                                            style={{ transform: `rotate(${angle}deg)`, left: '50%', top: '50%' }}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {card.icon === 'Shield' && (
                                                /* MODEL ARMOR: Security Fortress */
                                                <div className="relative h-36 flex items-center justify-center overflow-hidden">
                                                    {/* Security Grid Background */}
                                                    <div className="absolute inset-0 opacity-20">
                                                        <div className="w-full h-full" style={{
                                                            backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
                                                            backgroundSize: '20px 20px'
                                                        }} />
                                                    </div>

                                                    {/* Central Shield Container */}
                                                    <div className="relative">
                                                        {/* Hexagonal Shield Frame */}
                                                        <motion.div
                                                            animate={{ rotate: [0, 360] }}
                                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                            className="absolute -inset-8 border border-emerald-500/20 rounded-lg"
                                                            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                                                        />

                                                        {/* Shield Pulse Rings */}
                                                        <motion.div
                                                            animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="absolute -inset-6 border-2 border-emerald-500/30 rounded-xl"
                                                        />
                                                        <motion.div
                                                            animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
                                                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                                            className="absolute -inset-6 border border-emerald-500/20 rounded-xl"
                                                        />

                                                        {/* Core Server Cube */}
                                                        <motion.div
                                                            animate={{
                                                                boxShadow: [
                                                                    "0 0 20px rgba(16,185,129,0.3)",
                                                                    "0 0 40px rgba(16,185,129,0.5)",
                                                                    "0 0 20px rgba(16,185,129,0.3)"
                                                                ]
                                                            }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="relative w-14 h-14 bg-gradient-to-br from-emerald-900/80 to-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center justify-center backdrop-blur-sm"
                                                        >
                                                            <Shield size={24} className="text-emerald-400" />

                                                            {/* Status LED */}
                                                            <motion.div
                                                                animate={{ opacity: [1, 0.3, 1] }}
                                                                transition={{ duration: 1, repeat: Infinity }}
                                                                className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]"
                                                            />
                                                        </motion.div>
                                                    </div>

                                                    {/* Threat Detection & Block Animation */}
                                                    <motion.div
                                                        animate={{
                                                            x: [80, 20],
                                                            y: [-20, 0],
                                                            opacity: [0, 1, 1, 0],
                                                            scale: [0.5, 1, 1, 0.3]
                                                        }}
                                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, times: [0, 0.3, 0.7, 1] }}
                                                        className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"
                                                    />

                                                    {/* "BLOCKED" flash */}
                                                    <motion.div
                                                        animate={{ opacity: [0, 1, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, times: [0.3, 0.5, 0.7] }}
                                                        className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-500/20 border border-red-500/40 rounded text-[8px] text-red-400 font-bold tracking-wider"
                                                    >
                                                        ⛔ BLOCKED
                                                    </motion.div>

                                                    {/* Safety Badge */}
                                                    <motion.div
                                                        animate={{ y: [0, -3, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute bottom-1 right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] text-emerald-300 font-bold"
                                                    >
                                                        100% Safety
                                                    </motion.div>
                                                </div>
                                            )}

                                            {/* Fallback for other icons - Premium Pulsing Glow */}
                                            {!['Calendar', 'FileText', 'Sparkles', 'Shield'].includes(card.icon) && (
                                                <div className="relative h-32 flex items-center justify-center">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                                        transition={{ duration: 2.5, repeat: Infinity }}
                                                        className={`absolute w-20 h-20 rounded-full ${colors.bg} blur-xl`}
                                                    />
                                                    <motion.div
                                                        animate={{ scale: [1, 1.1, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className={`w-14 h-14 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}
                                                    >
                                                        <Icon size={24} className={colors.text} />
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        }
                    })}
                </div>
            </div>
        </section>
    );
};

export default SolutionModules;
