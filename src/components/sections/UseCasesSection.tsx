'use client';

import { motion } from 'framer-motion';
import { Scale, Briefcase, Calculator, LucideIcon } from 'lucide-react';

interface UseCase {
    id: number;
    title: string;
    description: string;
    image?: string;
    sort: number;
}

interface UseCasesSectionProps {
    useCases: UseCase[];
}

const iconMap: Record<string, LucideIcon> = {
    'Law Firms': Scale,
    'Management Consultants': Briefcase,
    'Public Accountants': Calculator
};

const UseCasesSection = ({ useCases }: UseCasesSectionProps) => {
    // Fallback if empty
    const items = useCases.length > 0 ? useCases : [
        { id: 1, title: 'Law Firms', description: 'Find case precedents in seconds & draft error-free contracts.', sort: 1 },
        { id: 2, title: 'Management Consultants', description: 'Access years of intellectual property & generate strategic proposals instantly.', sort: 2 },
        { id: 3, title: 'Public Accountants', description: 'Automate Audit Reports & extract financial data from thousands of invoices.', sort: 3 }
    ];

    return (
        <section className="py-32 px-4 md:px-0 bg-[#030014]">
            <div className="container mx-auto max-w-6xl">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-center text-white mb-20 font-display tracking-tight"
                >
                    Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">High-Stakes</span> Professionals.
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {items.map((item, i) => {
                        const Icon = iconMap[item.title] || Briefcase;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-10 rounded-[32px] glass-card flex flex-col hover:-translate-y-2 transition-transform duration-500"
                            >
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="p-4 bg-white/[0.05] rounded-2xl text-white border border-white/[0.08] group-hover:bg-indigo-600 transition-colors shadow-lg">
                                        <Icon size={24} />
                                    </div>
                                    <div className="text-neutral-600 font-mono text-xs group-hover:text-indigo-300 transition-colors">0{i + 1}</div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-neutral-400 leading-relaxed text-sm font-light">
                                    {item.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default UseCasesSection;
