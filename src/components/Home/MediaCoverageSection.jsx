"use client";

import {
    FaGlobe,
    FaInstagram,
    FaFacebookF,
    FaXTwitter,
    FaYoutube,
    FaLinkedinIn,
} from "react-icons/fa6";

const PLATFORMS = {
    Website: { icon: FaGlobe, color: "#4285F4", label: "Website" },
    Instagram: { icon: FaInstagram, color: "#EA4335", label: "Instagram" },
    Facebook: { icon: FaFacebookF, color: "#1877F2", label: "Facebook" },
    Twitter: { icon: FaXTwitter, color: "#202124", label: "Twitter / X" },
    YouTube: { icon: FaYoutube, color: "#EA4335", label: "YouTube" },
    LinkedIn: { icon: FaLinkedinIn, color: "#0A66C2", label: "LinkedIn" },
};

const MEDIA_PARTNERS = [
    {
        name: "Sangbaad Pratidin",
        items: [
            {
                platform: "Website",
                timing: "Pre-DevFest",
                href: "https://www.sangbadpratidin.in/lifestyle/tech/devfest-kolkata-2025-is-being-organized-by-gdg-kolkata/",
            },
            {
                platform: "Instagram",
                timing: "Pre-DevFest",
                href: "https://www.instagram.com/p/DSOicEpAR4q/",
            },
            {
                platform: "Facebook",
                timing: "Pre-DevFest",
                href: "https://www.facebook.com/share/p/14P5LSC11nN/",
            },
            {
                platform: "Twitter",
                timing: "Pre-DevFest",
                href: "https://x.com/SangbadPratidin/status/1999873744886702144?s=20",
            },
            {
                platform: "Website",
                timing: "Post-DevFest",
                href: "https://www.sangbadpratidin.in/kolkata/devfest-kolkata-2025-special-conference-held-to-further-increase-googles-popularity/",
            },
            {
                platform: "Facebook",
                timing: "Post-DevFest",
                href: "https://www.facebook.com/share/v/16bxDui5SE/",
            },
            {
                platform: "Twitter",
                timing: "Post-DevFest",
                href: "https://x.com/SangbadPratidin/status/2003083923711242308",
            },
        ],
    },
    {
        name: "The Wall",
        items: [
            {
                platform: "Website",
                timing: "Pre-DevFest",
                href: "https://www.thewall.in/west-bengal/kolkata/devfest-kolkata-2025-full-details/tid/180556",
            },
            {
                platform: "Facebook",
                timing: "Pre-DevFest",
                href: "https://www.facebook.com/share/p/1CqTdAwmWX/",
            },
            {
                platform: "Twitter",
                timing: "Pre-DevFest",
                href: "https://x.com/TheWallTweets/status/2000565760780095558",
            },
            {
                platform: "Website",
                timing: "Post-DevFest",
                href: "https://www.thewall.in/west-bengal/kolkata/devfest-kolkata-2025/tid/18296",
            },
            {
                platform: "Facebook",
                timing: "Post-DevFest",
                href: "https://www.facebook.com/share/v/1FBRY4L8se/",
            },
            {
                platform: "YouTube",
                timing: "Post-DevFest",
                href: "https://youtu.be/Cjr92_uhMIw",
            },
        ],
    },
    {
        name: "Wiki Kolkata",
        items: [
            {
                platform: "Website",
                timing: "Pre-DevFest",
                href: "https://www.wikikolkata.com/english/event/devfest-kolkata-2025-citys-biggest-tech-celebration-set-to-ignite-innovation-and-community-spirit/",
            },
            {
                platform: "Instagram",
                timing: "Pre-DevFest",
                href: "https://www.instagram.com/reel/DSXVxoZDpAD/",
            },
            {
                platform: "Facebook",
                timing: "Pre-DevFest",
                href: "https://www.facebook.com/share/r/1APRX4NerX/",
            },
            {
                platform: "LinkedIn",
                timing: "Pre-DevFest",
                href: "https://www.linkedin.com/posts/wikikolkata_devfestkolkata-gdgkolkata-devfest2025-activity-7407037150333952000-60tp",
            },
            {
                platform: "Website",
                timing: "Post-DevFest",
                href: "https://www.wikikolkata.com/english/event/gdg-kolkata-focuses-on-long-term-community-growth-beyond-devfest-2025/",
            },
            {
                platform: "Instagram",
                timing: "Post-DevFest",
                href: "https://www.instagram.com/reel/DSkKeL_DmAm/",
            },
            {
                platform: "Facebook",
                timing: "Post-DevFest",
                href: "https://www.facebook.com/share/r/17z4LQRFFA/",
            },
            {
                platform: "YouTube",
                timing: "Post-DevFest",
                href: "https://youtu.be/lo5rbbqG9-4",
            },
        ],
    },
    {
        name: "Kolkata TV",
        items: [
            {
                platform: "Instagram",
                timing: "Pre-DevFest",
                href: "https://www.instagram.com/reel/DSZ1s_6gPcs/",
            },
            {
                platform: "Facebook",
                timing: "Pre-DevFest",
                href: "https://www.facebook.com/share/v/1GzddicEKT/",
            },
            {
                platform: "Instagram",
                timing: "Post-DevFest",
                href: "https://www.instagram.com/reel/DSu0evmgEUF/",
            },
            {
                platform: "Facebook",
                timing: "Post-DevFest",
                href: "https://www.facebook.com/share/v/17a2Y1mK6q/",
            },
            {
                platform: "YouTube",
                timing: "Post-DevFest",
                href: "https://m.youtube.com/watch?v=8HRp4xj93TU",
            },
        ],
    },
    {
        name: "91.9 Friend FM",
        items: [
            {
                platform: "Instagram",
                timing: "Post-DevFest",
                href: "https://www.instagram.com/reel/DSbult7ku8f/",
            },
            {
                platform: "Facebook",
                timing: "Post-DevFest",
                href: "https://www.facebook.com/share/v/1BcihXCCVm/",
            },
            {
                platform: "YouTube",
                timing: "Post-DevFest",
                href: "https://www.youtube.com/live/9feaH1I3EKA?si=Rv_vryOT18GFsI4d",
            },
        ],
    },
    {
        name: "OH Kolkata",
        items: [
            {
                platform: "Instagram",
                timing: "Pre-DevFest",
                href: "https://www.instagram.com/reel/DSAJyHjkn2O/",
            },
            {
                platform: "Instagram",
                timing: "Pre-DevFest",
                href: "https://www.instagram.com/reel/DScr8h5kgsa/",
            },
            {
                platform: "Facebook",
                timing: "Pre-DevFest",
                href: "https://www.facebook.com/share/v/1BezTGZ5Tz/",
            },
            {
                platform: "LinkedIn",
                timing: "Pre-DevFest",
                href: "https://www.linkedin.com/posts/oh-kolkata_devfestkolkata-gdgkolkata-techconference-activity-7403771498999623680-OaLr",
            },
            {
                platform: "Instagram",
                timing: "Post-DevFest",
                href: "https://www.instagram.com/reel/DTKPl_FEuZb/",
            },
        ],
    },
    {
        name: "Aajkaal In (Digital)",
        items: [
            {
                platform: "Website",
                timing: "Post-DevFest",
                href: "https://www.aajkaal.in/kolkata/devfest-kolkata-2025-the-annual-flagship-tech-conference-of-google-developer-groups-182842",
            },
            {
                platform: "Instagram",
                timing: "Post-DevFest",
                href: "https://www.instagram.com/p/DSxYCF_kh4O/",
            },
            {
                platform: "Facebook",
                timing: "Post-DevFest",
                href: "https://www.facebook.com/share/p/1RBVnB9cMc/",
            },
        ],
    },
    {
        name: "Adi Kolkata",
        items: [
            {
                platform: "Instagram",
                timing: "Pre-DevFest",
                href: "https://www.instagram.com/reel/DSP4PaQkoQP/",
            },
            {
                platform: "Facebook",
                timing: "Pre-DevFest",
                href: "https://www.facebook.com/share/r/1AUqaxsaSf/",
            },
            {
                platform: "Instagram",
                timing: "Post-DevFest",
                href: "https://www.instagram.com/reel/DS4QNqbEZ37/",
            },
            {
                platform: "Facebook",
                timing: "Post-DevFest",
                href: "https://www.facebook.com/share/r/1YZbeZsYph/",
            },
        ],
    },
];

const MARQUEE_COPIES = 4;

const CoverageChip = ({ item }) => {
    const meta = PLATFORMS[item.platform] ?? PLATFORMS.Website;
    const Icon = meta.icon;
    return (
        <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`${meta.label} · ${item.timing}`}
            className="group/chip inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[12px] font-medium text-zinc-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-white hover:shadow-md md:text-[13px]"
        >
            <Icon className="size-3.5 shrink-0" style={{ color: meta.color }} />
            <span className="product_sans">{meta.label}</span>
        </a>
    );
};

const TimingRow = ({ label, items }) => {
    if (!items.length) return null;
    return (
        <div>
            <div
                className="product_sans mb-2 text-[10px] uppercase tracking-[0.16em] md:text-[11px]"
                style={{ fontWeight: 600, color: "#9aa0a6" }}
            >
                {label}
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                    <CoverageChip key={i} item={item} />
                ))}
            </div>
        </div>
    );
};

const MediaPartnerCard = ({ partner }) => {
    const pre = partner.items.filter((i) => i.timing === "Pre-DevFest");
    const post = partner.items.filter((i) => i.timing === "Post-DevFest");
    return (
        <div
            className="google-gradient-border flex h-full w-[280px] shrink-0 flex-col rounded-[26px] bg-white md:w-[330px]"
            style={{
                "--gb-width": "3px",
                padding: "3px",
                boxShadow: "0 12px 34px rgba(0,0,0,0.08)",
            }}
        >
            <div className="flex h-full flex-col gap-5 rounded-[23px] bg-white px-6 py-6 md:px-7 md:py-7">
                <h3
                    className="product_sans text-[17px] md:text-[19px]"
                    style={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        letterSpacing: "-0.01em",
                        color: "#202124",
                    }}
                >
                    {partner.name}
                </h3>
                <div className="flex flex-col gap-4">
                    <TimingRow label="Pre-DevFest" items={pre} />
                    <TimingRow label="Post-DevFest" items={post} />
                </div>
            </div>
        </div>
    );
};

const MediaCoverageSection = () => {
    return (
        <section id="media-coverage" className="relative w-full select-none">
            <div className="mx-auto w-full max-w-[1120px] px-5 pt-16 pb-12 sm:px-8 md:px-10 md:pt-24 md:pb-16 xl:px-16 xl:pt-28">
                <h2
                    className="product_sans text-center text-[28px] sm:text-[34px] md:text-[42px] lg:text-[52px] xl:text-[56px]"
                    style={{
                        fontWeight: 700,
                        lineHeight: 1.05,
                        letterSpacing: "-0.01em",
                        color: "#000000",
                    }}
                >
                    Media <span style={{ color: "#EA4335" }}>Coverage</span>
                </h2>

                <p
                    className="product_sans mx-auto mt-4 max-w-[680px] text-center text-[15px] md:mt-6 md:text-[17px] xl:text-[18px]"
                    style={{
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: "#5f6368",
                    }}
                >
                    How DevFest Kolkata 2025 was covered by our media partners —
                    across print, digital, social and video. Every link opens the
                    original source.
                </p>

            </div>

            <div className="relative w-full px-5 sm:px-8 md:px-10 xl:px-16">
                <div
                    className="marquee-wrap relative overflow-hidden py-6 motion-reduce:overflow-x-auto"
                    style={{
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)",
                        maskImage:
                            "linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)",
                    }}
                >
                    <div
                        className="marquee-track items-stretch"
                        style={{
                            "--marquee-duration": "65s",
                            "--marquee-shift": `-${100 / MARQUEE_COPIES}%`,
                        }}
                    >
                        {Array.from({ length: MARQUEE_COPIES }).map((_, copy) => (
                            <div
                                key={copy}
                                className="flex shrink-0 items-stretch gap-6 pr-6 md:gap-8 md:pr-8"
                                aria-hidden={copy > 0 ? true : undefined}
                                inert={copy > 0 ? true : undefined}
                            >
                                {MEDIA_PARTNERS.map((partner) => (
                                    <MediaPartnerCard
                                        key={partner.name}
                                        partner={partner}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MediaCoverageSection;
