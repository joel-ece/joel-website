import Hero from "@/components/home/Hero";
import InitiativesPreview from "@/components/home/InitiativesPreview";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <InitiativesPreview />
      <FeaturedProjects />
      <StatsSection />
      <CTASection />
    </>
  );
}
