"use client";

import { motion } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/outline";

const PLACE_NAME = "Vedic Village";
const ADDRESS1 = "Shikharpur P.O, Bagu, Sikharpur,";
const ADDRESS2 = "Kolkata, West Bengal 700135";

export default function Venue() {
    const mapsHref = "https://maps.app.goo.gl/d51ukiyxkjJnYv5NA";

    const openMap = () => {
        window.open(mapsHref, "_blank");
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
                    className="flex flex-col justify-center items-center md:items-start gap-6 px-8 pb-4 pt-12 md:pb-12 lg:px-12 lg:py-16 col-span-1"
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
                        className="text-5xl md:text-6xl 2xl:text-8xl font-bold text-[#FFF3D2] mb-3 open_sans"
                        variants={itemVariants}
                    >
                        Venue
                    </motion.h2>
                    <motion.h1
                        className="text-[#FFF3D2] text-2xl 2xl:text-4xl font-semibold tracking-tight lg:text-3xl"
                        variants={itemVariants}
                    >
                        {PLACE_NAME}
                    </motion.h1>
                    <motion.div variants={itemVariants}>
                        {/* <motion.p
                            className="text-[#FFF3D2] text-center sm:text-left text-sm 2xl:text-lg" 
                        >
                            {ADDRESS1}
                        </motion.p> */}
                        <motion.p
                            className="text-[#FFF3D2] text-center sm:text-left text-sm 2xl:text-lg"
                        >
                            {ADDRESS2}
                        </motion.p>
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
                    <div className="p-10 max-h-[350px] md:max-h-[450px] lg:max-h-[500px] aspect-square">
                        <motion.img
                            src="/venue2.png"
                            alt="Entrance of Vedic Village with thatched roof gate surrounded by greenery"
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
