import { HeroSection } from "@/components/marketing/HeroSection";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { ProductPreviewSection } from "@/components/marketing/ProductPreviewSection";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { EcosystemSection } from "@/components/marketing/EcosystemSection";
import { ComparisonSection } from "@/components/marketing/ComparisonSection";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <ProductPreviewSection />
      <FeatureGrid />
      <EcosystemSection />
      <ComparisonSection />
      <CTASection />
      <Footer />
    </main>
  );
}
