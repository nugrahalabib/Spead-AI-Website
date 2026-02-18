"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TiktokIcon from "@/components/icons/TiktokIcon";
import YoutubeIcon from "@/components/icons/YoutubeIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import WhatsappIcon from "@/components/icons/WhatsappIcon";
import PhoneIcon from "@/components/icons/PhoneIcon";
import EmailIcon from "@/components/icons/EmailIcon";
import { HELLO_MESSAGE } from "@/const";

const socialLinks = [
  { icon: InstagramIcon, href: "https://www.instagram.com/calianaindonesia/", label: "Instagram" },
  { icon: TiktokIcon, href: "https://www.tiktok.com/@lifeatcaliana", label: "TikTok" },
  { icon: YoutubeIcon, href: "https://www.youtube.com/@Calianaindonesia", label: "YouTube" },
  {
    icon: LinkedinIcon,
    href: "https://www.linkedin.com/company/caliana/mycompany/",
    label: "LinkedIn",
  },
];

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-background text-muted-foreground">
      {/* Main Content */}
      <div className="px-6 pt-16 pb-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Col 1: Logo + Tagline + Social */}
          <div className="flex flex-col items-start gap-1 lg:col-span-5">
            <Link href="/">
              <Image
                src="/logo_spead_ai_color.png"
                alt="Spead AI"
                width={180}
                height={46}
                className="object-contain w-auto h-10"
              />
            </Link>
            <p className="text-sm text-foreground">{t("tagline")}</p>
            <div className="flex items-end flex-1 gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center transition-colors border rounded-lg border-foreground size-8 bg-glass hover:bg-glass-hover"
                >
                  <social.icon className="size-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="lg:col-span-2 lg:justify-self-end">
            <h4 className="mb-4 text-sm font-semibold text-foreground lg:text-xl">
              {t("company")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://www.caliana.id/about-us"
                  className="text-sm text-foreground lg:text-base"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.caliana.id/blog"
                  className="text-sm text-foreground lg:text-base"
                >
                  {t("blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Our Location */}
          <div className="lg:col-span-3 lg:justify-self-end">
            <h4 className="mb-4 text-sm font-semibold text-foreground lg:text-xl">
              {t("locationTitle")}
            </h4>
            <p className="text-sm leading-relaxed text-foreground lg:text-base">{t("address")}</p>
          </div>

          {/* Col 4: Contact Us */}
          <div className="lg:col-span-2 lg:justify-self-end">
            <h4 className="mb-4 text-sm font-semibold text-foreground lg:text-xl">
              {t("contactTitle")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`https://wa.me/628119152066?text=${HELLO_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-foreground lg:text-base"
                >
                  <WhatsappIcon className="w-4 h-4 shrink-0" />
                  {t("phone1")}
                </a>
              </li>
              <li>
                <a
                  href="tel:0217210588"
                  className="flex items-center gap-2.5 text-sm text-foreground lg:text-base"
                >
                  <PhoneIcon className="w-4 h-4 shrink-0" />
                  {t("phone2")}
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@caliana.id"
                  className="flex items-center gap-2.5 text-sm text-foreground lg:text-base"
                >
                  <EmailIcon className="w-4 h-4 shrink-0" />
                  {t("email")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="">
        <div className="h-px graydient__divider"></div>
        <div className="flex flex-col gap-4 px-6 py-6 mx-auto max-w-7xl lg:flex-row lg:items-center lg:justify-between">
          {/* Supported by */}
          <div className="flex gap-3 max-lg:items-center lg:flex-col">
            <span className="text-xs text-primary-95">{t("supportedBy")}</span>
            <Image
              src="/logo-caliana-white.png"
              alt="Caliana"
              width={100}
              height={28}
              className="object-contain w-auto h-6"
            />
          </div>

          {/* Copyright */}
          <p className="text-xs text-primary-95">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
