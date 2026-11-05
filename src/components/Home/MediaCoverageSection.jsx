"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    motion,
    useAnimationFrame,
    useInView,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from "framer-motion";
import { youtubeEmbedSrc, youtubeIdFrom, useYouTubePlayer } from "@/lib/youtube";
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
        // The photo their post-DevFest article ran with.
        image: "/media-coverage/sangbad-pratidin-post-devfest.jpg",
        imagePosition: "15% 50%",
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
        video: "https://firebasestorage.googleapis.com/v0/b/gdg-devfest-app-94337.firebasestorage.app/o/oh%20kolkata.mp4?alt=media&token=5314826b-248d-4088-b578-f4cd5b30d537",
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
        // The photo their post-DevFest article ran with.
        image: "/media-coverage/aajkaal-post-devfest.jpg",
        imagePosition: "100% 50%",
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
        video: "https://firebasestorage.googleapis.com/v0/b/gdg-devfest-app-94337.firebasestorage.app/o/adi%20kolkata.mp4?alt=media&token=f139f2ba-5fc5-4f49-8ecd-fa66096cbe64",
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

// What sits behind a partner's card. A partner can name its own clip with
// `video` (an mp4 under /public or in Firebase Storage, e.g. a reel saved from
// Instagram), or a still with `image` (e.g. the photo a news article ran
// with); otherwise the first of its YouTube links is used. Instagram and
// Facebook links cannot be played this way — their embeds do not autoplay —
// so a partner with only those keeps the plain card until one is added.
const backdropFor = (partner) => {
    if (partner.video) {
        return { kind: "file", src: partner.video, poster: partner.poster ?? null };
    }
    if (partner.image) {
        return { kind: "image", src: partner.image, position: partner.imagePosition ?? "50% 50%" };
    }
    for (const item of partner.items) {
        if (item.platform !== "YouTube") continue;
        const id = youtubeIdFrom(item.href);
        if (id) return { kind: "youtube", id };
    }
    return null;
};

// Visitors on a data-saver connection get the poster, not a stream.
const saveData = () =>
    typeof navigator !== "undefined" && Boolean(navigator.connection?.saveData);

// A YouTube video sized to cover the card: 16:9 is wider than the card, so it
// is sized off the card's height (with some extra to crop YouTube's title bar
// off the top) and centred. The poster sits underneath until it is playing.
// Once created the player is kept for good — it is only paused while the
// section is far off screen — so it never has to load again.
const YouTubeBackdrop = ({ id, active }) => {
    const frameRef = useRef(null);
    const [mounted, setMounted] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${id}/hq720.jpg`);
    const fallBack = () => setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
    const { ready, command, settled } = useYouTubePlayer(frameRef, loaded);

    useEffect(() => {
        if (active) setMounted(true);
    }, [active]);

    useEffect(() => {
        if (ready) command(active ? "playVideo" : "pauseVideo");
    }, [ready, active, command]);

    return (
        <>
            <img
                src={poster}
                // Videos without a widescreen thumbnail get YouTube's 120px
                // grey placeholder (or an error) — fall back to the standard one.
                onError={fallBack}
                onLoad={(e) => {
                    if (e.currentTarget.naturalWidth <= 120) fallBack();
                }}
                alt=""
                draggable={false}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full scale-110 object-cover"
            />
            {mounted && (
                <iframe
                    ref={frameRef}
                    src={youtubeEmbedSrc(id)}
                    title="Background video"
                    allow="autoplay; encrypted-media"
                    referrerPolicy="strict-origin-when-cross-origin"
                    tabIndex={-1}
                    onLoad={() => setLoaded(true)}
                    className="pointer-events-none absolute left-1/2 top-1/2 border-0 transition-opacity duration-700"
                    style={{
                        width: "max(100cqw, calc(125cqh * 16 / 9))",
                        height: "max(125cqh, calc(100cqw * 9 / 16))",
                        transform: "translate(-50%, -50%)",
                        opacity: settled ? 1 : 0,
                    }}
                />
            )}
        </>
    );
};

// A clip hosted with the site: plays while the section is near, pauses when
// it is far away, and only starts downloading once it is first needed.
const FileBackdrop = ({ src, poster, active }) => {
    const ref = useRef(null);
    const [wanted, setWanted] = useState(false);

    useEffect(() => {
        if (active) setWanted(true);
        const v = ref.current;
        if (!v) return;
        if (active) v.play().catch(() => {});
        else v.pause();
    }, [active]);

    return (
        <video
            ref={ref}
            src={src}
            poster={poster ?? undefined}
            muted
            loop
            playsInline
            autoPlay={active}
            preload={wanted ? "auto" : "none"}
            disablePictureInPicture
            className="absolute inset-0 h-full w-full object-cover"
        />
    );
};

// A still photo, cropped to cover the card. `position` picks which part of a
// landscape photo stays in the portrait card.
const ImageBackdrop = ({ src, position }) => (
    <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 768px) 330px, 280px"
        draggable={false}
        className="object-cover"
        style={{ objectPosition: position }}
    />
);

// Over a video or photo the chips are frosted glass: a see-through, blurred
// pane with a bright top edge. The platform icon sits in a small white disc so
// its brand colour reads on any frame.
const CoverageChip = ({ item, onVideo }) => {
    const meta = PLATFORMS[item.platform] ?? PLATFORMS.Website;
    const Icon = meta.icon;
    return (
        <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`${meta.label} · ${item.timing}`}
            className={`inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-[12px] font-medium transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 md:text-[13px] ${
                onVideo
                    ? "border-white/35 bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_18px_rgba(0,0,0,0.22)] backdrop-blur-md backdrop-saturate-150 hover:border-white/60 hover:bg-white/25 focus-visible:outline-white"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-transparent hover:bg-white hover:shadow-md focus-visible:outline-[#4285F4]"
            }`}
            style={onVideo ? { textShadow: "0 1px 2px rgba(0,0,0,0.35)" } : undefined}
        >
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white shadow-sm">
                <Icon className="size-3" style={{ color: meta.color }} />
            </span>
            <span className="product_sans">{meta.label}</span>
        </a>
    );
};

const TimingRow = ({ label, items, onVideo }) => {
    if (!items.length) return null;
    return (
        <div>
            <div
                className="product_sans mb-2 text-[10px] uppercase tracking-[0.16em] md:text-[11px]"
                style={{
                    fontWeight: 600,
                    color: onVideo ? "rgba(255,255,255,0.78)" : "#9aa0a6",
                }}
            >
                {label}
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                    <CoverageChip key={i} item={item} onVideo={onVideo} />
                ))}
            </div>
        </div>
    );
};

const MediaPartnerCard = ({ partner, live }) => {
    const video = backdropFor(partner);
    const active = Boolean(video) && live;
    const pre = partner.items.filter((i) => i.timing === "Pre-DevFest");
    const post = partner.items.filter((i) => i.timing === "Post-DevFest");
    const onVideo = Boolean(video);

    return (
        <div
            className="google-gradient-border flex h-full min-h-[340px] w-[280px] shrink-0 flex-col rounded-[26px] bg-white md:min-h-[380px] md:w-[330px]"
            style={{
                "--gb-width": "3px",
                padding: "3px",
                boxShadow: "0 12px 34px rgba(0,0,0,0.08)",
            }}
        >
            <div
                className={`relative flex flex-1 flex-col overflow-hidden rounded-[23px] ${
                    onVideo ? "bg-[#202124]" : "bg-white"
                }`}
            >
                {video && (
                    <>
                        {/* The backdrop is a size container, so the video
                            can be sized off the card's own box. */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 overflow-hidden"
                            style={{ containerType: "size" }}
                        >
                            {video.kind === "youtube" ? (
                                <YouTubeBackdrop id={video.id} active={active} />
                            ) : video.kind === "image" ? (
                                <ImageBackdrop src={video.src} position={video.position} />
                            ) : (
                                <FileBackdrop
                                    src={video.src}
                                    poster={video.poster}
                                    active={active}
                                />
                            )}
                        </div>
                        {/* Darkened top and bottom so the name and the chips
                            read over any frame; the middle stays clear. */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.12) 32%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.72) 100%)",
                            }}
                        />
                    </>
                )}

                <div className="relative flex flex-1 flex-col gap-5 px-6 py-6 md:px-7 md:py-7">
                    <h3
                        className="product_sans text-[17px] md:text-[19px]"
                        style={{
                            fontWeight: 700,
                            lineHeight: 1.2,
                            letterSpacing: "-0.01em",
                            color: onVideo ? "#ffffff" : "#202124",
                            textShadow: onVideo ? "0 1px 12px rgba(0,0,0,0.35)" : "none",
                        }}
                    >
                        {partner.name}
                    </h3>
                    <div className={`flex flex-col gap-4 ${onVideo ? "mt-auto" : ""}`}>
                        <TimingRow label="Pre-DevFest" items={pre} onVideo={onVideo} />
                        <TimingRow label="Post-DevFest" items={post} onVideo={onVideo} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Pace of the strip, in px per second.
const SPEED = 44;

// Where card `i` has to be shifted to when the strip has moved `offset` px:
// each card slides left and, once it is fully past the left edge, jumps to the
// back of the queue on the right. The cards themselves are never swapped for
// copies, so the video in each one plays on without a break.
const wrapShift = (i, offset, pitch, total) => {
    const base = i * pitch;
    let pos = (((base - offset) % total) + total) % total;
    if (pos > total - pitch) pos -= total;
    return pos - base;
};

const StripItem = ({ index, offset, geomRef, hidden, children }) => {
    const x = useTransform(offset, (o) => {
        const g = geomRef.current;
        return g ? wrapShift(index, o, g.pitch, g.total) : 0;
    });
    return (
        <motion.div
            className="flex shrink-0"
            style={{ x }}
            aria-hidden={hidden || undefined}
            inert={hidden || undefined}
        >
            {children}
        </motion.div>
    );
};

const MediaCoverageSection = () => {
    const sectionRef = useRef(null);
    const stripRef = useRef(null);
    const rowRef = useRef(null);
    const reduced = useReducedMotion();
    // The strip moves only while it can be seen; the videos get going well
    // before that, so they are already playing when the section arrives.
    const onScreen = useInView(sectionRef);
    const near = useInView(sectionRef, { margin: "1200px 0px" });
    const [lowData, setLowData] = useState(false);
    useEffect(() => setLowData(saveData()), []);
    // Visitors who asked for less motion or less data get posters only.
    const live = near && !reduced && !lowData;

    // Card pitch and strip width, measured. One set of cards is enough unless
    // the screen is wider than the whole set, in which case it is repeated.
    const [geom, setGeom] = useState(null);
    const geomRef = useRef(null);
    const n = MEDIA_PARTNERS.length;
    const sets = geom ? Math.max(1, Math.ceil((geom.viewW + geom.pitch) / (n * geom.pitch))) : 1;

    useEffect(() => {
        const strip = stripRef.current;
        const row = rowRef.current;
        if (!strip || !row) return;
        const measure = () => {
            const first = row.firstElementChild;
            if (!first) return;
            const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
            const pitch = first.getBoundingClientRect().width + gap;
            setGeom((g) =>
                g && g.pitch === pitch && g.viewW === strip.clientWidth
                    ? g
                    : { pitch, viewW: strip.clientWidth },
            );
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(strip);
        if (row.firstElementChild) ro.observe(row.firstElementChild);
        return () => ro.disconnect();
    }, []);

    const offset = useMotionValue(0);
    useEffect(() => {
        geomRef.current = geom ? { pitch: geom.pitch, total: geom.pitch * n * sets } : null;
        // Re-place the cards for the new geometry even while the strip is paused.
        offset.set(offset.get() + 0.0001);
    }, [geom, n, sets, offset]);

    // Hovering or tabbing into the strip holds it still so a link can be hit.
    const held = useRef(false);
    useAnimationFrame((_, delta) => {
        const g = geomRef.current;
        if (!g || reduced || !onScreen || held.current) return;
        offset.set((offset.get() + (SPEED * Math.min(delta, 100)) / 1000) % g.total);
    });

    return (
        <section
            ref={sectionRef}
            id="media-coverage"
            className="relative w-full select-none"
        >
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
                    ref={stripRef}
                    onPointerEnter={() => {
                        held.current = true;
                    }}
                    onPointerLeave={() => {
                        held.current = false;
                    }}
                    onFocusCapture={() => {
                        held.current = true;
                    }}
                    onBlurCapture={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) held.current = false;
                    }}
                    className={`relative py-6 ${reduced ? "overflow-x-auto" : "overflow-hidden"}`}
                    style={{
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)",
                        maskImage:
                            "linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)",
                    }}
                >
                    <div ref={rowRef} className="flex w-max items-stretch gap-6 md:gap-8">
                        {Array.from({ length: sets }).flatMap((_, set) =>
                            MEDIA_PARTNERS.map((partner, i) => (
                                <StripItem
                                    key={`${set}-${partner.name}`}
                                    index={set * n + i}
                                    offset={offset}
                                    geomRef={geomRef}
                                    hidden={set > 0}
                                >
                                    <MediaPartnerCard partner={partner} live={live} />
                                </StripItem>
                            )),
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MediaCoverageSection;
