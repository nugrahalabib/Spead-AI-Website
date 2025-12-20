'use client';

import { motion } from 'framer-motion';
import { Layers, Shield, Zap, Headphones } from 'lucide-react';

const features = [
    {
        icon: Layers,
        color: "bg-violet-600",
        title: "Seamless Connect",
        desc: "Integrate with 100+ enterprise data sources instantly."
    },
    {
        icon: Shield,
        color: "bg-fuchsia-600",
        title: "Bank Security",
        desc: "On-premise deployment with role-based access control."
    },
    {
        icon: Zap,
        color: "bg-indigo-600",
        title: "Fast Processing",
        desc: "RAG pipelines optimized for millisecond latency."
    },
    {
        icon: Headphones,
        color: "bg-cyan-600",
        title: "24/7 Support",
        desc: "Dedicated enterprise success team for your deployment."
    }
];

const BottomFeatures = () => {
    return (
        <section className="relative py-20 px-6 z-10">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-20">
                    <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-neutral-300 mb-6">
                        Our Speciality
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] leading-tight">
                        Complete Solutions <br />
                        <span className="text-neutral-300">for your Enterprise</span>
                    </h2>
                    <p className="text-neutral-500 mt-4 text-sm max-w-lg mx-auto">
                        Spead AI provides secure, scalable, and self-hosted AI infrastructure for the modern firm.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card bg-[#1a0b2e] rounded-3xl p-8 text-center border border-white/5 hover:border-violet-500/30 transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                            <div className="relative mx-auto w-20 h-20 rounded-full bg-[#2e1065] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center shadow-lg shadow-violet-500/20`}>
                                    <item.icon size={24} className="text-white" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default BottomFeatures;
