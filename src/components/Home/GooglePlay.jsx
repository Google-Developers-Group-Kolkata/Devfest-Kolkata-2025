import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GooglePlay() {
    return (
        <motion.div
            className="flex flex-col items-center mt-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
                duration: 0.8,
                ease: "easeOut",
            }}
        >
            <motion.h2
                className="text-3xl font-bold text-[#FFF3D2] mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: 0.2,
                }}
            >
                Get our app on Google Play
            </motion.h2>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: 0.4,
                }}
                whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.95 }}
            >
                <Link
                    href="https://play.google.com/store/apps/details?id=com.dartcube.gdgkolkata"
                    className="bg-[#1E1E1E] text-[#FFF3D2] py-2 px-4 rounded-full inline-block"
                >
                    <motion.img
                        src="/google_play.png"
                        alt="Get it on Google Play"
                        className="h-12"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                </Link>
            </motion.div>
        </motion.div>
    );
}
