'use client';

import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { GlobalSettings } from '@/lib/directus';

interface FooterProps {
    settings?: GlobalSettings | null;
}

const Footer = ({ settings }: FooterProps) => {
    const currentYear = new Date().getFullYear();
    const copyright = settings?.copyright_text || `© ${currentYear} Spead AI Inc. All rights reserved.`;

    return (
        <footer className="relative py-12 px-6 bg-[#020617] border-t border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="text-slate-400 text-sm">
                    {copyright}
                </div>

                <div className="flex items-center gap-6">
                    {settings?.social_github && (
                        <a href={settings.social_github} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                            <Github size={20} />
                        </a>
                    )}
                    {settings?.social_twitter && (
                        <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                            <Twitter size={20} />
                        </a>
                    )}
                    {settings?.social_linkedin && (
                        <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                            <Linkedin size={20} />
                        </a>
                    )}
                    {settings?.social_instagram && (
                        <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                            <Instagram size={20} />
                        </a>
                    )}
                </div>

            </div>
        </footer>
    );
};

export default Footer;
