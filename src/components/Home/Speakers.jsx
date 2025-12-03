"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    useCarousel,
} from "@/components/ui/carousel";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Autoplay from "embla-carousel-autoplay";

// Use one of these four colors randomly per card (stable for the card's lifetime)
const CARD_COLORS = [
    "var(--google-yellow)",
    "var(--google-red)",
    "var(--google-blue)",
    "var(--google-green)",
];

// Stable hash -> index
function getDeterministicColor(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0; // keep 32-bit
    }
    const idx = Math.abs(hash) % CARD_COLORS.length;
    return CARD_COLORS[idx];
}

const SpeakerCard = ({ name, role, image, socialLinks, isComingSoon }) => {
    const imgSrc = image || "https://placehold.co/400x600/png?text=Speaker";
    const randomBg = useMemo(
        () => getDeterministicColor(name + role),
        [name, role]
    );
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div className="flex flex-col items-center group w-full max-w-[300px] md:max-w-[350px] h-full">
            {/* Card Container */}
            {!isComingSoon && (
                <div className="relative w-full pb-32 overflow-hidden">
                    {/* Consistent aspect ratio wrapper */}
                    <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden">
                        {!imgLoaded && (
                            <div className="absolute inset-0">
                                <div className="h-full w-full animate-pulse bg-zinc-800/70" />
                            </div>
                        )}
                        <img
                            src={imgSrc}
                            alt={name}
                            loading="lazy"
                            onLoad={() => setImgLoaded(true)}
                            onError={() => setImgLoaded(true)}
                            className={`absolute inset-0 w-full h-full object-contain object-top transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"} hover:scale-[1.10] transition-transform duration-300 overflow-hidden rounded-3xl`}
                        />
                    </div>
                    {/* Info Card Overlay */}
                    <div
                        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full px-6 py-8 rounded-3xl shadow-lg product_sans h-[45%] flex flex-col justify-between"
                        style={{ backgroundColor: randomBg }}
                    >
                        <h3 className="text-black text-xl sm:text-2xl font-bold mb-2 text-center">
                            {name}
                        </h3>
                        <p className="text-black text-sm sm:text-base mb-6 text-center opacity-80">
                            {role}
                        </p>
                        <div className="flex gap-3 justify-center">
                            {socialLinks.instagram && (
                                <a
                                    href={socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded flex items-center justify-center transition-colors"
                                >
                                    <img
                                        src="/icons/insta.svg"
                                        alt="instagram-icon"
                                        className="h-10 w-10"
                                    />
                                </a>
                            )}
                            {socialLinks.linkedin && (
                                <a
                                    href={socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded flex items-center justify-center transition-colors"
                                >
                                    <img
                                        src="/icons/linkedin.svg"
                                        alt="linkedin-icon"
                                        className="h-10 w-10"
                                    />
                                </a>
                            )}
                            {socialLinks.twitter && (
                                <a
                                    href={socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded flex items-center justify-center transition-colors"
                                >
                                    <img
                                        src="/icons/x.svg"
                                        alt="x-icon"
                                        className="h-9 w-9"
                                    />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {isComingSoon && (
                <div className="relative w-full pb-32">
                    <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden">
                        <img
                            src="https://placehold.co/400x600/png?text=More+Speakers+will+release+soon!"
                            alt="Upcoming Speaker"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    {/* Info Card Overlay */}
                    <div
                        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full px-6 py-8 rounded-3xl shadow-lg product_sans h-[45%] flex flex-col justify-between"
                        style={{ backgroundColor: "var(--google-yellow)" }}
                    >
                        <h3 className="text-black text-xl sm:text-2xl font-bold mb-2 text-center">
                            Upcoming Speaker
                        </h3>
                        <p className="text-black text-sm sm:text-base mb-6 text-center opacity-80">
                            Stay Tuned!
                        </p>
                        <div className="flex gap-3 justify-center">
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded flex items-center justify-center transition-colors"
                            >
                                <img
                                    src="/icons/linkedin.svg"
                                    alt="linkedin-icon"
                                    className="h-10 w-10"
                                />
                            </a>
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded flex items-center justify-center transition-colors"
                            >
                                <img
                                    src="/icons/x.svg"
                                    alt="x-icon"
                                    className="h-9 w-9"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// CarouselDots with a combined control bar
function CarouselControls() {
    const { api } = useCarousel();
    const [count, setCount] = useState(0);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;
        const onSelect = () => setCurrent(api.selectedScrollSnap());
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        return () => api.off("select", onSelect);
    }, [api]);

    if (!count) return null;

    return (
        <div className="mt-6 flex items-center justify-center gap-8 md:gap-10">
            <button
                type="button"
                aria-label="Previous slide"
                onClick={() => api?.scrollPrev()}
                className="size-10 md:size-14 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer"
            >
                <Image
                    src="/left-arrow.svg"
                    alt="Previous"
                    width={20}
                    height={20}
                    className="md:w-8 md:h-8"
                />
            </button>

            <div className="flex items-center justify-center gap-2">
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => api?.scrollTo(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            current === i
                                ? "w-5 bg-[#F5E6D3]"
                                : "w-2 bg-zinc-500/70"
                        }`}
                    />
                ))}
            </div>

            <button
                type="button"
                aria-label="Next slide"
                onClick={() => api?.scrollNext()}
                className="size-10 md:size-14 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer"
            >
                <Image
                    src="/right-arrow.svg"
                    alt="Next"
                    width={20}
                    height={20}
                    className="md:w-8 md:h-8"
                />
            </button>
        </div>
    );
}

export default function Speakers() {
    const [speakerData, setSpeakerData] = useState([]);

    const fetchSpeakers = async () => {
        try {
            const speakerCollection = collection(db, "released-speakers");
            const speakerSnapshot = await getDocs(speakerCollection);
            const speakerList = speakerSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSpeakerData(speakerList);
        } catch (error) {
            console.error("Error fetching speakers:", error);
        }
    };

    useEffect(() => {
        fetchSpeakers();
    }, []);

    // Map firestore data -> UI format
    const SHAPES = ["circle", "triangle", "rounded-rect"];
    const formattedSpeakers = speakerData.map((s, idx) => {
        const name = s.Owner || s.FirstName || `Speaker ${idx + 1}`;
        return {
            id: s.id || idx + 1,
            name,
            role: s["TagLine"] || "Speaker",
            image: s["Profile Picture"] || "",
            bgShape: SHAPES[idx % SHAPES.length],
            socialLinks: {
                twitter: s["X (Twitter)"] || "",
                linkedin: s["LinkedIn"] || "",
                instagram: s["Instagram"] || "",
            },
            isComingSoon: s["isComingSoon"] || false,
        };
    });

    // Use formattedSpeakers if available else fallback static list
    const displaySpeakers = formattedSpeakers.length ? formattedSpeakers : [];

    const centerTwo = displaySpeakers.length < 3;

    return (
        <div className="bg-[#1E1E1E] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 tracking-wider albert_sans font-bold">
                        The SPEAKERS
                    </h2>
                    <p className="text-gray-400 text-lg sm:text-xl tracking-wide albert_sans">
                        Expert Voices in Technology
                    </p>
                </div>

                <Carousel
                    opts={{ align: "center", containScroll: "trimSnaps" }}
                    className="w-full"
                    plugins={[
                        Autoplay({
                            delay: 3000,
                        })
                    ]}
                >
                    <CarouselContent
                        className={`${
                            centerTwo ? "md:justify-center ml-0" : ""
                        }`}
                    >
                        {displaySpeakers.map((speaker) => (
                            <CarouselItem
                                key={speaker.id}
                                className="flex justify-center basis-[100%] md:basis-1/2 lg:basis-1/3"
                            >
                                <SpeakerCard {...speaker} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselControls />
                </Carousel>
            </div>
        </div>
    );
}
