'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, Rocket, Star } from 'lucide-react';
import { PricingHeader, PricingPlan } from '@/lib/directus';

// Default values (fallback if Directus fails)
const defaultHeader: PricingHeader = {
    headline: 'Unlock Luxury Access',
    subtitle: 'Unlock exclusive access to advanced AI tools tailored for you.',
    toggle_monthly_label: 'Monthly',
    toggle_yearly_label: 'Yearly',
    discount_percentage: 20,
    trust_badge_text: 'Trusted by 500+ Luxury Brands'
};

const defaultPlans: PricingPlan[] = [
    { id: 1, sort: 1, status: 'published', name: 'Freemium', color: 'cyan', is_popular: false, is_free: true, is_contact: false, price_monthly: 0, seat_limit: '1 Seat', description: 'Free forever package for one user to try core features.', features: ['Basic AI Assistant Access', '5 documents per month', '500MB Storage', 'Community Support', 'Basic Search Feature'], button_label: 'Start for Free', button_url: '/booking' },
    { id: 2, sort: 2, status: 'published', name: 'Plus', color: 'blue', is_popular: false, is_free: false, is_contact: false, price_monthly: 3990000, seat_limit: '10 Seats', description: 'Paid package for teams and startups needing more credits.', features: ['All Freemium features', 'Up to 10 team members', '100 documents per month', '10GB Storage', 'Priority Email Support', 'Basic Team Analytics', 'Google Drive Integration'], button_label: 'Select Plus', button_url: '/booking' },
    { id: 3, sort: 3, status: 'published', name: 'Pro', color: 'purple', is_popular: true, is_free: false, is_contact: false, price_monthly: 8990000, seat_limit: '25 Seats', description: 'Most popular option for medium businesses with AI customization and admin.', features: ['All Plus features', 'Up to 25 team members', 'Unlimited documents', '100GB Storage', 'Custom AI Models', 'Complete Admin Management', 'API Access', '24/7 Priority Support', 'Exclusive Training'], button_label: 'Select Pro', button_url: '/booking' },
    { id: 4, sort: 4, status: 'published', name: 'Enterprise', color: 'indigo', is_popular: false, is_free: false, is_contact: false, price_monthly: 15000000, seat_limit: '50 Seats', description: 'Complete solution for large organizations needing many users and analytics.', features: ['All Pro features', 'Up to 50 team members', '500GB Storage', 'SSO & SAML', 'Complete Audit Logs', '99.9% Uptime SLA', 'Dedicated Account Manager', 'Custom Integrations', 'Compliance Reports', 'Multi-workspace'], button_label: 'Select Enterprise', button_url: '/booking' },
    { id: 5, sort: 5, status: 'published', name: 'Custom', color: 'amber', is_popular: false, is_free: false, is_contact: true, price_monthly: 0, seat_limit: 'Unlimited', description: 'Fully customized package for specific needs, including on-premise.', features: ['All Enterprise features', 'Unlimited team members', 'Unlimited storage', 'On-premise deployment', 'Custom AI training', 'White-label option', 'Dedicated infrastructure', 'Custom SLA', 'Source code escrow', '24/7 phone support'], button_label: 'Contact Sales', button_url: '/booking' }
];

interface PricingSectionProps {
    header?: PricingHeader | null;
    plans?: PricingPlan[];
}

const PricingSection = ({ header, plans = [] }: PricingSectionProps) => {
    const [isYearly, setIsYearly] = useState(false);

    // Use Directus data or defaults
    const h = header || defaultHeader;
    const publishedPlans = plans.filter(p => p.status === 'published');
    const displayPlans = publishedPlans.length > 0 ? publishedPlans : defaultPlans;
    const discountMultiplier = (100 - h.discount_percentage) / 100;

    // Color configurations - EXACT same as original design
    const getColorClasses = (color: string, is_popular: boolean) => {
        const configs: Record<string, { card: string; check: string; badge: string }> = {
            cyan: {
                card: "bg-slate-900/60 border-cyan-500/30 hover:border-cyan-500/50",
                check: "bg-cyan-500/20 text-cyan-400",
                badge: "bg-cyan-500"
            },
            blue: {
                card: "bg-slate-900/60 border-blue-500/30 hover:border-blue-500/50",
                check: "bg-blue-500/20 text-blue-400",
                badge: "bg-blue-500"
            },
            purple: {
                card: is_popular
                    ? "bg-gradient-to-b from-purple-900/60 to-slate-900/90 border-purple-500/60 shadow-[0_0_60px_-15px_rgba(168,85,247,0.4)] z-20 scale-[1.02]"
                    : "bg-slate-900/60 border-purple-500/30 hover:border-purple-500/50",
                check: "bg-purple-500/20 text-purple-400",
                badge: "bg-purple-500"
            },
            indigo: {
                card: "bg-slate-900/60 border-indigo-500/30 hover:border-indigo-500/50",
                check: "bg-indigo-500/20 text-indigo-400",
                badge: "bg-indigo-500"
            },
            amber: {
                card: "bg-gradient-to-b from-amber-900/40 to-slate-900/90 border-amber-500/30 hover:border-amber-500/50",
                check: "bg-amber-500/20 text-amber-400",
                badge: "bg-amber-500"
            }
        };
        return configs[color] || configs.blue;
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'Free';
        if (price < 0) return 'Contact Us';
        const inK = Math.round(price / 1000);
        return `IDR ${inK.toLocaleString('en-US')}K`;
    };

    const calculateValues = (plan: PricingPlan) => {
        if (plan.is_free) {
            return { display: 'Free', original: null, savings: null };
        }
        if (plan.is_contact) {
            return { display: 'Contact Us', original: null, savings: null };
        }

        const monthlyPrice = plan.price_monthly;
        const yearlyTotal = monthlyPrice * 12 * discountMultiplier;
        const yearlyPricePerMonth = yearlyTotal / 12;

        if (isYearly) {
            const savingsAmount = (monthlyPrice * 12) - yearlyTotal;
            return {
                display: formatPrice(yearlyPricePerMonth),
                original: formatPrice(monthlyPrice),
                savings: savingsAmount > 0 ? formatPrice(savingsAmount) : null
            };
        }

        return {
            display: formatPrice(monthlyPrice),
            original: null,
            savings: null
        };
    };

    // Parse features (handle both array and string)
    const parseFeatures = (features: string[] | string): string[] => {
        if (Array.isArray(features)) return features;
        if (typeof features === 'string') {
            try {
                return JSON.parse(features);
            } catch {
                return features.split(',').map(s => s.trim());
            }
        }
        return [];
    };

    return (
        <section id="pricing" className="relative py-32 z-10 overflow-hidden bg-[#020617]">
            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase mb-6 font-[family-name:var(--font-display)]">
                        {h.headline}
                    </h2>
                    <p className="text-slate-400 text-lg mb-8 font-light tracking-wide">
                        {h.subtitle}
                    </p>

                    {/* Billing Toggle */}
                    <div className="relative inline-flex items-center p-1 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${!isYearly
                                ? 'bg-white text-slate-900 shadow-md'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {h.toggle_monthly_label}
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${isYearly
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {h.toggle_yearly_label}
                            {/* Discount Badge */}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors duration-300 ${isYearly
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-slate-700 text-slate-500'
                                }`}>
                                -{h.discount_percentage}%
                            </span>
                        </button>
                    </div>
                </div>

                {/* CARD GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
                    {displayPlans.map((plan) => {
                        const colors = getColorClasses(plan.color, plan.is_popular);
                        const { display, original, savings } = calculateValues(plan);
                        const features = parseFeatures(plan.features);

                        return (
                            <motion.div
                                key={plan.id}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className={`
                                    relative flex flex-col rounded-2xl border backdrop-blur-xl transition-all duration-300
                                    ${colors.card}
                                    ${plan.is_popular ? 'ring-1 ring-purple-500/30' : ''}
                                `}
                            >
                                {/* Popular Badge */}
                                {!!plan.is_popular && (
                                    <div className="absolute -top-4 left-0 right-0 flex justify-center z-30">
                                        <div className="px-5 py-1.5 rounded-full bg-slate-900 border border-purple-500 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                            <Crown size={12} className="text-purple-400" /> Most Popular
                                        </div>
                                    </div>
                                )}

                                {/* Card Content */}
                                <div className="p-6 flex flex-col h-full">

                                    {/* Plan Name */}
                                    <h3 className="text-center text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                                        {plan.name}
                                    </h3>

                                    {/* Price Display Area */}
                                    <div className="text-center mb-6 min-h-[5rem] flex flex-col items-center justify-center">
                                        {/* Strikethrough Price */}
                                        {isYearly && original && (
                                            <span className="text-xs text-rose-400 font-medium line-through decoration-red-600 decoration-2 mb-1">
                                                {original}
                                            </span>
                                        )}

                                        {/* Main Price */}
                                        <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                                            {display}
                                        </div>

                                        {/* Billed Label */}
                                        {!plan.is_free && !plan.is_contact && (
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wide mt-1">
                                                {isYearly ? 'Per Month (Billed Yearly)' : 'Per Month'}
                                            </span>
                                        )}

                                        {/* Seat Limit */}
                                        <div className="mt-2 inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400 uppercase tracking-wide font-mono">
                                            {plan.seat_limit}
                                        </div>
                                    </div>

                                    {/* Pro Card Savings */}
                                    {!!plan.is_popular && isYearly && savings && (
                                        <div className="mb-6 mx-auto px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
                                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                                <Sparkles size={12} className="fill-emerald-400/20" />
                                                <span>Save {savings}/year</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    <p className="text-center text-xs text-slate-400 leading-relaxed mb-6 px-1 min-h-[3rem]">
                                        {plan.description}
                                    </p>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-6" />

                                    {/* Features */}
                                    <ul className="space-y-3 mb-8 flex-grow">
                                        {features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${colors.check.split(' ')[0]}`}>
                                                    <Check size={10} className={colors.check.split(' ')[1]} />
                                                </div>
                                                <span className="text-xs text-slate-300 font-medium leading-relaxed text-left">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Button */}
                                    <a
                                        href={`/booking?plan=${plan.name.toLowerCase()}`}
                                        className={`
                                            w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
                                            ${plan.is_popular
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.02]'
                                                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                                            }
                                        `}
                                    >
                                        {plan.button_label}
                                        {plan.is_popular ? <Rocket size={14} className="animate-pulse" /> : <Zap size={14} />}
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Trust Badge */}
                <div className="flex flex-col items-center mt-16 text-center">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-2 font-light">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>{h.trust_badge_text}</span>
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default PricingSection;
