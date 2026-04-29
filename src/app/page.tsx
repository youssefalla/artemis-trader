import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import AIFeatures from "@/components/landing/AIFeatures";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";
import { EtheralShadow } from "@/components/ui/etheral-shadow";

export default function LandingPage() {
  return (
    <div style={{ position: "relative", width: "100%", background: "#0a0800" }}>
      {/* Etheral shadow — only background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <EtheralShadow
          color="rgba(212,175,55,0.75)"
          animation={{ scale: 80, speed: 70 }}
          noise={{ opacity: 0, scale: 1 }}
          sizing="fill"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <ScrollReveal />
        <LandingNavbar />
        <LandingHero />
        <Stats />
        <Features />
        <AIFeatures />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <CTABanner />
        <Footer />
      </div>
    </div>
  );
}
