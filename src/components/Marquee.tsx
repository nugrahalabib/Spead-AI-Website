'use client';

import { motion } from 'framer-motion';

const Marquee = () => {
    const text = "PRODUCT STRATEGY • PROMPT ENGINEERING • NEXT.JS • INFRASTRUCTURE • MARKET ANALYSIS • CRISIS MANAGEMENT • ";

    return (
        <section className="py-10 overflow-hidden bg-[#050505] border-y border-white/5 relative z-10">
            <div className="flex whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear",
                    }}
                    className="flex gap-4"
                >
                    {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 font-[family-name:var(--font-outfit)] tracking-tighter opacity-50">
                            {text}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Marquee;
