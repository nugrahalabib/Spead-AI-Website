import React from 'react';

interface MiniChartProps {
    type: 'bar_chart_decline' | 'radial_progress' | 'alert_box' | string;
    color?: 'rose' | 'amber' | 'violet' | string;
}

const MiniCharts = ({ type, color = 'rose' }: MiniChartProps) => {

    // --- 1. BAR CHART DECLINE (Loss Visualization) ---
    if (type === 'bar_chart_decline') {
        return (
            <div className="flex items-end gap-2 h-16 w-full">
                {/* 3 Rising bars */}
                <div className="w-1/4 h-[60%] bg-slate-700/50 rounded-sm" />
                <div className="w-1/4 h-[80%] bg-slate-700/50 rounded-sm" />
                <div className="w-1/4 h-[100%] bg-slate-700/50 rounded-sm" />
                {/* The "Killer" Drop */}
                <div className={`w-1/4 h-[40%] bg-${color}-500 rounded-sm animate-pulse relative group`}>
                    <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-${color}-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>-40%</div>
                </div>
            </div>
        );
    }

    // --- 2. RADIAL PROGRESS (Time Drain) ---
    if (type === 'radial_progress') {
        return (
            <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    {/* Background Circle */}
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
                    {/* Progress Circle (40%) */}
                    <circle
                        cx="32" cy="32" r="28"
                        stroke="currentColor" strokeWidth="4"
                        className={`text-${color}-500`}
                        fill="transparent"
                        strokeDasharray="175.9" // 2 * PI * 28
                        strokeDashoffset="105" // 40% filled
                        strokeLinecap="round"
                    />
                </svg>
                <div className={`absolute text-xs font-bold text-${color}-400`}>40%</div>
            </div>
        );
    }

    // --- 3. ALERT BOX (Liability) ---
    if (type === 'alert_box') {
        return (
            <div className={`w-full h-16 rounded-lg bg-${color}-500/10 border border-${color}-500/30 flex flex-col items-center justify-center gap-1 overflow-hidden relative`}>
                {/* Glitch Effect Background */}
                <div className={`absolute inset-0 bg-${color}-500/5 animate-pulse`} />
                <div className={`text-${color}-500 font-bold text-xs tracking-widest`}>WARNING</div>
                <div className={`text-[10px] text-${color}-400/80`}>HUMAN ERROR</div>
                {/* Scanline */}
                <div className="absolute top-0 w-full h-[1px] bg-white/10 animate-[scan_2s_linear_infinite]" />
            </div>
        );
    }

    return null;
};

export default MiniCharts;
