import CTA from "@/components/homepage/CTA";
import Feature from "@/components/homepage/Feature";
import Hero from "@/components/homepage/Hero";
import Pricing from "@/components/homepage/Pricing";
import WhySpead from "@/components/homepage/WhySpead";
import SectionObserver from "@/components/reusable/SectionObserver";

export default async function Home() {
  return (
    <main className="min-h-screen overflow-hidden relative bg-background selection:bg-[#7C3AED]/30 selection:text-[#DB2777]">
      <SectionObserver id="home" amount={0.1}>
        <Hero />
      </SectionObserver>
      <SectionObserver id="features">
        <Feature />
      </SectionObserver>
      <SectionObserver id="features">
        <WhySpead />
      </SectionObserver>
      <SectionObserver id="pricing">
        <Pricing />
      </SectionObserver>
      <SectionObserver id="contact" amount={0.1}>
        <CTA />
      </SectionObserver>
    </main>
  );
}
