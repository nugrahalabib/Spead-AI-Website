import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import SolutionModules from "@/components/sections/SolutionModules";
import PricingSection from "@/components/sections/PricingSection";
import SecuritySection from "@/components/sections/SecuritySection";

import IndustryShifter from "@/components/sections/IndustryShifter";
import directus, { Solution, UseCase, PricingPlan, LpRadar, SolutionHeader, SolutionCard, IndustryHeader, IndustryTab, SecuritySettings, SecurityFeature, PricingHeader } from "@/lib/directus";
import { readSingleton, readItems } from "@directus/sdk";

export const revalidate = 60; // Consistent revalidation

export default async function Home() {
  // Dynamic Data Fetching with Static Default Fallbacks
  let landingPage = null;
  let solutions: Solution[] = [];
  let useCases: UseCase[] = [];
  let pricingPlans: PricingPlan[] = [];
  let pricingHeader: PricingHeader | null = null;
  let problemData: LpRadar | null = null;
  let solutionHeader: SolutionHeader | null = null;
  let solutionCards: SolutionCard[] = [];
  let industryHeader: IndustryHeader | null = null;
  let industryTabs: IndustryTab[] = [];
  let securitySettings: SecuritySettings | null = null;
  let securityFeatures: SecurityFeature[] = [];

  try {
    const [lp, sk, sol, uc, pp, solHeader, solCards, indHeader, indTabs, secSettings, secFeatures, prHeader, prPlans] = await Promise.all([
      directus.request(readSingleton('lp_hero')).catch(() => null),
      directus.request(readSingleton('lp_core_radar')).catch(() => null),
      directus.request(readItems('solutions', { sort: ['sort'] })).catch(() => []),
      directus.request(readItems('use_cases', { sort: ['sort'] })).catch(() => []),
      directus.request(readItems('pricing_plans', { sort: ['sort'] })).catch(() => []),
      directus.request(readSingleton('lp_solutions_header')).catch(() => null),
      directus.request(readItems('solution_cards', { sort: ['sort'] })).catch(() => []),
      directus.request(readSingleton('lp_industry_header')).catch(() => null),
      directus.request(readItems('industry_tabs', { sort: ['sort'] })).catch(() => []),
      directus.request(readSingleton('lp_security')).catch(() => null),
      directus.request(readItems('security_features', { sort: ['sort'] })).catch(() => []),
      directus.request(readSingleton('lp_pricing')).catch(() => null),
      directus.request(readItems('pricing_plans', { sort: ['sort'] })).catch(() => []),
    ]);
    landingPage = lp;
    problemData = sk;
    solutionHeader = solHeader;
    solutionCards = solCards || [];
    industryHeader = indHeader;
    industryTabs = indTabs || [];
    securitySettings = secSettings;
    securityFeatures = secFeatures || [];
    pricingHeader = prHeader;
    pricingPlans = prPlans || [];

    solutions = sol || [];
    useCases = uc || [];
  } catch (e) {
    console.warn("Failed to fetch page data, using defaults", e);
  }

  return (
    <main className="min-h-screen overflow-hidden relative selection:bg-[#7C3AED]/30 selection:text-[#DB2777]">

      {/* Hero Section */}
      <HeroSection data={landingPage} />

      {/* Problem / Pain Points - Connected to Directus */}
      <ProblemSection data={problemData} />

      {/* Solution / Features - Connected to Directus */}
      <SolutionModules header={solutionHeader} cards={solutionCards} />

      {/* Target Audience / Use Cases - Connected to Directus */}
      <IndustryShifter header={industryHeader} tabs={industryTabs} />

      {/* Security Trust Section - Connected to Directus */}
      <SecuritySection settings={securitySettings} features={securityFeatures} />

      {/* Pricing - Connected to Directus */}
      <PricingSection header={pricingHeader} plans={pricingPlans} />

    </main>
  );
}