'use client';

import { motion } from 'framer-motion';

interface ImpactSectionProps {
    data: {
        roi_headline?: string;
        roi_metric_1_label?: string;
        roi_metric_1_before?: string;
        roi_metric_1_after?: string;
        roi_metric_2_label?: string;
        roi_metric_2_before?: string;
        roi_metric_2_after?: string;
    };
}

const ImpactSection = ({ data }: ImpactSectionProps) => {
    return (
        <section className="py-32 px-4 md:px-0 bg-[#030014] relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-20 items-center relative z-10">

                {/* Text Content */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-6 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-xs font-semibold text-green-400 uppercase tracking-widest"
                    >
                        Measurable Results
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold text-white mb-12 tracking-tighter font-display leading-[1.1]"
                    >
                        {data?.roi_headline || "Not Just Claims. Quantifiable Impact."}
                    </motion.h2>

                    <div className="space-y-10">
                        {/* Metric 1 */}
                        <div>
                            <h3 className="text-xl text-white mb-4 font-semibold tracking-tight">{data?.roi_metric_1_label || "Document Creation"}</h3>
                            <div className="bg-white/[0.03] rounded-full h-16 relative overflow-hidden flex items-center border border-white/[0.08] backdrop-blur-sm">
                                {/* Before Bar */}
                                <div className="absolute left-0 top-0 bottom-0 bg-white/[0.05] w-full flex items-center px-6 text-neutral-500 text-xs font-mono tracking-widest">
                                    MANUAL: {data?.roi_metric_1_before || "5 HOURS"}
                                </div>
                                {/* After Bar (Animated) */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '15%' }} // Drastically smaller to show impact
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-500 to-emerald-400 z-10 flex items-center px-4 shadow-[0_0_30px_rgba(34,197,94,0.3)] border-r border-white/20"
                                >
                                    <span className="text-black font-extrabold whitespace-nowrap text-xs tracking-wide">SPEAD: {data?.roi_metric_1_after || "15 MINS"}</span>
                                </motion.div>
                            </div>
                            <p className="mt-3 text-green-400 text-sm font-bold flex items-center gap-2 tracking-wide">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                95% Faster Completion.
                            </p>
                        </div>

                        {/* Metric 2 */}
                        <div>
                            <h3 className="text-xl text-white mb-4 font-semibold tracking-tight">{data?.roi_metric_2_label || "Decision Making"}</h3>
                            <div className="bg-white/[0.03] rounded-full h-16 relative overflow-hidden flex items-center border border-white/[0.08] backdrop-blur-sm">
                                {/* Before Bar */}
                                <div className="absolute left-0 top-0 bottom-0 bg-white/[0.05] w-full flex items-center px-6 text-neutral-500 text-xs font-mono tracking-widest">
                                    MANUAL: {data?.roi_metric_2_before || "2 HOURS"}
                                </div>
                                {/* After Bar (Animated) */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '25%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "circOut", delay: 0.4 }}
                                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-500 to-emerald-400 z-10 flex items-center px-4 shadow-[0_0_30px_rgba(34,197,94,0.3)] border-r border-white/20"
                                >
                                    <span className="text-black font-extrabold whitespace-nowrap text-xs tracking-wide">SPEAD: {data?.roi_metric_2_after || "20 MINS"}</span>
                                </motion.div>
                            </div>
                            <p className="mt-3 text-green-400 text-sm font-bold flex items-center gap-2 tracking-wide">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                83% Faster & Unbiased.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Visual (Strict Glass Card) */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="h-full min-h-[500px] glass-card rounded-[40px] relative flex items-center justify-center p-12 overflow-hidden group"
                >
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-indigo-500/5 opacity-50" />

                    {/* Abstract ROI viz */}
                    <div className="relative z-10 text-center scale-110 group-hover:scale-125 transition-transform duration-1000 ease-in-out">
                        <div className="text-[140px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 font-display tracking-tighter drop-shadow-2xl">
                            10x
                        </div>
                        <div className="text-3xl text-green-400 font-bold tracking-[0.2em] uppercase mt-2">ROI Multiplier</div>
                    </div>

                    {/* Decorative Rings */}
                    <div className="absolute w-[300px] h-[300px] border border-white/10 rounded-full animate-spin-slow opacity-30" />
                    <div className="absolute w-[400px] h-[400px] border border-dashed border-white/5 rounded-full animate-reverse-spin opacity-20" />

                    {/* Hover Shimmer */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-shimmer" />
                </motion.div>

            </div>
        </section>
    );
};

export default ImpactSection;
