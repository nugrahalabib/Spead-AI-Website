# Spead AI Codebase Copilot Instructions

## Current Project Context

**Active Task**: Homepage Revamp (Forked Repository)
- **Scope**: Complete redesign of landing page (`/`), navbar, and footer based on Figma designs
- **Approach**: Minimal changes to existing infrastructure (avoid Directus/Docker modifications)
- **Key Constraints**:
  1. Design system will be implemented as part of this revamp
  2. Implementing i18n (Indonesian + English) - **check Directus i18n support first**
  3. If Directus lacks i18n support, replace home content with **static coded content** (no CMS)
  4. Preserve existing Directus setup for other pages (blog, news) - don't break existing functionality
  5. Limited knowledge transfer from original maintainer - communicate via chat only

**Implementation Strategy**:
- Fork-first workflow: make changes in isolation without affecting original repo
- Focus only on homepage concerns - avoid touching `/scripts`, Docker configs, or backend schema
- New components should follow existing conventions (PascalCase, default exports, `@/` imports)
- Maintain TypeScript pattern but prioritize getting the revamp working

## Architecture Overview

**Stack**: Next.js 16 (App Router) + Directus CMS (Docker) + TypeScript + Tailwind CSS v4 + Framer Motion

**Monorepo Structure**:
- **Frontend**: Next.js app in `/src` with TypeScript, React 19, server/client components
- **Backend/CMS**: Dockerized Directus (port 8055) with SQLite database
- **Scripts**: 100+ utility scripts in `/scripts` for Directus schema management and data seeding

**Data Flow**: Directus (Docker) → Directus SDK → TypeScript interfaces → React Server Components → ISR/SSR pages

## Critical Developer Workflows

### Running the Project
```powershell
# Start backend (Directus) first
docker compose up -d

# Wait 30-60s for DB initialization, then start frontend
npm run dev  # Port 3000 (auto-switches to 3001 if busy)

# Directus Admin: http://localhost:8055/admin
# Credentials: admin@spead.ai / password123
```

### Working with Directus
- **All schema changes** must go through scripts, not manual UI edits
- Scripts authenticate with hardcoded credentials: `admin@spead.ai` / `password123`
- Use `/scripts/seed-directus.ts` as reference for creating new collections
- Directus URL: `http://localhost:8055` (env: `NEXT_PUBLIC_DIRECTUS_URL`)

## Code Conventions

### Component Structure
- **Naming**: PascalCase files, default exports (e.g., `HeroSection.tsx` → `export default HeroSection`)
- **Location**: `/src/components/sections/` for page sections, `/src/components/reusable/` for shared UI
- **Client vs Server**: Mark interactive components with `'use client'`; data-fetching components are server components by default

### TypeScript Interfaces
- **Schema source of truth**: `/src/lib/directus.ts` contains all Directus collection types
- **Pattern**: Export interfaces directly from `directus.ts`, import with: `import { GlobalSettings } from '@/lib/directus'`
- **Naming**: Match Directus collection names exactly (e.g., `lp_hero` → `LandingPage` interface)

### Data Fetching Patterns
```typescript
// Standard pattern from page.tsx:
const [data1, data2] = await Promise.all([
  directus.request(readSingleton('collection_name')).catch(() => null),
  directus.request(readItems('items', { sort: ['sort'] })).catch(() => []),
]);
```
- Always use `.catch()` fallbacks for resilience
- Sort collections with `{ sort: ['sort'] }` parameter
- Use `readSingleton()` for single records, `readItems()` for collections

### Styling with Tailwind CSS
- **Version**: Tailwind CSS v4 (uses `@tailwindcss/postcss` plugin)
- **Dynamic classes**: Use `twMerge` from `tailwind-merge` for conditional classes
- **Color system**: Custom gradients in `/src/utils/textParser.tsx` for smart text coloring
- **Smart text syntax**: `{Word:color}` in Directus text fields renders as gradient spans
  - Example: `"Stop {Burning:violet} Hours"` → colored "Burning" text
  - Parsed by `parseSmartText()` utility

### Path Aliases
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Always use path aliases for imports: `import Navbar from '@/components/Navbar'`

## Project-Specific Patterns

### Asset Handling
```typescript
import { getAssetUrl } from '@/lib/directus';
const imageUrl = getAssetUrl(directus_uuid); // Returns full http://localhost:8055/assets/{uuid}
```

### Default Fallback Pattern
Components define `DEFAULTS` object for fallback content when Directus data is missing:
```typescript
const DEFAULTS = {
  headline: "Default Headline",
  subheadline: "..."
};
const headline = data?.headline || DEFAULTS.headline;
```

### Build Configuration
- **TypeScript errors ignored in production**: `next.config.ts` has `ignoreBuildErrors: true`
- **Build command**: `npm run build:prod` sets `NEXT_IGNORE_TYPE_CHECK=true`
- **Rationale**: Rapid iteration prioritized over strict type safety in production builds

### Indonesian Context
- Component naming like `KelapKelip` (Indonesian: "blinking/sparkling") reflects team's Indonesian context
- Keep existing Indonesian-inspired naming conventions when extending the codebase

## Directus Schema Management

### Adding New Collections
1. Create script in `/scripts/` following naming pattern: `create-{feature}-collection.ts`
2. Authenticate with fetch to `/auth/login`, get access token
3. Create collection via POST to `/collections`
4. Add fields via POST to `/fields/{collection_name}`
5. Set permissions via PATCH to `/permissions`
6. Example: See `/scripts/seed-directus.ts` (517 lines, comprehensive reference)

### Common Script Patterns
```typescript
const DIRECTUS_URL = 'http://localhost:8055';
const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@spead.ai', password: 'password123' })
});
const { access_token } = await loginRes.json();
```

### Script Categories
- `create-*.{ts,js}`: Initialize new collections/fields
- `fix-*.{ts,js,py}`: Patch existing schema issues
- `debug-*.{ts,js,py}`: Diagnostic tools
- `seed-*.{ts,js}`: Populate with sample data

## Key Files Reference

- **Directus client**: [src/lib/directus.ts](src/lib/directus.ts) - SDK setup, all TypeScript interfaces
- **Main layout**: [src/app/layout.tsx](src/app/layout.tsx) - Global metadata, favicon logic, Navbar/Footer
- **Homepage**: [src/app/page.tsx](src/app/page.tsx) - Data fetching patterns, section composition
- **Text parser**: [src/utils/textParser.tsx](src/utils/textParser.tsx) - Smart text coloring system
- **Docker config**: [docker-compose.yml](docker-compose.yml) - Directus container setup

## Integration Points

### Frontend ↔ Directus
- SDK: `@directus/sdk` v20.2.0 with REST transport
- No auth in frontend (public read access configured in Directus)
- Images served via Directus assets endpoint: `/assets/{uuid}`
- Revalidation: `export const revalidate = 60` in pages for ISR

### External Dependencies
- **Framer Motion**: Used extensively for animations (see `HeroSection.tsx`)
- **Lucide React**: Icon library (`lucide-react`)
- **React Markdown**: Blog post rendering with `remark-gfm`, `rehype-raw`

## Directus Internationalization (i18n)

**Status**: ⚠️ **Needs Verification**  
Directus has **Translations** interface for multi-language content, but current repo doesn't implement it:

**If Directus supports i18n** (has `translations` interface):
- Collections can have language-specific fields
- Requires schema modification (adding translations relations)
- Frontend queries need locale parameter

**If NOT supported or too complex**:
- **Recommended**: Use static content with i18n library (next-intl, react-i18next)
- Keep Directus for blog/news (English only)
- Homepage content lives in code, not CMS
- Simpler for rapid revamp without schema changes

**Decision**: For this revamp, prefer **static content + i18n library** to avoid modifying Directus schema and breaking existing pages.

## Design System Notes (Revamp)

**Status**: ✅ **Implemented in Phase 1.1**

### Design Tokens Location
- **CSS Variables**: [src/styles/globals.css](src/styles/globals.css) - Spead colors, fonts, radii, animations
- **Gradient Utilities**: [src/styles/design-system/gradients.css](src/styles/design-system/gradients.css) - Pre-built gradient classes
- **Theme Provider**: [src/components/providers.tsx](src/components/providers.tsx) - next-themes wrapper

### Color System (Spead Brand)
**Primary Gradient**: Blue scale (`--color-primary-30` through `--color-primary-98`)
- Main brand color: `--color-primary-50` (#0090e8)
- Usage: `bg-primary-50`, `text-primary-60`, etc.

**Secondary**: Pink/Rose (`--color-secondary` #ff4174)
- Accent color for CTAs and highlights

**Neutral Scale**: Gray scale (`--color-neutral-10` through `--color-neutral-100`)
- Usage in UI backgrounds, text, borders

**Semantic Colors**:
- Info: `--color-info-50/60/70` (Blue)
- Success: `--color-success-40/60/80` (Green)
- Danger: `--color-danger-50/60/70/80` (Red)
- Warning: `--color-warning` (Orange)

### Gradient Utilities
**Pre-built Classes** (from gradients.css):
- `.gradient__text` - Pink to blue text gradient
- `.gradient__btn` - Primary button gradient (hover effects included)
- `.gradient__border-thin` - Thin gradient border
- `.gradient__border-dashed` - Dashed gradient border
- `.graydient__text` - Neutral gradient text (adaptive light/dark)
- `.graydient__divider` - Horizontal divider with fade
- `.graydient__divider-vertical` - Vertical divider with fade

**Custom Gradient Inputs**: Wrapper components with focus effects
- `.gradient-input-wrapper` - Small inputs (border-radius: var(--radius))
- `.gradient-input-wrapper-lg` - Large inputs/textareas (border-radius: 1rem)

### Theme System (next-themes)

**Phase 1.1** (Current): Dark mode only
```tsx
// Forced dark mode via providers.tsx
<ThemeProvider forcedTheme="dark" />
```

**Phase 1.2** (Planning): Light/Dark toggle
```tsx
// Remove forcedTheme prop in providers.tsx
// Add theme switcher component using useTheme() hook
import { useTheme } from 'next-themes';
const { theme, setTheme } = useTheme();
```

**CSS Variables** adapt automatically:
- Light: `--background: #ffffff`, `--foreground: #0f1b28`
- Dark: `--background: #0f1b28`, `--foreground: #f2f2f2`

### Tailwind Integration

**V4 Note**: Using hybrid approach
- `@theme` directive in globals.css for Spead design tokens
- `tailwind.config.js` kept minimal for legacy component compatibility

**New Components**: Use design tokens
```tsx
// ✅ Preferred
<div className="bg-primary-50 text-neutral-100">

// ❌ Avoid hardcoded colors
<div className="bg-[#0090e8] text-white">
```

**Responsive Font Scale**: Use `--text-*` variables
- `--text-xs` through `--text-9xl` with line-heights included

### Animation Tokens
Available in `@theme`:
- `--animate-aurora` - 10s color shift
- `--animate-float-slow` - 8s vertical float
- `--animate-pulse-slow` - 4s opacity pulse
- `--animate-text-shimmer` - 2.5s shimmer effect
- `--animate-shine` - 1.5s shine sweep

Usage: `animate-[aurora]` or reference in custom CSS

## Troubleshooting Checklist

1. **"Global Settings not found"**: Ensure Docker is running and Directus is accessible at port 8055
2. **Build failures**: TypeScript errors don't block builds (by design); check runtime console for real issues
3. **Port conflicts**: Use `npx kill-port 3000` or accept Next.js auto-assigned port
4. **Directus schema drift**: Run latest `fix-*` or `setup-*` script from `/scripts` to sync schema (⚠️ **Avoid during revamp**)
5. **Image not loading**: Check if UUID exists in Directus uploads, verify `remotePatterns` in `next.config.ts`
6. **Working on revamp**: Don't start Docker/Directus unless needed - homepage will use static content
