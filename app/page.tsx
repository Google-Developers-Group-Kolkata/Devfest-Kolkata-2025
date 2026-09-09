import LandingReveal from "@/components/ui/landing-reveal";
import DevFestHeader from "@/components/ui/devfest-header";
import ScrollTextSection from "@/components/ui/scroll-text";
import SpeakerSection from "@/components/ui/speaker";
import TestimonialSection from "@/components/ui/testimonial";
import TicketsSection from "@/components/ui/tickets";
import TeamSection from "@/components/ui/team-section";
import FAQDemo from "@/components/ui/faq3/demo";
import { Footer15 } from "@/components/ui/footer-15";
import SmoothScrollProvider from "@/components/providers/smooth-scroll";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen w-full flex flex-col justify-between bg-white text-zinc-900 overflow-x-hidden">
        {/* 1. Reveal Animation Overlay on top of Hero */}
        <LandingReveal />

        {/* 2. Main DevFest Responsive Header & Hero Section */}
        <DevFestHeader />

        {/* 3. 100vh Pinned Animated Text On Scroll (White theme with GDG 4 colors) */}
        <ScrollTextSection />

        {/* 4. 4-Column Animated Speaker Showcase (Pinned GSAP slide-in effect) */}
        <SpeakerSection />

        {/* 5. Ticket Pricing Section */}
        <TicketsSection />

        {/* 6. Testimonial Section */}
        <TestimonialSection />

        {/* 7. Team Showcase Section */}
        <TeamSection />

        {/* 8. FAQ Section */}
        <FAQDemo />

        {/* 9. Official DevFest Interactive Footer */}
        <Footer15 />
      </div>
    </SmoothScrollProvider>
  );
}
