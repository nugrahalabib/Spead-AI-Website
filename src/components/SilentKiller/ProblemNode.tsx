'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Info, AlertCircle, Clock, DollarSign } from 'lucide-react';
import MiniCharts from '@/components/charts/MiniCharts';

interface ProblemNodeProps {
    position: 'top-left' | 'top-right' | 'bottom-center' | string; // Simple string for class mapping
    color: 'rose' | 'amber' | 'violet';
    data: {
        badge?: string;
        title?: string;
        subtitle?: string;
        chartType?: string;
        bullets?: string[] | string | null;
    };
}

// Helper to safely parse bullets
const parseBullets = (bullets: string[] | string | null | undefined): string[] => {
    if (!bullets) return [];
    if (Array.isArray(bullets)) return bullets;
    if (typeof bullets === 'string') {
        try {
            const parsed = JSON.parse(bullets);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [bullets]; // If it's just a plain string, use as single bullet
        }
    }
    return [];
};

const ProblemNode = ({ position, color, data }: ProblemNodeProps) => {

    const bulletList = parseBullets(data.bullets);

    const isLeft = position === 'top-left';
    const isRight = position === 'top-right';
    const isBottom = position === 'bottom-center';

    // Map Colors
    const colorClasses = {
        rose: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
        amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        violet: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    };

    const iconColor = {
        rose: 'text-rose-500',
        amber: 'text-amber-500',
        violet: 'text-violet-500'
    };

    const borderColor = {
        rose: 'border-rose-500/50',
        amber: 'border-amber-500/50',
        violet: 'border-violet-500/50'
    };

    return (
        <div className="group relative flex flex-col items-center justify-center cursor-pointer">

            {/* 1. THE NODE (Visual Anchor) */}
            <div className={`w-12 h-12 rounded-full border-2 ${borderColor[color]} bg-[#0B0F19] z-10 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300 relative`}>
                <div className={`w-3 h-3 rounded-full ${color === 'rose' ? 'bg-rose-500' : color === 'amber' ? 'bg-amber-500' : 'bg-violet-500'} animate-pulse`} />
                {/* Ring Ripple */}
                <div className={`absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20`} />
            </div>

            {/* 2. LABEL (Always Visible) */}
            <div className={`absolute ${isBottom ? 'top-14' : 'bottom-14'} flex flex-col items-center text-center w-40 z-20 pointer-events-none`}>
                <div className={`text-[10px] font-bold tracking-widest ${iconColor[color]} uppercase mb-1`}>{data.badge}</div>
                <div className="text-2xl font-bold text-white leading-none mb-1">{data.title}</div>
                <div className="text-xs text-slate-500 uppercase">{data.subtitle}</div>
            </div>

            {/* 3. HOVER CARD (Glass Reveal) */}
            <div className={`
                absolute z-30 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto
                ${isLeft ? 'left-14 top-0 origin-left' : ''}
                ${isRight ? 'right-14 top-0 origin-right' : ''}
                ${isBottom ? 'bottom-16 origin-bottom' : ''}
                w-64 p-5 rounded-xl bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 shadow-2xl
            `}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                    <div className={`p-1.5 rounded-lg ${colorClasses[color]}`}>
                        {color === 'rose' && <DollarSign size={16} />}
                        {color === 'amber' && <Clock size={16} />}
                        {color === 'violet' && <AlertCircle size={16} />}
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 uppercase font-semibold">Diagnosis</div>
                        <div className="text-sm font-bold text-white">{data.badge}</div>
                    </div>
                </div>

                {/* Chart Visual */}
                <div className="mb-4 flex justify-center">
                    <MiniCharts type={data.chartType || 'bar_chart_decline'} color={color} />
                </div>

                {/* Bullets */}
                <ul className="space-y-2">
                    {bulletList.map((bullet, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className={`mt-1 w-1 h-1 rounded-full ${color === 'rose' ? 'bg-rose-500' : color === 'amber' ? 'bg-amber-500' : 'bg-violet-500'}`} />
                            {bullet}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

export default ProblemNode;
