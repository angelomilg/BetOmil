import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import HeroSection from "@/components/Sections/HeroSection";
import BenefitsSection from "@/components/Sections/BenefitsSection";
import HowItWorksSection from "@/components/Sections/HowItWorksSection";
import TrustSection from "@/components/Sections/TrustSection";
import CTASection from "@/components/Sections/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}