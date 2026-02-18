"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: "id" | "en") {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div
      className={`
        flex items-center rounded-full bg-background border border-border p-0.5
        ${isPending ? "opacity-60 pointer-events-none" : ""}
      `}
    >
      <div className="flex items-center rounded-full bg-background-muted p-0.5">
        <button
          onClick={() => switchLocale("id")}
          className={`
          px-5 py-1.5 rounded-full text-xs lg:text-base font-semibold tracking-wide transition-all duration-200
          ${
            locale === "id"
              ? "bg-linear-to-r from-[#E24980] to-[#8B4DA8] text-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }
        `}
        >
          ID
        </button>
        <button
          onClick={() => switchLocale("en")}
          className={`
          px-5 py-1.5 rounded-full text-xs lg:text-base font-semibold tracking-wide transition-all duration-200
          ${
            locale === "en"
              ? "bg-linear-to-r from-[#E24980] to-[#8B4DA8] text-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }
        `}
        >
          EN
        </button>
      </div>
    </div>
  );
}
