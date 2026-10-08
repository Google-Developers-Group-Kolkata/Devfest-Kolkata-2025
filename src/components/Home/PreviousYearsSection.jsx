"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaPlay, FaYoutube } from "react-icons/fa6";

const PHOTOS = [
    { src: "/Rectangle%2021210.png", alt: "Speaker on stage at DevFest Kolkata" },
    { src: "/Rectangle%2021209.png", alt: "Attendees gathering at the DevFest registration desk" },
    { src: "/Rectangle%2021206.png", alt: "Full auditorium during a DevFest keynote" },
    { src: "/Rectangle%2021212.png", alt: "Attendees with laptops in the audience" },
    { src: "/Rectangle%2021207.png", alt: "Volunteers handing out saplings at the venue" },
];

const VIDEOS = [
    {
        id: "BsEhnyiihK0",
        title: "Devfest Kolkata 2025 #GDGKolkata #devfest",
        channel: "GDG Kolkata",
        thumbnail: "https://i.ytimg.com/vi/BsEhnyiihK0/hqdefault.jpg",
    },
];

const EASE = [0.33, 0, 0.2, 1];

const VideoCard = ({ video }) => {
    const [playing, setPlaying] = useState(false);

    return (
        <div
            className="google-gradient-border overflow-hidden rounded-[26px] bg-white"
            style={{
                "--gb-width": "3px",
                padding: "3px",
                boxShadow: "0 12px 34px rgba(0,0,0,0.08)",
            }}
        >
            <div className="overflow-hidden rounded-[23px] bg-white">
                <div className="relative aspect-video w-full bg-black">
                    {playing ? (
                        <iframe
                            className="absolute inset-0 h-full w-full border-0"
                            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setPlaying(true)}
                            aria-label={`Play: ${video.title}`}
                            className="group absolute inset-0 h-full w-full cursor-pointer"
                        >
                            <img
                                src={video.thumbnail}
                                alt=""
                                draggable={false}
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                            <span className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/45" />
                            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#EA4335] shadow-lg transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16">
                                <FaPlay className="ml-0.5 size-5 text-white md:size-6" />
                            </span>
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 px-5 py-4 md:px-6 md:py-5">
                    <FaYoutube className="size-7 shrink-0 text-[#EA4335]" />
                    <div className="min-w-0">
                        <h3
                            className="product_sans truncate text-[15px] md:text-[17px]"
                            style={{ fontWeight: 600, color: "#202124" }}
                        >
                            {video.title}
                        </h3>
                        <p className="product_sans text-[12px] text-[#5f6368] md:text-[13px]">
                            {video.channel}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PreviousYearsSection = () => {
    const reduced = useReducedMotion();

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

                <motion.div
                    className="mx-auto mt-12 max-w-[860px] md:mt-16"
                    initial={reduced ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: EASE }}
                >
                    {VIDEOS.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </motion.div>

                <div className="mt-8 grid grid-cols-2 gap-4 md:mt-10 md:grid-cols-3 md:gap-6">
                    {PHOTOS.map((photo, i) => (
                        <motion.div
                            key={photo.src}
                            className="group relative overflow-hidden rounded-2xl"
                            style={{ aspectRatio: "384 / 231" }}
                            initial={reduced ? false : { opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.45,
                                ease: EASE,
                                delay: (i % 3) * 0.08,
                            }}
                        >
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                draggable={false}
                                loading="lazy"
                                className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PreviousYearsSection;
