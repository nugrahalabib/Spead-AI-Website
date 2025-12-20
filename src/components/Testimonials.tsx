'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, X } from 'lucide-react';

const Testimonials = ({ items = [], headline, subheadline }: { items?: any[], headline?: string, subheadline?: string }) => {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    if (!items || items.length === 0) return null;

    return (
        <section className="relative px-6 md:px-20 py-20 z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center border-b border-white/10 pb-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)] mb-4 tracking-tight">{headline || 'What They Say.'}</h2>
                    <p className="text-neutral-400 text-lg font-mono tracking-wide">{subheadline || 'SOCIAL PROOF // REAL TESTIMONIALS'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id || index}
                            layoutId={`testimonial-${item.id || index}`}
                            onClick={() => setSelectedItem(item)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="relative p-8 rounded-2xl bg-neutral-900/40 border border-white/5 backdrop-blur-md hover:border-white/10 transition-all duration-300 group cursor-pointer"
                        >
                            <Quote className="absolute top-6 right-6 text-white/10 group-hover:text-white/20 transition-colors" size={40} />

                            <div
                                className="text-neutral-400 leading-relaxed mb-6 font-light relative z-10 line-clamp-4"
                                dangerouslySetInnerHTML={{ __html: item.quote }}
                            />

                            <div className="flex flex-col">
                                <h4 className="text-white font-bold font-[family-name:var(--font-outfit)] text-lg">{item.name}</h4>
                                <p className="text-sm text-neutral-500 font-mono mt-1">{item.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* POPUP MODAL */}
            <AnimatePresence>
                {selectedItem && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                layoutId={`testimonial-${selectedItem.id}`}
                                className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]"
                            >
                                {/* Modal Header */}
                                <div className="relative p-8 pb-0 flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                            <Quote size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-outfit)]">
                                                {selectedItem.name}
                                            </h3>
                                            <p className="text-neutral-400 text-sm font-mono">
                                                {selectedItem.role}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
                                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="p-8 overflow-y-auto">
                                    <div className="prose prose-invert prose-lg max-w-none text-neutral-300 leading-relaxed italic">
                                        {selectedItem.detail_content ? (
                                            <div dangerouslySetInnerHTML={{ __html: selectedItem.detail_content }} />
                                        ) : (
                                            <div dangerouslySetInnerHTML={{ __html: selectedItem.quote }} />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Testimonials;
