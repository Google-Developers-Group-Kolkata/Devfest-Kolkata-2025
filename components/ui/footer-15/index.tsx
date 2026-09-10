"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaFacebook,
  FaArrowRight,
  FaArrowUp,
  FaCheck,
  FaEnvelope,
} from "react-icons/fa6";
import SectionPattern from "@/components/ui/section-pattern";
import GoogleDots from "@/components/ui/google-dots";

const SOCIAL_LINKS = [
  {
    name: "Twitter / X",
    href: "https://x.com/gdgkolkata",
    icon: FaXTwitter,
    hoverColor: "hover:text-zinc-100 hover:bg-zinc-800",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/gdgkolkata/",
    icon: FaLinkedin,
    hoverColor: "hover:text-[#4285F4] hover:bg-[#4285F4]/10",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/gdgkolkata/",
    icon: FaInstagram,
    hoverColor: "hover:text-[#EA4335] hover:bg-[#EA4335]/10",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@GDGKolkata",
    icon: FaYoutube,
    hoverColor: "hover:text-[#EA4335] hover:bg-[#EA4335]/10",
  },
  {
    name: "GitHub",
    href: "https://github.com/gdgkolkata",
    icon: FaGithub,
    hoverColor: "hover:text-zinc-100 hover:bg-zinc-800",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/gdgkolkata/",
    icon: FaFacebook,
    hoverColor: "hover:text-[#4285F4] hover:bg-[#4285F4]/10",
  },
];

interface FooterNavItem {
  label: string;
  /** A route, internal or off-site. */
  href?: string;
  /** A section on the home page, reached without a hash. */
  section?: string;
}

const FOOTER_NAV: {
  title: string;
  accent: string;
  links: FooterNavItem[];
}[] = [
  {
    title: "Event",
    accent: "#4285F4",
    links: [
      { label: "Overview", section: "overview" },
      { label: "Mystery Speakers", section: "speakers" },
      { label: "Our Team", href: "/team" },
      { label: "FAQ", section: "faq" },
    ],
  },
  {
    title: "Community",
    accent: "#EA4335",
    links: [
      { label: "GDG Kolkata", href: "https://gdg.community.dev/gdg-kolkata/" },
      { label: "Women Techmakers", href: "https://devfestkolkata.in" },
      { label: "Google Developers", href: "https://developers.google.com" },
      { label: "Become Volunteer", href: "https://devfestkolkata.in" },
    ],
  },
  {
    title: "Guidelines",
    accent: "#34A853",
    links: [
      { label: "Code of Conduct", href: "https://devfestkolkata.in" },
      { label: "Community Terms", href: "https://devfestkolkata.in" },
      { label: "Privacy Policy", href: "https://devfestkolkata.in" },
    ],
  },
];

const LINK_CLASS =
  "group/link inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors duration-150 hover:text-white";

interface FooterLinkProps {
  label: string;
  /** A route, internal or off-site. */
  href?: string;
  /** A section on the home page, reached without a hash. */
  section?: string;
}

/* The footer renders on /team as well, so a section link is a real link to
   "/" that additionally names its target: on the home page the Lenis handler
   intercepts and glides, elsewhere the router goes home and the section is
   picked up on arrival. */
function FooterLink({ href, section, label }: FooterLinkProps) {
  if (section) {
    return (
      <Link href="/" data-scroll-to={section} className={LINK_CLASS}>
        {label}
      </Link>
    );
  }

  if (!href) return null;

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_CLASS}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={LINK_CLASS}>
      {label}
    </Link>
  );
}

export function Footer15() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const brandChars = "DevFest Kolkata ‘26".split("");

  return (
    /* `id` is the hook the navbar's IntersectionObserver watches so it can
       retract once this full-height panel takes over the viewport. */
    <div id="site-footer" className="relative w-full px-2 sm:px-3">
      <footer className="relative flex min-h-[100svh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-b-0 border-zinc-800 bg-[#141518] font-sans text-zinc-100 shadow-2xl">
        <SectionPattern
          variant="dots"
          tone="dark"
          glow={0.22}
          brackets
          ribbon="top"
          dotSize={26}
        />

        <div className="relative z-10 flex flex-1 flex-col justify-between gap-14 px-5 pt-14 pb-6 sm:px-10 sm:pt-20 lg:px-12">
          {/* ── 1. Closing statement ── */}
          <div className="flex flex-col gap-5">
            <span className="inline-flex items-center gap-2.5 self-start rounded-full border border-white/10 bg-white/5 px-3.5 py-1 backdrop-blur-sm">
              <GoogleDots variant="orbit" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                DevFest Kolkata ‘26
              </span>
            </span>

            <h2 className="max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
              See you in{" "}
              <span className="text-[#4285F4]">Kol</span>
              <span className="text-[#EA4335]">ka</span>
              <span className="text-[#FBBC05]">ta</span>
              <span className="text-[#34A853]">.</span>
            </h2>

            <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Dates, venue and the full speaker lineup drop soon. Lock your
              seat early and be first to hear about it.
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                data-scroll-to="tickets"
                className="group inline-flex items-center gap-2 rounded-full bg-[#EA4335] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#d93025] hover:shadow-[0_0_28px_rgba(234,67,53,0.4)] active:scale-[0.98]"
              >
                <span>Get Tickets</span>
                <FaArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/"
                data-scroll-to="faq"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-zinc-200 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                Read the FAQ
              </Link>
            </div>
          </div>

          {/* ── 2. Brand / navigation / newsletter ── */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Brand & socials */}
            <div className="flex flex-col gap-5 lg:col-span-4">
              <Link
                href="/"
                className="flex select-none items-center gap-2.5 transition-opacity hover:opacity-90"
              >
                <div className="relative h-6 w-auto shrink-0 aspect-[109.467/63.5613] sm:h-7">
                  <Image
                    src="/logo-brackets.svg"
                    alt="GDG Logo"
                    fill
                    className="object-contain"
                  />
                </div>

                <span className="text-xl font-black leading-none tracking-tight text-white sm:text-2xl">
                  DevFest
                </span>

                <span className="inline-flex items-center justify-center rounded-full bg-zinc-200 px-2.5 py-1.5 text-xs font-bold leading-none text-zinc-900 shadow-xs sm:px-3 sm:text-sm">
                  Kolkata
                </span>
              </Link>

              <p className="text-sm font-normal leading-relaxed text-zinc-400">
                Eastern India’s flagship annual developer conference powered by
                Google Developer Group Kolkata and Women Techmakers. Uniting
                builders, creators, and leaders.
              </p>

              <div className="pt-1">
                <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                  Connect with GDG Kolkata
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {SOCIAL_LINKS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex size-9 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-800/60 text-zinc-300 shadow-xs transition-all duration-200 hover:scale-105 ${item.hoverColor}`}
                        title={item.name}
                        aria-label={item.name}
                      >
                        <Icon className="size-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-4">
              {FOOTER_NAV.map((section) => (
                <div key={section.title} className="flex flex-col gap-3">
                  <h4 className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-300">
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: section.accent }}
                    />
                    {section.title}
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <FooterLink
                          href={link.href}
                          section={link.section}
                          label={link.label}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div
              id="register"
              className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-inner backdrop-blur-sm scroll-mt-28 lg:col-span-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#EA4335]/15 text-[#EA4335]">
                  <FaEnvelope className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-white">
                    DevFest Dispatch
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Never miss a drop or announcement
                  </p>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-zinc-400">
                Subscribe to get mystery speaker reveals, ticket announcements,
                and workshop registration links sent straight to your inbox.
              </p>

              {subscribed ? (
                <div className="flex animate-in items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-400 duration-300 fade-in">
                  <FaCheck className="size-4 shrink-0 text-emerald-400" />
                  <span>
                    You&apos;re subscribed! Stay tuned for speaker &amp; ticket
                    drops.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 transition-all placeholder:text-zinc-500 focus:border-[#4285F4] focus:outline-none focus:ring-1 focus:ring-[#4285F4]"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#EA4335] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:bg-[#d93025] hover:shadow-lg active:scale-[0.98]"
                  >
                    <span>Join Mailing List</span>
                    <FaArrowRight className="size-3" />
                  </button>
                  <span className="text-center text-[10px] text-zinc-500">
                    No spam. Unsubscribe anytime.
                  </span>
                </form>
              )}
            </div>
          </div>

          {/* ── 3. Oversized wordmark + legal bar ── */}
          <div className="flex flex-col gap-5">
            <div
              className="flex w-full select-none items-center justify-center"
              style={{ lineHeight: 1 }}
            >
              <div
                className="flex max-w-full flex-nowrap items-center justify-center whitespace-nowrap font-display text-[10.5vw] font-black leading-none tracking-tighter text-zinc-500/40 transition-colors duration-300 hover:text-zinc-400/80 sm:text-[10vw] md:text-[9.5vw] lg:text-[9vw]"
                aria-label="DevFest Kolkata ‘26"
              >
                {brandChars.map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className="inline-block transition-transform duration-200 hover:-translate-y-2 hover:text-zinc-200"
                    style={{ width: char === " " ? "0.25em" : undefined }}
                  >
                    {char === " " ? " " : char}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-zinc-800/80 pt-5 sm:flex-row">
              <p className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500 sm:text-left">
                © {new Date().getFullYear()} GDG Kolkata · DevFest is a Google
                Developer Groups program
              </p>

              <button
                type="button"
                onClick={scrollToTop}
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                <span>Back to top</span>
                <FaArrowUp className="size-3 transition-transform duration-200 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer15;
