"use client";

import { motion } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const VENUES = {
    day1: {
        name: "RCC Institute of Information Technology",
        date: "20th December, 2025",
        description: "Pre-DevFest Workshop",
        address: "Kolkata, West Bengal 700015",
        mapsHref: "https://maps.app.goo.gl/vCHnLizMKSYStK9A8",
        image: "/rcc.png",
    },
    day2: {
        name: "Vedic Village",
        date: "21st December, 2025",
        description: "DevFest Kolkata 2025",
        address: "Kolkata, West Bengal 700135",
        mapsHref: "https://maps.app.goo.gl/d51ukiyxkjJnYv5NA",
        image: "/venue2.png",
    },
};

export default function Venue() {
    const [selectedDay, setSelectedDay] = useState("day2");

    const openMap = () => {
        window.open(VENUES[selectedDay].mapsHref, "_blank");
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.3,
            },
        },
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.5,
            },
        },
    };

    const currentVenue = VENUES[selectedDay];

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <motion.div
                className="rounded-3xl bg-[#1E1E1E] md:grid md:grid-cols-3 md:w-[80%] 2xl:w-[65%] w-full md:mx-auto mb-20"
                variants={cardVariants}
                whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" },
                }}
            >
                {/* Left: Copy */}
                <motion.div
                    className="flex flex-col justify-center items-center md:items-start gap-4 md:gap-6 px-6 sm:px-8 pb-4 pt-12 md:pb-12 lg:px-12 lg:py-16 col-span-1 w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.2,
                                delay: 0.6,
                            },
                        },
                    }}
                >
                    <motion.h2
                        className="text-4xl sm:text-5xl md:text-6xl 2xl:text-8xl font-bold text-[#FFF3D2] mb-2 md:mb-3 open_sans"
                        variants={itemVariants}
                    >
                        Venue
                    </motion.h2>
                    <motion.div
                        className="flex w-full max-w-[280px] sm:max-w-full items-center gap-2 sm:gap-4 my-1 relative bg-[#2A2A2A] rounded-full p-1"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="absolute bg-[#FFF3D2] rounded-full h-[calc(100%-8px)] top-1"
                            layoutId="activeIndicator"
                            initial={false}
                            animate={{
                                left: selectedDay === "day1" ? "4px" : "50%",
                                width: "calc(50% - 8px)",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                        <motion.button
                            onClick={() => setSelectedDay("day1")}
                            className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 relative z-10 flex-1 cursor-pointer ${
                                selectedDay === "day1"
                                    ? "text-[#1E1E1E]"
                                    : "text-[#FFF3D2]"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Day 1
                        </motion.button>
                        <motion.button
                            onClick={() => setSelectedDay("day2")}
                            className={`px-3 sm:px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-colors duration-200 relative z-10 flex-1 cursor-pointer ${
                                selectedDay === "day2"
                                    ? "text-[#1E1E1E]"
                                    : "text-[#FFF3D2]"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Day 2
                        </motion.button>
                    </motion.div>
                    <motion.h1
                        key={selectedDay + "-name"}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-[#FFF3D2] text-xl sm:text-2xl md:text-2xl lg:text-3xl 2xl:text-4xl font-semibold tracking-tight text-center md:text-left"
                    >
                        {currentVenue.name}
                    </motion.h1>

                    <motion.div className="flex flex-col gap-2">
                        <motion.p
                            key={selectedDay + "-date"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="text-[#FFF3D2] text-center sm:text-left text-base sm:text-lg 2xl:text-xl font-medium"
                        >
                            {currentVenue.date}
                        </motion.p>
                        <motion.p
                            key={selectedDay + "-description"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                            className="text-[#FFF3D2] text-center sm:text-left text-sm sm:text-base 2xl:text-lg font-normal"
                        >
                            {currentVenue.description}
                        </motion.p>
                        <motion.div
                            key={selectedDay + "-address"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <motion.p className="text-[#FFF3D2] text-center sm:text-left text-xs sm:text-sm 2xl:text-lg">
                                {currentVenue.address}
                            </motion.p>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <motion.button
                            onClick={openMap}
                            className="rounded-full py-2 px-6 bg-[#FFF3D2] cursor-pointer"
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.2, ease: "easeOut" },
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="flex items-center gap-2 text-[#1E1E1E] font-semibold">
                                <motion.div
                                    whileHover={{ rotate: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <MapPinIcon className="h-4 w-4" />
                                </motion.div>
                                <span className="w-full text-sm">
                                    Get Directions
                                </span>
                            </span>
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Right: Image with angled edges */}
                <motion.div
                    className="relative flex justify-center items-center col-span-2 cursor-pointer"
                    variants={imageVariants}
                >
                    <div className="p-6 sm:p-10 max-h-[300px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[500px] aspect-square">
                        <motion.img
                            key={selectedDay + "-image"}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            src={currentVenue.image}
                            alt={`Entrance of ${currentVenue.name}`}
                            className="object-fit w-full h-full"
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.3, ease: "easeOut" },
                            }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
