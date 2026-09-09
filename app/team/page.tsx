import React from "react";
import Link from "next/link";
import TeamSection from "@/components/ui/team-section";
import { Footer15 } from "@/components/ui/footer-15";
import { FaArrowLeft } from "react-icons/fa6";

export const metadata = {
  title: "Team — DevFest Kolkata '26",
  description: "Meet the organizers, leads, and creative members behind DevFest Kolkata.",
};

export default function TeamPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-white text-zinc-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-1 font-bold text-lg select-none">
              <span className="text-[#4285F4] text-xl font-mono">&lt;</span>
              <span className="flex items-center gap-0.5">
                <span className="size-2 rounded-full bg-[#EA4335]" />
                <span className="size-2 rounded-full bg-[#FBBC05]" />
                <span className="size-2 rounded-full bg-[#34A853]" />
              </span>
              <span className="text-[#4285F4] text-xl font-mono">&gt;</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-zinc-900 leading-tight">
                DevFest <span className="text-[#ea4335]">Kolkata</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">
                GDG Kolkata ‘26
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Team Section */}
      <main className="flex-1">
        <TeamSection />
      </main>

      {/* Footer */}
      <Footer15 />
    </div>
  );
}
