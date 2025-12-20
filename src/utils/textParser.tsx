import React from 'react';

// Maps color names to Tailwind Gradient Classes
const COLOR_MAP: Record<string, string> = {
    // Original colors
    purple: 'from-purple-400 to-pink-600',
    violet: 'from-violet-400 to-fuchsia-600',
    blue: 'from-blue-400 to-cyan-400',
    cyan: 'from-cyan-400 to-teal-400',
    green: 'from-emerald-400 to-green-500',
    orange: 'from-amber-400 to-orange-600',
    red: 'from-rose-400 to-red-600',
    gold: 'from-yellow-300 to-amber-500',
    white: 'from-white to-slate-200',
    silver: 'from-slate-100 to-slate-400',
    gray: 'from-slate-400 to-slate-600',
    dark: 'from-slate-700 to-black',
    // Extended colors
    amber: 'from-amber-300 to-yellow-500',
    yellow: 'from-yellow-300 to-amber-500',
    rose: 'from-rose-400 to-pink-500',
    pink: 'from-pink-400 to-rose-500',
    fuchsia: 'from-fuchsia-400 to-purple-500',
    teal: 'from-teal-400 to-cyan-500',
    emerald: 'from-emerald-400 to-teal-500',
    indigo: 'from-indigo-400 to-blue-500',
    sky: 'from-sky-400 to-blue-500',
    lime: 'from-lime-400 to-green-500',
    slate: 'from-slate-300 to-slate-500',
};

/**
 * Parses a string containing {Text:Color} syntax and returns React Nodes.
 * Example: "Stop {Burning:purple} Billable Hours"
 */
export const parseSmartText = (text: string | null | undefined): React.ReactNode => {
    if (!text) return null;

    // Regex to find {Word:Color}
    const regex = /\{([^:]+):([a-z]+)\}/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Push text before the match
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        // Push the colored span
        const content = match[1];
        const colorKey = match[2].toLowerCase();
        const gradientClass = COLOR_MAP[colorKey] || COLOR_MAP['purple']; // Fallback to purple

        parts.push(
            <span key={match.index} className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}`}>
                {content}
            </span>
        );

        lastIndex = regex.lastIndex;
    }

    // Push remaining text
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return <>{parts}</>;
};
