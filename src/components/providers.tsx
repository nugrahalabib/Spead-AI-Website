'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { ActiveSectionProvider } from '@/context/ActiveSectionContext';

/**
 * Providers component for next-themes integration
 * 
 * Phase 1.1: Dark mode only (forcedTheme='dark')
 * Phase 1.2: Enable light/dark toggle (remove forcedTheme prop)
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark" // Remove this in Phase 1.2 untuk enable light mode toggle
      enableSystem={false}
      disableTransitionOnChange
    >
      <ActiveSectionProvider>{children}</ActiveSectionProvider>
    </ThemeProvider>
  );
}
