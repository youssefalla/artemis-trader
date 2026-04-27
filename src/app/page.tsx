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
import GlassFilter from "@/components/landing/GlassFilter";
import { GoldGradientBg } from "@/components/ui/elegant-gold-pattern";

export default function LandingPage() {
  return (
    <GoldGradientBg>
      <GlassFilter />
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
    </GoldGradientBg>
  );
}
