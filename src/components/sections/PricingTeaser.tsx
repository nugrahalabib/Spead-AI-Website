'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingPlan {
    id: number;
    name: string;
    subtitle: string;
    cta_text: string;
    is_popular: boolean;
    sort: number;
}

interface PricingTeaserProps {
    headline: string;
    plans: PricingPlan[];
}

const PricingTeaser = ({ headline, plans }: PricingTeaserProps) => {
    // Fallback
    const items = plans.length > 0 ? plans : [
        { id: 1, name: 'Freemium', subtitle: '1 User. Experience core features.', cta_text: 'Sign Up Free', is_popular: false, sort: 1 },
        { id: 2, name: 'Plus', subtitle: 'For Small Teams (10 Seats).', cta_text: 'Get Started', is_popular: true, sort: 2 },
        { id: 3, name: 'Enterprise', subtitle: 'Unlimited scale & custom AI.', cta_text: 'Contact Sales', is_popular: false, sort: 3 }
    ];

    return (
        <section className="py-32 px-4 md:px-0 bg-[#0A0A0A] border-t border-white/[0.05] relative" id="pricing">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] mask-image-gradient" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-center text-white mb-20 font-display tracking-tight"
                >
                    {headline || "Start Your Firm's Transformation Today."}
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {items.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`p-10 rounded-[32px] flex flex-col transition-all duration-300 relative ${plan.is_popular
                                    ? 'bg-indigo-900/10 border border-indigo-500/50 shadow-[0_0_60px_rgba(79,70,229,0.1)] scale-110 z-10 backdrop-blur-xl'
                                    : 'glass-card hover:bg-white/[0.04]'
                                }`}
                        >
                            {plan.is_popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{plan.name}</h3>
                            <p className="text-neutral-400 mb-8 text-sm leading-relaxed">{plan.subtitle}</p>

                            <button className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${plan.is_popular
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/25 hover:shadow-indigo-500/40'
                                    : 'bg-white text-black hover:bg-neutral-200 shadow-white/10'
                                }`}>
                                {plan.cta_text}
                            </button>

                            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            <div className="flex flex-col gap-4">
                                {["Core Features", "Community Support", "Basic Analytics"].map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm text-neutral-400 font-medium">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.is_popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-neutral-500'}`}>
                                            <Check size={10} strokeWidth={4} />
                                        </div>
                                        {feat}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingTeaser;
