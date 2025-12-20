'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import {
    ArrowRight, CheckCircle2, Sparkles, Users, Clock,
    Building2, Mail, Phone, User, Briefcase, MessageSquare,
    Loader2, ArrowLeft, Zap
} from 'lucide-react';
import Link from 'next/link';

const PLANS: Record<string, { name: string; price: string; color: string }> = {
    freemium: { name: 'Freemium', price: 'Free', color: 'from-cyan-400 to-teal-500' },
    plus: { name: 'Plus', price: 'IDR 3,990K', color: 'from-blue-400 to-indigo-500' },
    pro: { name: 'Pro', price: 'IDR 8,990K', color: 'from-purple-400 to-pink-500' },
    enterprise: { name: 'Enterprise', price: 'IDR 15,000K', color: 'from-indigo-400 to-purple-500' },
    custom: { name: 'Custom', price: 'Let\'s Talk', color: 'from-amber-400 to-orange-500' },
};

function BookingFormContent() {
    const searchParams = useSearchParams();
    const planFromUrl = searchParams.get('plan') || 'professional';

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        company: '',
        job_title: '',
        selected_plan: planFromUrl,
        team_size: '',
        use_case: '',
        timeline: '',
        referral_source: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData(prev => ({ ...prev, selected_plan: planFromUrl }));
    }, [planFromUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    utm_source: searchParams.get('utm_source') || '',
                    utm_medium: searchParams.get('utm_medium') || '',
                    utm_campaign: searchParams.get('utm_campaign') || '',
                }),
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                const data = await res.json();
                setError(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedPlan = PLANS[formData.selected_plan as keyof typeof PLANS] || PLANS.professional;

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
            >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={48} className="text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">You're on the list! 🎉</h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    We've received your booking request. Our team will reach out within 24 hours to discuss how Spead AI can transform your workflow.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Plan Selector */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Selected Plan</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(PLANS).map(([key, plan]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setFormData({ ...formData, selected_plan: key })}
                            className={`p-4 rounded-xl border transition-all ${formData.selected_plan === key
                                ? 'border-white/30 bg-white/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20'
                                }`}
                        >
                            <div className={`text-sm font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                                {plan.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{plan.price}/mo</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        <User size={14} className="inline mr-2" />Full Name *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white placeholder-slate-500"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Mail size={14} className="inline mr-2" />Work Email *
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white placeholder-slate-500"
                        placeholder="john@company.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Phone size={14} className="inline mr-2" />Phone Number
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white placeholder-slate-500"
                        placeholder="+62 812 xxxx xxxx"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Building2 size={14} className="inline mr-2" />Company *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white placeholder-slate-500"
                        placeholder="Acme Inc."
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Briefcase size={14} className="inline mr-2" />Job Title
                    </label>
                    <input
                        type="text"
                        value={formData.job_title}
                        onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white placeholder-slate-500"
                        placeholder="Head of Operations"
                    />
                </div>
            </div>

            {/* Requirements */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Users size={14} className="inline mr-2" />Team Size
                    </label>
                    <select
                        value={formData.team_size}
                        onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white"
                    >
                        <option value="" className="bg-slate-900">Select team size</option>
                        <option value="1-5" className="bg-slate-900">1-5 people</option>
                        <option value="6-20" className="bg-slate-900">6-20 people</option>
                        <option value="21-50" className="bg-slate-900">21-50 people</option>
                        <option value="51-100" className="bg-slate-900">51-100 people</option>
                        <option value="100+" className="bg-slate-900">100+ people</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Clock size={14} className="inline mr-2" />When do you need it?
                    </label>
                    <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white"
                    >
                        <option value="" className="bg-slate-900">Select timeline</option>
                        <option value="immediately" className="bg-slate-900">Immediately</option>
                        <option value="1-3-months" className="bg-slate-900">1-3 months</option>
                        <option value="3-6-months" className="bg-slate-900">3-6 months</option>
                        <option value="exploring" className="bg-slate-900">Just exploring</option>
                    </select>
                </div>
            </div>

            {/* Use Case */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    <MessageSquare size={14} className="inline mr-2" />What would you like to use Spead AI for?
                </label>
                <textarea
                    value={formData.use_case}
                    onChange={(e) => setFormData({ ...formData, use_case: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white placeholder-slate-500 resize-none"
                    placeholder="Tell us about your use case, pain points, or what you're hoping to achieve..."
                />
            </div>

            {/* Referral */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Sparkles size={14} className="inline mr-2" />How did you hear about us?
                </label>
                <input
                    type="text"
                    value={formData.referral_source}
                    onChange={(e) => setFormData({ ...formData, referral_source: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white placeholder-slate-500"
                    placeholder="Google, LinkedIn, friend referral, etc."
                />
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isSubmitting
                    ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                    : `bg-gradient-to-r ${selectedPlan.color} text-white hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02]`
                    }`}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        Reserve My Spot
                        <ArrowRight size={20} />
                    </>
                )}
            </button>

            <p className="text-center text-xs text-slate-500">
                By submitting, you agree to our Terms of Service and Privacy Policy.
                <br />We'll never share your information with third parties.
            </p>
        </form>
    );
}

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/20 blur-[150px] rounded-full opacity-40"
                />
                <motion.div
                    animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/20 blur-[150px] rounded-full opacity-30"
                />
            </div>

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Back */}
                    <Link href="/#pricing" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Back to Pricing</span>
                    </Link>

                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                            <Zap size={16} />
                            Limited Early Access
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Reserve Your Spot
                        </h1>
                        <p className="text-slate-400 text-lg max-w-lg mx-auto">
                            Be among the first to experience the future of AI-powered productivity.
                            We'll notify you the moment we're ready.
                        </p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10"
                    >
                        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none rounded-3xl" />
                        <div className="relative z-10">
                            <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading...</div>}>
                                <BookingFormContent />
                            </Suspense>
                        </div>
                    </motion.div>

                    {/* Trust Signals */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-slate-500 text-sm mb-4">Trusted by innovative teams at</p>
                        <div className="flex items-center justify-center gap-8 opacity-50">
                            <div className="text-slate-400 font-bold">Acme Corp</div>
                            <div className="text-slate-400 font-bold">TechStart</div>
                            <div className="text-slate-400 font-bold">Innovate.io</div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
