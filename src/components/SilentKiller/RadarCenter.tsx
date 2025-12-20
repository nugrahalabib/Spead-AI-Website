'use client';

import React from 'react';

const RadarCenter = () => {
    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            {/* 1. Pulsing Rings (Sonar Effect) */}
            <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-[ping_3s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-purple-500/50 animate-[ping_3s_linear_infinite_1s]" />

            {/* 2. Static Core */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-[#0F172A] border border-purple-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                <div className="text-center">
                    <div className="text-[10px] text-purple-400 font-bold tracking-widest uppercase mb-0.5">System</div>
                    <div className="text-xs text-white font-bold tracking-widest uppercase">Diagnosis</div>
                </div>
            </div>

            {/* 3. Rotating Scanner Line */}
            <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_4s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-purple-500 blur-sm" />
            </div>
        </div>
    );
};

export default RadarCenter;
