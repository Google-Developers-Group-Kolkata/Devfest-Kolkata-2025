"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaXmark, FaArrowRight } from "react-icons/fa6";

const NAV_LINKS = [
  { name: "Overview", id: "overview", accent: "#4285F4" },
  { name: "Speakers", id: "speakers", accent: "#EA4335" },
  { name: "Highlights", id: "highlights", accent: "#FBBC05" },
  { name: "Team", id: "team", accent: "#34A853" },
  { name: "FAQ", id: "faq", accent: "#4285F4" },
];

const MARQUEE_ITEMS = [
  "Eastern India’s Biggest Tech Festival",
  "DevFest Kolkata ‘26",
  "GDG Kolkata",
  "Eastern India’s Biggest Tech Festival",
  "DevFest Kolkata ‘26",
  "GDG Kolkata",
  "Eastern India’s Biggest Tech Festival",
  "DevFest Kolkata ‘26",
  "GDG Kolkata",
];

export default function DevFestHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("overview");
  const [footerTakeover, setFooterTakeover] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Which tab is lit: the section currently crossing the middle of the
     viewport. Squeezing the observer root down to a thin band at 50% height
     means exactly one section qualifies at a time. */
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.id)
    ).filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const crossing = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (crossing.length > 0) setActiveId(crossing[0].target.id);
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* The footer is a full-height panel. Once it has claimed ~40% of the
     viewport it owns the screen, so the navbar slides away off the top. */
  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterTakeover(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -40% 0px" }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="relative w-full h-[100svh] min-h-[580px] max-h-[1100px] overflow-hidden bg-[#090a0f] text-white flex flex-col justify-between"
      id="overview"
    >
      {/* ── 1. STICKY / FLOATING RESPONSIVE NAVBAR ───────────────────────── */}
      <nav
        aria-hidden={footerTakeover}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled
          ? "bg-black/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] border-b border-white/10 py-2.5 sm:py-3"
          : "bg-transparent border-b border-transparent shadow-none py-4 sm:py-5"
          } ${footerTakeover
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand / Logo: Logo Long from Figma */}
          <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90 select-none">
            {/* GDG Brackets Mark */}
            <div className="relative h-6 sm:h-7 w-auto aspect-[109.467/63.5613] shrink-0">
              <Image
                src="/logo-brackets.svg"
                alt="GDG Logo"
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* DevFest Wordmark */}
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
              DevFest
            </span>

            {/* Kolkata Pill Badge */}
            <span className="inline-flex items-center justify-center rounded-full bg-zinc-200 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold text-zinc-900 shadow-xs leading-none">
              Kolkata
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.id;
              return (
                <button
                  key={link.name}
                  type="button"
                  data-scroll-to={link.id}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative cursor-pointer px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                    ? "text-white bg-white/10"
                    : "text-zinc-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {link.name}
                  {/* Google-coloured underline that grows in on the live tab */}
                  <span
                    className={`pointer-events-none absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? "w-4 opacity-100" : "w-0 opacity-0"
                      }`}
                    style={{ backgroundColor: link.accent }}
                  />
                </button>
              );
            })}
          </div>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-scroll-to="tickets"
              className="hidden sm:inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#ea4335] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#d9382b] hover:shadow-[0_0_20px_rgba(234,67,53,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Tickets</span>
              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FaXmark className="size-5" /> : <FaBars className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {/* Never left hanging open behind a retracted navbar */}
          {mobileMenuOpen && !footerTakeover && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 px-6 py-5 shadow-2xl text-white"
            >
              <div className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => {
                  const isActive = activeId === link.id;
                  return (
                    <button
                      key={link.name}
                      type="button"
                      data-scroll-to={link.id}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive
                        ? "bg-white/10 text-white"
                        : "text-zinc-300 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      <span
                        className="size-1.5 shrink-0 rounded-full transition-opacity duration-200"
                        style={{
                          backgroundColor: link.accent,
                          opacity: isActive ? 1 : 0.3,
                        }}
                      />
                      {link.name}
                    </button>
                  );
                })}
                <div className="pt-3 border-t border-white/10">
                  <button
                    type="button"
                    data-scroll-to="tickets"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ea4335] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#d9382b] transition-colors"
                  >
                    <span>Get Tickets</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── 2. MAIN HERO SECTION WITH YOUTUBE VIDEO BACKGROUND ─────────── */}
      <div className="relative w-full h-full flex flex-col justify-between pt-20 pb-0">
        {/* Background YouTube Video with Ambient Dark Overlay */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          {/* 16:9 Video iframe scaled to fill viewport cover */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] sm:w-[140vw] md:w-[115vw] h-[180vh] sm:h-[140vh] md:h-[115vh] min-w-[100vw] min-h-[56.25vw] pointer-events-none">
            <iframe
              className="w-full h-full object-cover scale-110 opacity-60 contrast-110 brightness-90"
              src="https://www.youtube-nocookie.com/embed/tcrpjKyCQ2g?autoplay=1&mute=1&loop=1&playlist=tcrpjKyCQ2g&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1"
              title="DevFest Hero Background Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Dark gradient scrims & vignettes for contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#090a0f]/85 via-black/55 to-[#090a0f]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,10,15,0.7)_100%)]" />

          {/* Google dot matrix, so the hero reads as part of the same system */}
          <div
            className="gdg-layer gdg-dots"
            style={
              {
                "--gdg-dot-color": "rgba(255,255,255,0.11)",
                "--gdg-dot-size": "26px",
                "--gdg-dot-mask":
                  "radial-gradient(100% 65% at 50% 28%, #000 0%, transparent 78%)",
              } as React.CSSProperties
            }
          />
        </div>

        {/* Hero Content Center (True Middle Centering: absolute centered in viewport, accounted for fixed nav and bottom tram) */}
        <div className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center my-auto">
          {/* Group 62 Vector Emblem from Figma (DevFest { Kolkata '26 }) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center select-none"
          >
            <div className="relative w-[320px] sm:w-[480px] md:w-[560px] lg:w-[620px] max-w-[92vw] aspect-[475/133.427] drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] filter">
              <Image
                src="/group62.svg"
                alt="DevFest { Kolkata '26 }"
                fill
                priority
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Subtitle: Kolkata's biggest tech festival */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="mt-4 sm:mt-5 text-base sm:text-xl md:text-2xl font-medium text-zinc-300 tracking-tight"
          >
            GDG Kolkata presents Kolkata&apos;s biggest tech festival.
          </motion.p>

          {/* Two Hero CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 pointer-events-auto z-20"
          >
            {/* Primary CTA: Explore Tickets */}
            <button
              type="button"
              data-scroll-to="tickets"
              className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#ea4335] px-6 sm:px-7 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all duration-200 hover:bg-[#d9382b] hover:shadow-[0_0_30px_rgba(234,67,53,0.5)] hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Explore Tickets</span>
              <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {/* Secondary CTA: Explore Speakers */}
            <button
              type="button"
              data-scroll-to="speakers"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-6 sm:px-7 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-white/20 hover:border-white/40 hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Explore Speakers</span>
            </button>
          </motion.div>
        </div>

        {/* ── 3. HERITAGE TRAM, OVERHEAD WIRE & MARQUEE BOX (IN HERO ONLY) ── */}
        <div className="relative z-10 w-full overflow-x-clip shrink-0 mt-auto">
          {/* Tram Bay: Positioned directly above the marquee box */}
          <div className="relative w-full h-[70px] sm:h-[80px] md:h-[100px] lg:h-[120px]">
            {/* Kolkata Heritage Tram: travels left-to-right, exits, waits off-screen, then re-enters naturally */}
            <div className="animate-tram absolute bottom-0 left-0 h-full w-auto pointer-events-auto z-10 cursor-pointer">
              {/* Subtle vintage suspension sway / rhythmic vibration on tracks */}
              <div className="animate-tram-sway h-full flex items-end">
                <Image
                  src="/kolkata-tram.svg"
                  alt="Heritage Kolkata Tram"
                  width={417}
                  height={161}
                  unoptimized
                  className="h-full w-auto object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] select-none"
                  priority
                />
              </div>
            </div>
          </div>

          {/* ── 4. TICKER / MARQUEE BANNER STRIP (WHEELS ALIGNED ON TOP EDGE) ── */}
          <div className="relative w-full bg-[#121319]/90 backdrop-blur-md text-[#e9e9e9] py-2.5 sm:py-3.5 overflow-hidden border-t-2 border-white/10 shadow-2xl select-none">
            <div className="animate-marquee flex items-center whitespace-nowrap">
              {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, index) => (
                <div key={index} className="flex items-center gap-4 sm:gap-6 px-3 sm:px-5">
                  <span className="text-xs sm:text-sm md:text-base font-semibold tracking-wide text-zinc-300">
                    {item}
                  </span>
                  {/* Diamond Rotated Bullet from Figma */}
                  <div className="size-2 sm:size-2.5 bg-[#d9d9d9] rotate-45 shrink-0 opacity-80" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
