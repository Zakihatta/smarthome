// src/app/page.tsx
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection"; // <--- Import baru
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <FAQSection />  

      <div className="h-12 bg-background"></div>
    </>
  );
}