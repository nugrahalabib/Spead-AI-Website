'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { getAssetUrl } from '@/lib/directus';

interface HeroVisualsProps {
    image?: string | null;
    variant?: 'interactive_3d' | 'static_glass' | 'flat_modern' | string;
    showWidgets?: boolean;
}

const HeroVisuals = ({ image, variant = 'interactive_3d', showWidgets = true }: HeroVisualsProps) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // --- PREMIUM PHYSICS ENGINE ---
    // Heavier damping for "expensive" feel.
    // Wider range for more dramatic 3D effect.
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [20, -20]), { stiffness: 60, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), { stiffness: 60, damping: 20 });

    // PARALLAX LAYERS (The secret to 3D depth)
    // Widgets move opposite gravity to feel like they are floating above
    const widgetX = useSpring(useTransform(x, [-0.5, 0.5], [25, -25]), { stiffness: 50, damping: 20 });
    const widgetY = useSpring(useTransform(y, [-0.5, 0.5], [25, -25]), { stiffness: 50, damping: 20 });

    // DYNAMIC SHEEN (Light reflection moves across glass)
    const sheenX = useTransform(x, [-0.5, 0.5], ['0%', '150%']); // Sweeps across
    const sheenOpacity = useTransform(y, [-0.5, 0.5], [0.1, 0.3]); // Brighter when tilted up

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (variant !== 'interactive_3d') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set((mouseX / width) - 0.5);
        y.set((mouseY / height) - 0.5);
    };

    const handleMouseLeave = () => {
        if (variant !== 'interactive_3d') return;
        x.set(0);
        y.set(0);
    };

    // Construct Image URL
    const imageUrl = image ? `${getAssetUrl(image)}?width=1200` : null;

    // Variant Styles
    const isFlat = variant === 'flat_modern';
    const isInteractive = variant === 'interactive_3d';

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={isInteractive ? {
                rotateX,
                rotateY,
                perspective: 1200, // Slightly higher for less distortion, more class
                transformStyle: 'preserve-3d'
            } : {}}
            className={`relative w-full max-w-6xl mx-auto z-20 cursor-pointer p-10 select-none`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            {/* 3D TRANSFORM CONTAINER */}
            <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* 1. MAIN DASHBOARD SLAB */}
                {/* This is the "Glass" container */}
                <div className={`
                    relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden transition-all duration-500
                    ${isFlat
                        ? 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl'
                        : 'bg-[#1e293b]/80 dark:bg-[#0B0F19]/80 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]'
                    }
                `}>

                    {/* THICKNESS BORDERS (Subtle Stacked Borders for 3D feel) */}
                    <div className="absolute inset-0 rounded-3xl border-[3px] border-white/5 pointer-events-none z-20" />
                    <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none z-20 scale-[0.99]" />

                    {/* CONTENT LAYER */}
                    {imageUrl ? (
                        <div className="absolute inset-0 w-full h-full">
                            <img src={imageUrl} alt="Dashboard" className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 ${isFlat ? 'bg-black/0' : 'bg-gradient-to-t from-black/50 to-transparent'}`} />
                        </div>
                    ) : (
                        /* RESTORED 3D DASHBOARD UI (The one you liked) */
                        <div className="absolute inset-0 flex select-none">
                            {/* Sidebar */}
                            <div className="w-20 h-full border-r border-white/5 bg-slate-900/40 flex flex-col items-center py-6 gap-6">
                                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.2)]"><div className="w-4 h-4 bg-current rounded-full" /></div>
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><div className="w-5 h-5 bg-slate-600 rounded-full opacity-50" /></div>
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><div className="w-5 h-5 bg-slate-600 rounded-full opacity-50" /></div>
                                <div className="mt-auto w-10 h-10 rounded-full bg-slate-800" />
                            </div>

                            {/* Right Area */}
                            <div className="flex-1 flex flex-col bg-[#020617]/40">
                                {/* Header */}
                                <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="text-slate-500 text-sm">/ Enterprise / Contracts</div>
                                        <div className="h-4 w-px bg-white/10" />
                                        <div className="text-white text-sm font-medium">Q4_Audit_Report_Final</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live Generation
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 p-8 grid grid-cols-3 gap-8 overflow-hidden">
                                    {/* Text Generation Column */}
                                    <div className="col-span-2 space-y-4">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">AI</div>
                                            <div className="text-slate-400 text-sm animate-pulse">Analyzing compliance...</div>
                                        </div>

                                        <div className="space-y-3 opacity-90">
                                            <div className="h-4 w-full bg-slate-800/80 rounded" />
                                            <div className="h-4 w-11/12 bg-slate-800/80 rounded" />
                                            <div className="h-4 w-4/5 bg-slate-800/80 rounded" />

                                            <div className="h-24 w-full bg-slate-800/40 rounded border border-white/5 mt-4 p-4 flex gap-4">
                                                <div className="w-12 h-12 bg-slate-700/50 rounded" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-3 w-1/2 bg-slate-700/50 rounded" />
                                                    <div className="h-3 w-3/4 bg-slate-700/30 rounded" />
                                                    <div className="h-3 w-3/4 bg-slate-700/30 rounded" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Graph / Stats Column */}
                                    <div className="col-span-1 space-y-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 h-48 relative overflow-hidden group">
                                            <div className="text-xs text-slate-500 uppercase mb-2">Efficiency Velocity</div>
                                            <div className="text-3xl font-bold text-white mb-2">94.2%</div>
                                            {/* Gradient Fill */}
                                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-600/10 to-transparent" />
                                            {/* Neon Graph Line */}
                                            <svg className="absolute bottom-0 left-0 right-0 w-full h-24 text-emerald-500" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                <path d="M0 40 Q 30 38, 50 20 T 100 2 V 40 H 0" fill="currentColor" fillOpacity="0.1" />
                                                <path d="M0 40 Q 30 38, 50 20 T 100 2" fill="none" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC LIGHTING / SHEEN (The "Expensive" Layer) */}
                    {!isFlat && (
                        <motion.div
                            style={{
                                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.0) 50%)',
                                x: sheenX,
                                opacity: sheenOpacity
                            }}
                            className="absolute -inset-[100%] w-[300%] h-[300%] pointer-events-none z-30"
                        />
                    )}
                </div>

                {/* 2. FLOATING WIDGETS (Real 3D separation - Z Axis Pushed) */}
                {!isFlat && showWidgets && (
                    <>
                        <motion.div
                            style={{ x: widgetX, y: widgetY, z: 80 }} // Pushes items towards camera 80px
                            className="absolute -left-6 top-1/3 z-40 hidden md:block" // Hidden on mobile
                        >
                            <div className="p-4 rounded-xl bg-[#0f172a]/95 backdrop-blur-xl border border-teal-500/30 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-3 w-64 transform transition-transform hover:scale-105">
                                <div className="p-2.5 rounded-lg bg-teal-500/20 text-teal-400"><ShieldCheck size={20} /></div>
                                <div>
                                    <div className="text-white font-bold text-sm">Enterprise Grade</div>
                                    <div className="text-[10px] text-teal-400/80">SOC2 Type II Compliant</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ x: widgetX, y: widgetY, z: 120 }} // Pushes even further 120px
                            className="absolute -right-6 bottom-1/4 z-40 hidden md:block"
                        >
                            <div className="p-4 rounded-xl bg-[#0f172a]/95 backdrop-blur-xl border border-violet-500/30 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-3 w-56 transform transition-transform hover:scale-105">
                                <div className="p-2.5 rounded-lg bg-violet-600/20 text-violet-400"><Zap size={20} /></div>
                                <div>
                                    <div className="text-white font-bold text-2xl leading-none">87%</div>
                                    <div className="text-[10px] text-violet-400/80 uppercase tracking-wider font-semibold">Faster</div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

export default HeroVisuals;
