'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, Sparkles, AlertTriangle, Rocket } from 'lucide-react';
import { LandingPage, getAssetUrl } from '@/lib/directus';
import { parseSmartText } from '@/utils/textParser';
import HeroVisuals from '@/components/HeroVisuals';

// --- DEFAULTS (PRESERVED COPYWRITING) ---
const DEFAULTS = {
    badge: "ENTERPRISE V2.0 LIVE",
    headline: "Stop {Burning:violet} Billable Hours on Administrative {Chaos:violet}.",
    subheadline: "The Enterprise Second Brain. Secure. Contextual. Intelligent. Transform your scattered documents into a unified operating system.",
    ctaPrimary: "Start Functioning",
    ctaSecondary: "Book Demo"
};

interface HeroSectionProps {
    data?: Partial<LandingPage> | null;
}

const HeroSection = ({ data }: HeroSectionProps) => {

    // --- DATA RESOLUTION ---
    const badgeText = data?.badge_text || DEFAULTS.badge;
    const badgeStyle = data?.badge_style || 'live_pulse';
    const headline = data?.headline || DEFAULTS.headline;
    const subheadline = data?.subheadline || DEFAULTS.subheadline;
    const ctaPrimary = data?.cta_primary_label || DEFAULTS.ctaPrimary;
    const ctaPrimaryUrl = data?.cta_primary_url || '/register';
    const ctaSecondary = data?.cta_secondary_label || DEFAULTS.ctaSecondary;
    const ctaSecondaryUrl = data?.cta_secondary_url || '/contact';

    // --- BADGE RENDERER ---
    const renderBadgeIcon = () => {
        switch (badgeStyle) {
            case 'ai_sparkle': return <Sparkles size={14} className="text-purple-400 animate-pulse" />;
            case 'beta_warning': return <AlertTriangle size={14} className="text-amber-400" />;
            case 'rocket_launch': return <Rocket size={14} className="text-blue-400" />;
            case 'live_pulse':
            default:
                return (
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                );
        }
    };

    return (
        <section className="relative min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center overflow-hidden bg-[#020617]">

            {/* 1. ATMOSPHERE BACKGROUND */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />

            {/* Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/20 blur-[100px] rounded-full animate-pulse-slow pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-900/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto text-center mb-16">

                {/* 2. BADGE */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-slate-200 text-sm font-medium mb-8 shadow-2xl select-none hover:bg-white/10 transition-colors"
                >
                    {renderBadgeIcon()}
                    <span className="translate-y-[1px]">{badgeText}</span>
                </motion.div>

                {/* 3. HEADLINE (Smart Parsed) */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold font-[family-name:var(--font-display)] tracking-tight mb-6 leading-[1.1] text-white"
                >
                    {parseSmartText(headline)}
                </motion.h1>

                {/* 4. SUBHEADLINE */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed"
                >
                    {subheadline}
                </motion.p>

                {/* 5. CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href={ctaPrimaryUrl} passHref>
                        <button className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden flex items-center gap-2">
                            <span className="relative z-10 flex items-center gap-2">{ctaPrimary} <ArrowRight size={18} /></span>
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                        </button>
                    </Link>

                    <Link href={ctaSecondaryUrl} passHref>
                        <button className="px-8 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-lg transition-colors flex items-center gap-2">
                            <Play size={16} fill="white" /> {ctaSecondary}
                        </button>
                    </Link>
                </motion.div>
            </div>

            {/* 6. VISUAL COMPONENT */}
            <HeroVisuals
                image={data?.hero_image}
                variant={data?.visual_variant}
            />

        </section>
    );
};

export default HeroSection;
