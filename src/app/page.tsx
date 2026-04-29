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
import HomeBackground from "@/components/landing/HomeBackground";

export default function LandingPage() {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <HomeBackground />

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
