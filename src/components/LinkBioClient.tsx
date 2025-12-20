'use client';

import { motion } from 'framer-motion';
import {
    Home, Rocket, Linkedin, Video, Code, Instagram,
    Twitter, Mail, Globe, ArrowUpRight, Flame,
    Briefcase, Building, Building2, Laptop, Smartphone, Database,
    Coffee, Utensils, Plane, MapPin, ShoppingBag,
    FileText, Image as ImageIcon, Music, Mic,
    Link as LinkIcon, Star, Heart, Zap, Award, Facebook, Youtube, Twitch
} from 'lucide-react';
import Image from 'next/image';

// Map icon strings to Lucide components
const IconMap: Record<string, any> = {
    // Essentials
    home: Home,
    link: LinkIcon,
    globe: Globe,
    mail: Mail,

    // Socials
    linkedin: Linkedin,
    instagram: Instagram,
    twitter: Twitter,
    code: Code, // GitHub
    youtube: Youtube,
    video: Video, // TikTok
    facebook: Facebook,
    twitch: Twitch,

    // Business & Tech
    briefcase: Briefcase,
    building: Building,
    rocket: Rocket,
    laptop: Laptop,
    smartphone: Smartphone,
    database: Database,

    // Lifestyle
    coffee: Coffee,
    utensils: Utensils,
    plane: Plane,
    'map-pin': MapPin,
    'shopping-bag': ShoppingBag,

    // Content
    'file-text': FileText,
    image: ImageIcon,
    music: Music,
    mic: Mic,

    // Misc
    star: Star,
    heart: Heart,
    award: Award,
    zap: Zap,

    default: Globe
};

export default function LinkBioClient({ settings, categories, links }: { settings: any, categories: any[], links: any[] }) {

    // 1. Separate Highlights
    const highlights = links.filter(l => l.is_highlight);
    const standardLinks = links.filter(l => !l.is_highlight);

    // 2. Group by Category
    const groupedLinks = categories.map(cat => ({
        ...cat,
        items: standardLinks.filter(l => l.category?.id === cat.id)
    })).filter(group => group.items.length > 0);

    // Add "Uncategorized" if any
    const uncategorized = standardLinks.filter(l => !l.category);
    if (uncategorized.length > 0) {
        groupedLinks.push({ id: 999, title: "Others", sort: 999, items: uncategorized });
    }

    return (
        <div className="min-h-screen w-full bg-[#F2F2F2] text-black font-[family-name:var(--font-outfit)] selection:bg-black selection:text-white overflow-x-hidden">

            {/* BACKGROUND: Technical Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col border-x-2 border-black bg-[#F2F2F2] shadow-2xl">

                {/* HEADER SECTION */}
                <div className="p-6 pt-12 text-center border-b-4 border-black bg-white relative overflow-hidden">
                    {/* Profile Image */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-black bg-neutral-200 overflow-hidden">
                            {settings?.profile_image ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'}/assets/${settings.profile_image}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-black text-white text-4xl font-bold">NL</div>
                            )}
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -right-2 -bottom-2 bg-yellow-400 border-2 border-black px-2 py-1 text-xs font-black uppercase transform rotate-[-5deg]">
                            Online
                        </div>
                    </div>

                    {/* Name & Title */}
                    <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-2">
                        {settings?.page_title || "NUGRAHA'S HUB"}
                    </h1>
                    <p className="font-mono text-sm uppercase tracking-widest border-y border-black py-2 inline-block">
                        {settings?.page_subtitle || "Full Stack Architect • CPO Spead AI"}
                    </p>
                </div>

                {/* MARQUEE TICKER */}
                <div className="bg-black text-white py-2 border-b-4 border-black overflow-hidden whitespace-nowrap flex">
                    <motion.div
                        animate={{ x: "-50%" }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="flex gap-8 items-center font-mono font-bold uppercase tracking-wider text-sm"
                    >
                        {[...Array(4)].map((_, i) => (
                            <span key={i} className="flex items-center gap-4">
                                {settings?.running_text || "🚨 OPEN FOR COLLAB • SPEAD AI LAUNCHING SOON"}
                                <span className="text-yellow-400">★</span>
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* CONTENT AREA */}
                <div className="p-4 flex flex-col gap-8 pb-12">

                    {/* 1. SPOTLIGHT / HIGHLIGHTS */}
                    {highlights.length > 0 && (
                        <div className="flex flex-col gap-4">
                            {highlights.map((link: any) => {
                                const Icon = IconMap[link.icon] || IconMap.default;
                                return (
                                    <motion.a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -4, boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
                                        className="relative group block bg-black text-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    >
                                        {link.badge && (
                                            <div className="absolute -top-3 -right-3 bg-yellow-400 text-black border-2 border-black px-3 py-1 text-xs font-black uppercase transform rotate-[5deg] group-hover:rotate-[10deg] transition-transform">
                                                {link.badge}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mb-2">
                                            <Icon size={32} className="text-yellow-400" />
                                            <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </div>

                                        <h3 className="text-2xl font-black uppercase tracking-tight mb-1">{link.label}</h3>
                                        <p className="text-neutral-400 text-xs font-mono uppercase">Click to Access</p>
                                    </motion.a>
                                );
                            })}
                        </div>
                    )}

                    {/* 2. CATEGORIZED LINKS */}
                    {groupedLinks.map((group: any) => (
                        <div key={group.id}>
                            {/* Category Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-[2px] flex-1 bg-black" />
                                <h2 className="font-black uppercase tracking-widest text-sm bg-black text-white px-3 py-1 transform -skew-x-12">
                                    {group.title}
                                </h2>
                                <div className="h-[2px] flex-1 bg-black" />
                            </div>

                            {/* Links Grid */}
                            <div className="flex flex-col gap-3">
                                {group.items.map((link: any) => {
                                    const Icon = IconMap[link.icon] || IconMap.default;
                                    return (
                                        <motion.a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ x: -2, y: -2, boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
                                            className="flex items-center justify-between p-4 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-yellow-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-black text-white rounded-sm">
                                                    <Icon size={18} />
                                                </div>
                                                <span className="font-bold uppercase text-sm tracking-wide">{link.label}</span>
                                            </div>
                                            {link.badge && (
                                                <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 uppercase">
                                                    {link.badge}
                                                </span>
                                            )}
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                </div>

                {/* FOOTER */}
                <div className="mt-auto border-t-4 border-black bg-black text-white p-6 text-center">
                    <p className="font-mono text-xs uppercase tracking-widest opacity-60">
                        © 2025 NUGRAHA LABIB • SYSTEM V3.0
                    </p>
                </div>

            </div>
        </div>
    );
}
