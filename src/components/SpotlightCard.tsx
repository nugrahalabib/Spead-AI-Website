'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';
import { ExternalLink } from 'lucide-react';

export default function SpotlightCard({
    children,
    href,
    index
}: {
    children: React.ReactNode;
    href: string;
    index: number;
}) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
            onMouseMove={handleMouseMove}
            variants={{
                hidden: { opacity: 0, y: 50 },
                show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: index * 0.05
                    }
                }
            }}
        >
            {/* Spotlight Gradient */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(255,255,255,0.1),
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Content Container */}
            <div className="relative flex items-center justify-between w-full z-10">
                {children}

                {/* Sliding Arrow */}
                <ExternalLink
                    size={18}
                    className="text-white/50 transition-all duration-300 transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-white"
                />
            </div>
        </motion.a>
    );
}
