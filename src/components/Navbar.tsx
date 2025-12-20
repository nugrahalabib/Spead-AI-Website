'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, BookOpen, Newspaper, LucideIcon } from 'lucide-react';
import { GlobalSettings, getAssetUrl } from '@/lib/directus';

type NavItem = {
    id: string;
    label: string;
    href?: string;
    type?: 'link' | 'dropdown';
    children?: {
        id: string;
        label: string;
        description: string;
        href: string;
        icon: LucideIcon;
        colorClass: string;
    }[];
};

const navItems: NavItem[] = [
    { id: 'features', label: 'Features', href: '/#features', type: 'link' },
    { id: 'solutions', label: 'Solutions', href: '/#solutions', type: 'link' },
    {
        id: 'resources',
        label: 'Resources',
        type: 'dropdown',
        children: [
            {
                id: 'blog',
                label: 'Spead Insights',
                description: 'Deep dives into enterprise AI and legal tech.',
                href: '/blog',
                icon: BookOpen,
                colorClass: 'text-purple-500'
            },
            {
                id: 'news',
                label: 'Newsroom',
                description: 'Product updates, press releases, and announcements.',
                href: '/news',
                icon: Newspaper,
                colorClass: 'text-pink-500'
            }
        ]
    },
    { id: 'security', label: 'Security', href: '/#security', type: 'link' },
    { id: 'pricing', label: 'Pricing', href: '/#pricing', type: 'link' },
];

interface NavbarProps {
    settings?: GlobalSettings | null;
}

const Navbar = ({ settings }: NavbarProps) => {
    const [hovered, setHovered] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    const logoLightUrl = getAssetUrl(settings?.logo_light);
    const logoDarkUrl = getAssetUrl(settings?.logo_dark);
    const siteName = settings?.site_name || "Spead";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (pathname === '/') {
            e.preventDefault();
            const targetId = href.replace('/', ''); // Remove the leading slash to get #id
            const elem = document.querySelector(targetId);
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const handleMouseEnter = (id: string) => {
        setHovered(id);
        if (id === 'resources') setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        setHovered(null);
        setDropdownOpen(false);
    };

    // Determine if Resources should stay highlighted (Active State)
    const isResourcesActive = hovered === 'resources' || dropdownOpen || pathname?.startsWith('/blog') || pathname?.startsWith('/news');

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 transition-all duration-300">
            <nav className={`
                rounded-full px-2 py-2 flex items-center justify-between transition-all duration-500 relative
                ${scrolled
                    ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl'
                    : 'bg-transparent border border-transparent shadow-none'
                }
            `}>
                {/* Glass Reflection Effect */}
                {scrolled && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent rounded-full pointer-events-none" />
                )}

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 pl-4 group">
                    {/* If Directus logos exist, use dark logo only */}
                    {logoLightUrl && logoDarkUrl ? (
                        <img
                            src={logoDarkUrl}
                            alt={siteName}
                            className="block h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        // Fallback to Icon + Text if no logo images
                        <>
                            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#DB2777] shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.8)] transition-all duration-500">
                                <Sparkles size={16} className="text-white fill-white" />
                            </div>
                            <span className="font-bold text-lg tracking-wide text-white font-[family-name:var(--font-display)]">
                                {siteName}<span className="text-[#14B8A6]">AI</span>
                            </span>
                        </>
                    )}
                </Link>

                {/* Centered Navigation */}
                <ul className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            className="relative"
                            onMouseEnter={() => handleMouseEnter(item.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Link Items */}
                            {item.type === 'link' ? (
                                <Link
                                    href={item.href || '#'}
                                    onClick={(e) => item.href && handleLinkClick(e, item.href)}
                                    className="relative z-10 block px-5 py-2 text-sm font-medium transition-colors duration-300 text-slate-400 hover:text-white"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <button className={`relative z-10 flex items-center gap-1 px-5 py-2 text-sm font-medium transition-colors duration-300 cursor-default ${isResourcesActive ? 'text-white' : 'text-slate-400 hover:text-white'
                                    }`}>
                                    {item.label}
                                    <motion.span
                                        animate={{ rotate: isResourcesActive && dropdownOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown size={14} />
                                    </motion.span>
                                </button>
                            )}

                            {/* Spotlight Hover Effect for Tabs */}
                            {(hovered === item.id || (item.id === 'resources' && isResourcesActive)) && item.type !== 'dropdown' && (
                                <motion.div
                                    layoutId="nav-spotlight"
                                    className="absolute inset-0 rounded-full bg-white/10 blur-sm pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                            {/* Active highlight for Resources specifically */}
                            {item.id === 'resources' && isResourcesActive && (
                                <motion.div
                                    layoutId="nav-spotlight-resources" // Distinct layoutId to avoid conflict
                                    className="absolute inset-0 rounded-full bg-white/10 blur-sm pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}


                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {item.type === 'dropdown' && dropdownOpen && hovered === 'resources' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 p-2 rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 shadow-xl z-50 overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-1">
                                            {item.children?.map((child) => (
                                                <Link
                                                    key={child.id}
                                                    href={child.href}
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                                                >
                                                    <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${child.colorClass}`}>
                                                        <child.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-medium text-sm mb-0.5 group-hover:text-violet-300 transition-colors">
                                                            {child.label}
                                                        </div>
                                                        <div className="text-slate-400 text-xs leading-relaxed">
                                                            {child.description}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                <div className="pr-1">
                    <Link href="/#pricing" className="group relative px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white text-sm font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(219,39,119,0.6)] hover:scale-105 transition-all duration-300 overflow-hidden inline-block">
                        <span className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent z-0" />
                    </Link>
                </div>

            </nav>
        </div >
    );
};

export default Navbar;
