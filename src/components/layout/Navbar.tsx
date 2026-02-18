"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Menu, X } from "lucide-react";
import { useActiveSection } from "@/context/ActiveSectionContext";

type NavItem = {
  id: string;
  labelKey: string;
  href: string;
};

const navItems: NavItem[] = [
  { id: "home", labelKey: "home", href: "/" },
  { id: "features", labelKey: "features", href: "/#features" },
  { id: "pricing", labelKey: "pricing", href: "/#pricing" },
  { id: "contact", labelKey: "contact", href: "/#contact" },
];

const Navbar = () => {
  const t = useTranslations("Navbar");
  const { activeSection } = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return activeSection === "home";
    // extract section id from href like "/#features" → "features"
    const id = href.replace("/#", "");
    return activeSection === id;
  };

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="w-full bg-background backdrop-blur-md">
        <nav className="flex items-center justify-between max-w-7xl mx-auto  px-4 py-2.5 lg:px-6 lg:gap-3">
          {/* Mobile: Hamburger */}
          <button
            className="flex items-center justify-center transition-colors rounded-lg lg:hidden w-9 h-9 text-primary-95 hover:text-foreground"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center flex-1 shrink-0">
            <Image
              src="/logo_spead_ai_color.png"
              alt="Spead AI"
              width={140}
              height={36}
              className="object-contain w-auto h-8"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="items-center hidden gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm transition-colors duration-200
                    ${
                      isActive(item.href)
                        ? "gradient__border-thin"
                        : "text-primary-95 hover:text-foreground hover:bg-glass"
                    }
                  `}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Language Switcher */}
          <LanguageSwitcher />
        </nav>
        <div className="h-px graydient__divider"></div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-in Menu */}
      <div
        className={`
          fixed top-0 right-0 z-50 h-full w-full bg-background-muted border-l border-border
          transition-transform duration-300 ease-in-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-sm font-semibold text-foreground">Menu</span>
          <button
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-lg text-primary-95 hover:text-foreground"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  block px-4 py-3 rounded-lg text-sm transition-colors duration-200
                  ${
                    isActive(item.href)
                      ? "bg-glass-hover text-foreground"
                      : "text-primary-95 hover:text-foreground hover:bg-glass"
                  }
                `}
              >
                {t(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
