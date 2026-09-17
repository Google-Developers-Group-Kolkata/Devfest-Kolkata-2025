"use client";

import Link from "next/link";
import Image from "next/image";
import {
    FaXTwitter,
    FaLinkedin,
    FaInstagram,
    FaYoutube,
    FaGithub,
    FaFacebook,
    FaPeopleGroup,
    FaArrowUpRightFromSquare,
} from "react-icons/fa6";

// The chapter's own page on GDG's community platform, where every GDG Kolkata
// event is listed and people can join.
const COMMUNITY_URL = "https://gdg.community.dev/gdg-kolkata/";

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
        href: "https://www.youtube.com/@GDGKolkata2025",
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

// Two kinds of entry. `section` scrolls to a section of this page through the
// ref TramHero holds for it — no hash in the url, so nothing to keep in sync
// with the markup. `href` leaves the page, and every one of those opens in a
// new tab so a reader checking the terms doesn't lose their place.
const FOOTER_NAV = [
    {
        title: "Event",
        links: [
            { label: "Overview", section: "about" },
            { label: "Tickets", section: "tickets" },
            { label: "Venue", section: "venue" },
            { label: "Partners", section: "partners" },
            { label: "Our Team", section: "team" },
            { label: "FAQ", section: "faqs" },
        ],
    },
    {
        title: "Guidelines",
        links: [
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Use", href: "/terms-of-use" },
            { label: "Support", href: "/support" },
        ],
    },
];

// One look for both, so the column reads as a list either way.
const NAV_ITEM =
    "text-left text-sm text-zinc-400 hover:text-white transition-colors duration-150";

const FooterSection = ({ onNavigate }) => {
    const brandChars = "DevFest Kolkata '26".split("");

    return (
        <div className="w-full">
            <footer className="w-full overflow-hidden bg-[#1e1e1e] text-zinc-100 font-sans shadow-2xl border border-zinc-800">
                <div className="max-w-7xl mx-auto px-2 pt-12 pb-8 sm:px-10 sm:pt-16 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                        {/* 1. Brand & Socials */}
                        <div className="lg:col-span-4 flex flex-col gap-5">
                            <Link
                                href="/"
                                className="flex items-center gap-2.5 group transition-opacity hover:opacity-90 select-none"
                            >
                                <div className="relative h-6 sm:h-7 w-auto aspect-[109.467/63.5613] shrink-0">
                                    <Image
                                        src="/logo-brackets.svg"
                                        alt="GDG Logo"
                                        fill
                                        priority
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                                    DevFest
                                </span>
                                <span className="inline-flex items-center justify-center rounded-full bg-zinc-200 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold text-zinc-900 shadow-xs leading-none">
                                    Kolkata
                                </span>
                            </Link>

                            <p className="text-sm leading-relaxed text-zinc-400 font-normal">
                                Eastern India's flagship annual developer conference
                                powered by Google Developer Group Kolkata and Women
                                Techmakers. Uniting builders, creators, and leaders.
                            </p>

                            <div className="pt-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
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
                                                className={`size-9 rounded-xl border border-zinc-700/80 bg-zinc-800/80 text-zinc-300 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-xs ${item.hoverColor}`}
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

                        {/* 2. Navigation Columns */}
                        <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {FOOTER_NAV.map((section) => (
                                <div
                                    key={section.title}
                                    className="flex flex-col gap-3"
                                >
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                                        {section.title}
                                    </h4>
                                    <ul className="flex flex-col gap-2.5">
                                        {section.links.map((link) => (
                                            <li key={link.label}>
                                                {link.section ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onNavigate?.(link.section)
                                                        }
                                                        className={`${NAV_ITEM} cursor-pointer`}
                                                    >
                                                        {link.label}
                                                    </button>
                                                ) : (
                                                    <a
                                                        href={link.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={NAV_ITEM}
                                                    >
                                                        {link.label}
                                                    </a>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* 3. Community */}
                        <div
                            // The id is older than this card, which used to hold
                            // the newsletter sign-up. Nothing on the site links
                            // to it, but an old post might, and it still lands on
                            // the same place in the footer.
                            id="register"
                            className="lg:col-span-4 flex flex-col gap-4 bg-zinc-900/90 rounded-2xl p-6 border border-zinc-800 shadow-inner scroll-mt-28"
                        >
                            <div className="flex items-center gap-2">
                                <div className="size-8 rounded-lg bg-[#4285F4]/15 text-[#4285F4] flex items-center justify-center">
                                    <FaPeopleGroup className="size-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white tracking-tight">
                                        GDG Kolkata Community
                                    </h4>
                                    <p className="text-xs text-zinc-400">
                                        Meetups, study jams and DevFest news
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Join the chapter to hear about speaker reveals,
                                ticket drops and workshop registrations first — and
                                to find every event we run through the year.
                            </p>

                            <div className="flex flex-col gap-2.5">
                                <a
                                    href={COMMUNITY_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#EA4335] hover:bg-[#d93025] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                                >
                                    <span>Join the Community</span>
                                    <FaArrowUpRightFromSquare className="size-3" />
                                </a>
                                <span className="text-[10px] text-zinc-500 text-center">
                                    Free to join · opens gdg.community.dev
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom brand strip */}
                    <div className="mt-14 pt-8 border-t border-zinc-800/80 w-full flex flex-col items-center justify-center select-none pb-2">
                        <div className="w-full flex items-center justify-center h-[11vw] sm:h-[11vw] md:h-[11vw] lg:h-[11vw]">
                            <div
                                className="flex flex-nowrap items-center justify-center whitespace-nowrap text-zinc-500/40 hover:text-zinc-400/80 transition-colors duration-300 tracking-tighter font-black text-[10.5vw] sm:text-[10vw] md:text-[9.5vw] lg:text-[9vw] leading-none select-none max-w-full"
                                aria-label="DevFest Kolkata '26"
                            >
                                {brandChars.map((char, index) => (
                                    <span
                                        key={`${char}-${index}`}
                                        className="inline-block transition-transform duration-200 hover:-translate-y-2 hover:text-zinc-200"
                                        style={{
                                            width:
                                                char === " " ? "0.25em" : undefined,
                                        }}
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FooterSection;