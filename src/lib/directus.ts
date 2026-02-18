import { createDirectus, rest, readSingleton } from '@directus/sdk';

export const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export const getAssetUrl = (id: string | null | undefined): string | null => {
    if (!id) return null;
    return `${DIRECTUS_URL}/assets/${id}`;
};

// 1. Global Settings (Singleton)
export interface GlobalSettings {
    // 1. Brand & Assets
    site_name: string;
    site_tagline: string;
    brand_color_primary: string;
    logo_light: string; // UUID
    logo_dark: string;  // UUID
    favicon: string;    // UUID
    og_image: string;   // UUID
    seo_title_template: string;
    seo_description_default: string;
    seo_keywords: string[] | string; // Can be array or CSV
    organization_schema_json: string;
    contact_email: string;
    support_email: string;
    contact_phone: string;
    business_address: string;
    copyright_text: string;
    social_linkedin: string;
    social_twitter: string;
    social_instagram: string;
    social_tiktok: string;
    social_github: string;
    google_analytics_id: string;
    custom_head_scripts: string;
    custom_body_scripts: string;

    // Legacy / Fallback
    site_description?: string;
    website_logo?: string;
}

// 2. Landing Page (Singleton)
export interface LandingPage {
    // New Fields
    badge_text: string;
    badge_style: 'live_pulse' | 'ai_sparkle' | 'beta_warning' | 'rocket_launch';
    headline: string;
    subheadline: string;
    cta_primary_label: string;
    cta_primary_url: string;
    cta_secondary_label: string;
    cta_secondary_url: string;
    hero_image: string; // UUID
    visual_variant: 'interactive_3d' | 'static_glass' | 'flat_modern';

    // Legacy (Deprecated but kept for safety)
    hero_headline?: string;
    hero_subheadline?: string;
    hero_cta_primary?: string;
    hero_cta_secondary?: string;
}

// 3. Solution Modules
export interface Solution {
    id: number;
    title: string;
    description: string;
    icon: string; // Lucide icon name
    sort: number;
}

// 4. Use Cases
export interface UseCase {
    id: number;
    title: string;
    headline: string;
    description: string;
    icon: string;
    color: string;
    benefits: string[];
    sort: number;
}

// 5. Pricing Header (Singleton)
export interface PricingHeader {
    headline: string;
    subtitle: string;
    toggle_monthly_label: string;
    toggle_yearly_label: string;
    discount_percentage: number;
    trust_badge_text: string;
}

// 6. Pricing Plans (Collection)
export interface PricingPlan {
    id: number;
    sort: number;
    status: 'published' | 'draft';
    name: string;
    color: 'cyan' | 'blue' | 'purple' | 'indigo' | 'amber';
    is_popular: boolean;
    is_free: boolean;
    is_contact: boolean;
    price_monthly: number;
    seat_limit: string;
    description: string;
    features: string[] | string;
    button_label: string;
    button_url: string;
}

// 6. Posts
export interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: string;
    published_date: string;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    status: 'published' | 'draft' | 'archived';
    key_takeaways: string;
    tags: any[];
    canonical_url: string;
    is_featured: boolean;
    category: any;
}

// 7. Bio Links (Keep for /linkbio)
export interface BioLink {
    id: number;
    label: string;
    url: string;
    icon: string;
    is_active: boolean;
    sort: number;
    category: any;
}

export interface BioSettings {
    id: number;
    site_title: string;
    site_description: string;
    profile_image: string;
    background_image: string;
    custom_css: string;
}

export interface BioCategory {
    id: number;
    name: string;
    slug: string;
    icon: string;
    sort: number;
}

// 8. Silent Killer (Problem Agitation)
export interface LpRadar {
    id: number;
    section_headline: string;
    node_1_badge: string;
    node_1_title: string;
    node_1_subtitle: string;
    node_1_chart_type: string;
    node_1_bullets: string[];
    node_2_badge: string;
    node_2_title: string;
    node_2_subtitle: string;
    node_2_chart_type: string;
    node_2_bullets: string[];
    node_3_badge: string;
    node_3_title: string;
    node_3_subtitle: string;
    node_3_chart_type: string;
    node_3_bullets: string[];
}

// 8. Solution Header (Singleton)
export interface SolutionHeader {
    headline: string;
    subtitle: string;
}

// 9. Solution Card (Collection)
export interface SolutionCard {
    id: number;
    sort: number;
    status: 'published' | 'draft';
    title: string;
    description: string;
    icon: string;
    card_size: 'large' | 'small';
    color: 'cyan' | 'amber' | 'purple' | 'pink' | 'emerald';
    badge_text?: string;
    cta_text?: string;
    cta_link?: string;
}

// 10. Industry Header (Singleton)
export interface IndustryHeader {
    headline: string;
    subtitle: string;
}

// 11. Industry Tab (Collection)
export interface IndustryTab {
    id: number;
    sort: number;
    status: 'published' | 'draft';
    label: string;
    icon: string;
    color: string;
    headline: string;
    subtitle: string;
    benefits: Array<{ value: string }> | string[];
}

// 12. Security Settings (Singleton)
export interface SecuritySettings {
    badge_text: string;
    theme_color: string;
    headline: string;
    description: string;
}

// 13. Security Feature (Collection)
export interface SecurityFeature {
    id: number;
    sort: number;
    status: 'published' | 'draft';
    title: string;
    subtitle: string;
    icon: string;
}

// Schema Map
interface Schema {
    global_settings: GlobalSettings;
    lp_hero: LandingPage;
    lp_core_radar: LpRadar;
    lp_solutions_header: SolutionHeader;
    lp_industry_header: IndustryHeader;
    lp_security: SecuritySettings;
    lp_pricing: PricingHeader;
    solution_cards: SolutionCard[];
    industry_tabs: IndustryTab[];
    security_features: SecurityFeature[];
    solutions: Solution[];
    use_cases: UseCase[];
    pricing_plans: PricingPlan[];
    posts: Post[];
    bio_links: BioLink[];
    bio_settings: BioSettings;
    bio_categories: BioCategory[];
}

const directus = createDirectus<Schema>(DIRECTUS_URL)
    .with(rest({
        onRequest: (options) => ({ ...options, cache: 'no-store' }), // Disable cache for dev
    }));

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
    try {
        const result = await directus.request(readSingleton('global_settings'));

        // DEBUG LOG
        // console.log("🔥 DIRECTUS RAW:", JSON.stringify(result, null, 2));

        // CRITICAL FIX: Unwrap Array if present
        if (Array.isArray(result)) {
            // console.log("⚠️ Array detected! Unwrapping...");
            return result[0];
        }

        return result;

    } catch (error) {
        console.error("❌ Failed to fetch global settings:", error);
        return null;
    }
}

export default directus;
