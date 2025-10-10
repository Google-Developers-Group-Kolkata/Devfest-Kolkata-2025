"use client";

import { motion } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/outline";

const PLACE_NAME = "Vedic Village";
const ADDRESS = "Shikharpur P.O, Bagu, Sikharpur, Kolkata, West Bengal 700135";

export default function Venue() {
    const mapsHref = "https://maps.app.goo.gl/d51ukiyxkjJnYv5NA"

    const openMap = () => {
        window.open(mapsHref, "_blank");
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
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
                delay: 0.3
            }
        }
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
                delay: 0.5
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <motion.div className="text-center mb-14" variants={itemVariants}>
                <motion.h2 
                    className="text-5xl md:text-6xl font-bold text-[#FFF3D2] mb-3"
                    variants={itemVariants}
                >
                    Venue
                </motion.h2>
                <motion.p 
                    className="text-[#888] text-lg"
                    variants={itemVariants}
                >
                    Your spot for the ultimate tech vibe.
                </motion.p>
            </motion.div>
            
            <motion.div
                className="rounded-3xl bg-[#353535] text-card-foreground shadow-xl ring-1 ring-border md:grid md:grid-cols-2 md:w-[80%] w-full md:mx-auto mb-20"
                style={{
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.06), 0 40px 60px rgba(0,0,0,0.05)",
                }}
                variants={cardVariants}
                whileHover={{ 
                    scale: 1.02, 
                    transition: { duration: 0.3, ease: "easeOut" } 
                }}
            >
                {/* Left: Copy */}
                <motion.div 
                    className="flex flex-col justify-center items-center md:items-start gap-6 px-8 py-12 lg:px-12 lg:py-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.2,
                                delay: 0.6
                            }
                        }
                    }}
                >
                    <motion.h1 
                        className="text-[#FFF3D2] text-4xl font-semibold tracking-tight lg:text-6xl"
                        variants={itemVariants}
                    >
                        {PLACE_NAME}
                    </motion.h1>
                    <motion.p 
                        className="text-[#FFF3D2] text-center sm:text-left"
                        variants={itemVariants}
                    >
                        {ADDRESS}
                    </motion.p>

                    <motion.div variants={itemVariants}>
                        <motion.button 
                            onClick={openMap} 
                            className="rounded-full py-2 px-8 bg-[#1E1E1E] google-gradient-border cursor-pointer"
                            whileHover={{ 
                                scale: 1.05,
                                transition: { duration: 0.2, ease: "easeOut" }
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="flex items-center gap-2 text-[#FFF3D2]">
                                <motion.div
                                    whileHover={{ rotate: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <MapPinIcon className="h-5 w-5" />
                                </motion.div>
                                <span className="w-full">Get Directions</span>
                            </span>
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Right: Image with angled edges */}
                <motion.div 
                    className="relative flex justify-center items-center"
                    variants={imageVariants}
                >
                    <div className="p-10">
                        <motion.img
                            src="/venue_img.png"
                            alt="Entrance of Vedic Village with thatched roof gate surrounded by greenery"
                            className="rounded-[2.3rem]"
                            style={{
                                clipPath:
                                    "polygon(0 10%, 100% 0, 100% 90%, 0 100%)",
                            }}
                            whileHover={{ 
                                scale: 1.05,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}