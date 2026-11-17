import { Hero } from "@/components/landing/Hero";
import { Capabilities } from "@/components/landing/Capabilities";
import {
  Environment,
  GraphSection,
  TimelineSection,
  DocSection,
} from "@/components/landing/PreviewSections";
import { Architecture } from "@/components/landing/Architecture";
import { Methodology, CTASection, Footer } from "@/components/landing/Sections";

export default function Home() {
  return (
    <main className="bg-bg-primary">
      <Hero />
      <Environment />
      <Capabilities />
      <GraphSection />
      <TimelineSection />
      <DocSection />
      <Architecture />
      <Methodology />
      <CTASection />
      <Footer />
    </main>
  );
}
