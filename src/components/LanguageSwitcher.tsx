'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: 'id' | 'en') {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div
      className={`
        flex items-center rounded-full bg-glass border border-border p-0.5
        ${isPending ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      <button
        onClick={() => switchLocale('id')}
        className={`
          px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200
          ${locale === 'id'
            ? 'bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-foreground shadow-md'
            : 'text-muted-foreground hover:text-foreground'
          }
        `}
      >
        ID
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`
          px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200
          ${locale === 'en'
            ? 'bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-foreground shadow-md'
            : 'text-muted-foreground hover:text-foreground'
          }
        `}
      >
        EN
      </button>
    </div>
  );
}
