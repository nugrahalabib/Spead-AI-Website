'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Server, Key, Eye, ShieldCheck, Fingerprint, Cloud, Database, LucideIcon } from 'lucide-react';
import { SecuritySettings, SecurityFeature } from '@/lib/directus';
import { parseSmartText } from '@/utils/textParser';

// Icon Map
const IconMap: Record<string, LucideIcon> = {
    Shield, Lock, Server, Key, Eye, ShieldCheck, Fingerprint, Cloud, Database
};

// Theme Color Map - DARK MODE ONLY
const ThemeColorMap: Record<string, {
    text: string;
    bg: string;
    border: string;
    glow: string;
    gradient: string;
}> = {
    teal: {
        text: 'text-[#14B8A6]',
        bg: 'bg-[#14B8A6]/10',
        border: 'border-[#14B8A6]/30',
        glow: 'bg-[#14B8A6]/20',
        gradient: 'from-transparent via-[#0f2e2a]/30 to-transparent'
    },
    cyan: {
        text: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        glow: 'bg-cyan-500/20',
        gradient: 'from-transparent via-cyan-950/30 to-transparent'
    },
    emerald: {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        glow: 'bg-emerald-500/20',
        gradient: 'from-transparent via-emerald-950/30 to-transparent'
    },
    blue: {
        text: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        glow: 'bg-blue-500/20',
        gradient: 'from-transparent via-blue-950/30 to-transparent'
    },
    purple: {
        text: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        glow: 'bg-purple-500/20',
        gradient: 'from-transparent via-purple-950/30 to-transparent'
    },
    indigo: {
        text: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/30',
        glow: 'bg-indigo-500/20',
        gradient: 'from-transparent via-indigo-950/30 to-transparent'
    }
};

// Defaults
const defaultSettings = {
    badge_text: 'Bank-Grade Security',
    theme_color: 'teal',
    headline: 'Your Data. Your Infrastructure. {Zero Compromises.:teal}',
    description: 'We deploy Spead AI directly onto your private cloud or on-premise servers. Your data never leaves your perimeter, ensuring 100% compliance with enterprise standards.'
};

const defaultFeatures = [
    { id: 1, sort: 1, status: 'published' as const, title: 'On-Premise Deployment', subtitle: 'Docker & Kubernetes Ready', icon: 'Server' },
    { id: 2, sort: 2, status: 'published' as const, title: 'Model Armor', subtitle: 'PII Redaction & Injection Protection', icon: 'Shield' }
];

interface SecuritySectionProps {
    settings?: SecuritySettings | null;
    features?: SecurityFeature[];
}

const SecuritySection = ({ settings, features = [] }: SecuritySectionProps) => {
    // Use Directus data or defaults
    const badge = settings?.badge_text || defaultSettings.badge_text;
    const headline = settings?.headline || defaultSettings.headline;
    const description = settings?.description || defaultSettings.description;
    const themeColor = settings?.theme_color || defaultSettings.theme_color;

    // Get theme colors
    const theme = ThemeColorMap[themeColor] || ThemeColorMap.teal;

    // Filter published features
    const publishedFeatures = features.filter(f => f.status === 'published');
    const displayFeatures = publishedFeatures.length > 0 ? publishedFeatures : defaultFeatures;

    return (
        <section id="security" className="relative py-32 px-6 z-10 overflow-hidden bg-transparent">
            {/* Background Gradient for this section only */}
            <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} pointer-events-none`} />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

                {/* Visual Side - Premium Animation */}
                <div className="lg:col-span-5 relative h-[500px] flex items-center justify-center">
                    <div className={`absolute w-[500px] h-[500px] ${theme.glow} blur-[100px] rounded-full`} />

                    <div className={`relative z-10 w-80 h-96 glass-premium ${theme.border} rounded-[3rem] flex items-center justify-center overflow-hidden bg-white/5 shadow-none`}>
                        {/* Grid Background */}
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

                        {/* Orbiting Rings */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className={`absolute w-64 h-64 rounded-full border ${theme.border} opacity-30`}
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className={`absolute w-48 h-48 rounded-full border ${theme.border} opacity-40`}
                        />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className={`absolute w-32 h-32 rounded-full border ${theme.border} opacity-50`}
                        />

                        {/* Orbiting Particles */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute w-56 h-56"
                        >
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 ${theme.bg} rounded-full shadow-lg`} />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            className="absolute w-40 h-40"
                        >
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 ${theme.bg} rounded-full shadow-lg`} />
                            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 ${theme.bg} rounded-full shadow-lg`} />
                        </motion.div>

                        {/* Center Shield */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-20"
                        >
                            <Shield size={100} className={`${theme.text} drop-shadow-[0_0_40px_rgba(20,184,166,0.6)]`} />
                        </motion.div>

                        {/* Scanning Line */}
                        <motion.div
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className={`absolute left-4 right-4 h-0.5 ${theme.bg} shadow-[0_0_20px_currentColor] opacity-60 z-30`}
                        />

                        {/* Data Streams */}
                        <div className="absolute inset-0 flex flex-col justify-between p-8 opacity-30 z-10">
                            <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className={`w-full h-px bg-gradient-to-r from-transparent ${theme.text.replace('text-', 'via-')} to-transparent`} />
                            <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className={`w-full h-px bg-gradient-to-r from-transparent ${theme.text.replace('text-', 'via-')} to-transparent`} />
                            <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className={`w-full h-px bg-gradient-to-r from-transparent ${theme.text.replace('text-', 'via-')} to-transparent`} />
                        </div>

                        {/* Corner Accents */}
                        <div className={`absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 ${theme.border} opacity-50`} />
                        <div className={`absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 ${theme.border} opacity-50`} />
                        <div className={`absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 ${theme.border} opacity-50`} />
                        <div className={`absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 ${theme.border} opacity-50`} />
                    </div>
                </div>

                {/* Text Side */}
                <div className="lg:col-span-7">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${theme.border} ${theme.bg} ${theme.text} text-xs font-bold uppercase tracking-widest mb-6`}>
                        <Lock size={12} />
                        {badge}
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-6 text-white leading-tight">
                        {parseSmartText(headline)}
                    </h2>

                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        {description}
                    </p>

                    <div className="flex flex-col gap-4">
                        {displayFeatures.map((feature) => {
                            const FeatureIcon = IconMap[feature.icon] || Shield;
                            return (
                                <div key={feature.id} className={`flex items-center gap-4 p-4 rounded-xl glass-premium border-l-4 border-l-${themeColor}-500 bg-white/5 border border-white/10 shadow-none`}>
                                    <FeatureIcon className={`${theme.text}`} />
                                    <div>
                                        <h4 className="text-white font-bold">{feature.title}</h4>
                                        <p className="text-xs text-slate-400">{feature.subtitle}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default SecuritySection;
