"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FaPlay, FaYoutube } from "react-icons/fa6";
import { Volume2, VolumeX } from "lucide-react";
import { youtubeEmbedSrc, useYouTubePlayer } from "@/lib/youtube";

const VIDEO = {
    id: "BsEhnyiihK0",
    title: "DevFest Kolkata 2025",
    poster: "https://i.ytimg.com/vi/BsEhnyiihK0/maxresdefault.jpg",
};

const photo = (n, alt) => ({
    src: `/previous-years/previous-years-${String(n).padStart(2, "0")}.webp`,
    alt,
});

// The four tiles around the video. Each one slowly cycles through its own
// photos, so every shot gets shown without the grid growing. `color`/`ink`
// paint the tile's tag in one of the Google colours.
const TILES = [
    {
        title: "Main stage",
        color: "#1A73E8",
        ink: "#ffffff",
        photos: [
            photo(2, "The keynote beginning on the main stage"),
            photo(4, "Attendees filling the main auditorium"),
        ],
    },
    {
        title: "Community",
        color: "#188038",
        ink: "#ffffff",
        photos: [
            photo(8, "Attendees networking between sessions"),
            photo(6, "Volunteers at the registration desk"),
        ],
    },
    {
        title: "Packed halls",
        color: "#D93025",
        ink: "#ffffff",
        photos: [
            photo(3, "A packed hall during a DevFest session"),
            photo(5, "A full session hall during the conference"),
            photo(7, "Attendees seated through a session"),
        ],
    },
    {
        title: "Booths & breaks",
        color: "#FBBC04",
        ink: "#202124",
        photos: [
            photo(1, "Attendees at the DevFest Kolkata booth under a bamboo pavilion"),
            photo(9, "Lunch being served at the venue"),
        ],
    },
];

const CYCLE_MS = 4800;
const EASE = [0.33, 0, 0.2, 1];
const TILE_RADIUS = "rounded-[20px] sm:rounded-[24px] lg:rounded-[28px]";
const TILE_SHADOW = "0 12px 34px rgba(0,0,0,0.10)";

const reveal = (reduced, delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, ease: EASE, delay },
});

// The big tile. It plays the recap muted and on loop while it is on screen —
// browsers only allow autoplay without sound — and pauses when scrolled away.
// The sound button unmutes it through the YouTube player's postMessage API.
// Visitors who ask for reduced motion get a poster and a play button instead.
const VideoTile = ({ reduced }) => {
    const tileRef = useRef(null);
    const frameRef = useRef(null);
    // The player is created well before the tile arrives, so it is already
    // running by then, and it is only paused once the tile is entirely off
    // screen — it never sits still while any of it can be seen.
    const near = useInView(tileRef, { once: true, margin: "1000px 0px" });
    const visible = useInView(tileRef, { margin: "150px 0px" });
    const [started, setStarted] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [muted, setMuted] = useState(true);

    const autoplay = !reduced;
    const mounted = autoplay ? near : started;

    // Captions YouTube switches on for muted autoplay would sit on top of the
    // tile, so the background player drops them.
    const { ready: apiReady, command, settled } = useYouTubePlayer(frameRef, loaded, {
        hideCaptions: autoplay,
    });

    useEffect(() => {
        if (autoplay && apiReady) command(visible ? "playVideo" : "pauseVideo");
    }, [autoplay, apiReady, visible, command]);

    const toggleSound = () => {
        if (muted) {
            command("unMute");
            command("playVideo");
        } else {
            command("mute");
        }
        setMuted(!muted);
    };

    const showOverlay = autoplay || !started;

    return (
        <motion.div
            ref={tileRef}
            className={`relative aspect-video w-full overflow-hidden bg-[#202124] ${TILE_RADIUS}`}
            style={{ boxShadow: TILE_SHADOW }}
            {...reveal(reduced)}
        >
            <img
                src={VIDEO.poster}
                alt=""
                draggable={false}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
            />

            {mounted && (
                <iframe
                    ref={frameRef}
                    src={youtubeEmbedSrc(VIDEO.id, { background: autoplay })}
                    title={`${VIDEO.title} — video`}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    referrerPolicy="strict-origin-when-cross-origin"
                    tabIndex={autoplay ? -1 : 0}
                    onLoad={() => setLoaded(true)}
                    // A background player waits behind the poster until
                    // YouTube's start-up buttons have cleared; a player started
                    // by hand shows at once, controls and all.
                    className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${
                        (autoplay ? settled : loaded) ? "opacity-100" : "opacity-0"
                    } ${autoplay ? "pointer-events-none" : ""}`}
                />
            )}

            {showOverlay && (
                <>
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 42%, rgba(0,0,0,0) 68%), linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 50%)",
                        }}
                    />

                    {!autoplay && (
                        <button
                            type="button"
                            onClick={() => setStarted(true)}
                            aria-label={`Play ${VIDEO.title}`}
                            className="group absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#EA4335] shadow-lg transition-transform duration-300 hover:scale-110 md:h-16 md:w-16"
                        >
                            <FaPlay className="ml-0.5 size-5 text-white md:size-6" />
                        </button>
                    )}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6 lg:p-8">
                        <div className="min-w-0">
                            <h3
                                className="product_sans hidden text-white sm:block sm:text-[28px] md:text-[34px] lg:text-[40px]"
                                style={{
                                    fontWeight: 700,
                                    lineHeight: 1.05,
                                    letterSpacing: "-0.01em",
                                    textShadow: "0 2px 18px rgba(0,0,0,0.35)",
                                }}
                            >
                                Relive DevFest
                                <br />
                                Kolkata 2025
                            </h3>
                            <a
                                href={`https://www.youtube.com/watch?v=${VIDEO.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="product_sans pointer-events-auto inline-flex items-center gap-2 rounded-xl bg-[#EA4335] px-3.5 py-2 text-[13px] text-white shadow-lg transition-colors duration-300 hover:bg-[#D93025] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:mt-5 sm:px-5 sm:py-3 sm:text-[15px]"
                                style={{ fontWeight: 600 }}
                            >
                                <FaYoutube className="size-4 sm:size-5" />
                                Watch on YouTube
                            </a>
                        </div>

                        {autoplay && (
                            <button
                                type="button"
                                onClick={toggleSound}
                                disabled={!apiReady}
                                aria-label={muted ? "Turn sound on" : "Turn sound off"}
                                aria-pressed={!muted}
                                className="pointer-events-auto flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#202124] shadow-lg backdrop-blur transition duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:opacity-50 disabled:hover:scale-100 sm:h-11 sm:w-11"
                            >
                                {muted ? (
                                    <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                                ) : (
                                    <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                            </button>
                        )}
                    </div>
                </>
            )}
        </motion.div>
    );
};

// A photo tile. While the grid is on screen it crossfades through its photos;
// each tile starts at a different offset so they never all change at once.
const PhotoTile = ({ tile, index, cycling, reduced, className }) => {
    const [shown, setShown] = useState(0);
    const count = tile.photos.length;

    useEffect(() => {
        if (!cycling || count < 2) return;
        let timer;
        const advance = () => setShown((s) => (s + 1) % count);
        const start = setTimeout(() => {
            advance();
            timer = setInterval(advance, CYCLE_MS);
        }, CYCLE_MS / 2 + index * 1200);
        return () => {
            clearTimeout(start);
            clearInterval(timer);
        };
    }, [cycling, count, index]);

    return (
        <motion.div
            className={`group relative overflow-hidden bg-[#e8eaed] ${TILE_RADIUS} ${className}`}
            style={{ boxShadow: TILE_SHADOW }}
            {...reveal(reduced, 0.08 + index * 0.08)}
        >
            {tile.photos.map((p, i) => (
                <img
                    key={p.src}
                    src={p.src}
                    alt={p.alt}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105"
                    style={{
                        opacity: i === shown ? 1 : 0,
                        transition:
                            "opacity 1.2s ease, transform 0.6s cubic-bezier(0.33, 0, 0.2, 1)",
                    }}
                />
            ))}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.30) 100%)",
                }}
            />

            <span
                className="product_sans absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] shadow-md sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[13px] lg:left-5 lg:top-5"
                style={{
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    background: tile.color,
                    color: tile.ink,
                }}
            >
                {tile.title}
            </span>

            {count > 1 && (
                <span
                    aria-hidden="true"
                    className="absolute bottom-3 right-3 flex gap-1.5 sm:bottom-4 sm:right-4"
                >
                    {tile.photos.map((p, i) => (
                        <span
                            key={p.src}
                            className="h-1.5 rounded-full bg-white transition-all duration-500"
                            style={{
                                width: i === shown ? 16 : 6,
                                opacity: i === shown ? 1 : 0.55,
                            }}
                        />
                    ))}
                </span>
            )}
        </motion.div>
    );
};

const PreviousYearsSection = () => {
    const reduced = useReducedMotion();
    const gridRef = useRef(null);
    const gridVisible = useInView(gridRef, { amount: 0.2 });
    const cycling = gridVisible && !reduced;

    return (
        <section id="previous-years" className="relative w-full select-none">
            <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8 md:px-10 md:py-24 xl:px-16 xl:py-28">
                <h2
                    className="product_sans text-center text-[28px] sm:text-[34px] md:text-[42px] lg:text-[52px] xl:text-[56px]"
                    style={{
                        fontWeight: 700,
                        lineHeight: 1.05,
                        letterSpacing: "-0.01em",
                        color: "#000000",
                    }}
                >
                    Previous <span style={{ color: "#4285F4" }}>Years</span>
                </h2>

                <p
                    className="product_sans mx-auto mt-4 max-w-[680px] text-center text-[15px] md:mt-6 md:text-[17px] xl:text-[18px]"
                    style={{
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: "#5f6368",
                    }}
                >
                    A look back at the energy of earlier DevFest Kolkata
                    editions — the talks, the crowd and the community.
                </p>

                {/* Bento: on large screens the video takes the big tile with
                    two wide tiles under it and two tall tiles beside it; below
                    that everything stacks into the video plus a 2×2 grid. */}
                <div
                    ref={gridRef}
                    className="mt-12 grid gap-3 sm:gap-4 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.36fr)] lg:gap-5"
                >
                    <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
                        <VideoTile reduced={reduced} />
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                            {[2, 3].map((i) => (
                                <PhotoTile
                                    key={TILES[i].title}
                                    tile={TILES[i]}
                                    index={i}
                                    cycling={cycling}
                                    reduced={reduced}
                                    className="aspect-[4/3] lg:aspect-[12/5]"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1 lg:grid-rows-2 lg:gap-5">
                        {[0, 1].map((i) => (
                            <PhotoTile
                                key={TILES[i].title}
                                tile={TILES[i]}
                                index={i}
                                cycling={cycling}
                                reduced={reduced}
                                className="aspect-[4/3] lg:aspect-auto"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PreviousYearsSection;
