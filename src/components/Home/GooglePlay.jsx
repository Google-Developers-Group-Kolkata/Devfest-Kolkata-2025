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
                Get our app
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
                className="flex rounded-full gap-2 md:gap-6 p-1 justify-center items-center"
            >
                <Link
                    href="https://play.google.com/store/apps/details?id=com.dartcube.gdgkolkata"
                    target="_blank"
                    className="bg-[#1E1E1E] text-[#FFF3D2] py-2 rounded-full flex items-center justify-center"
                >
                    <motion.img
                        src="/google_play.png"
                        alt="Get it on Google Play"
                        className="h-12 w-40 object-contain"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                </Link>
                <Link
                    href="https://apps.apple.com/in/app/devfest-kolkata/id6753889196"
                    target="_blank"
                    className="bg-[#1E1E1E] text-[#FFF3D2] py-2 rounded-full flex items-center justify-center"
                >
                    <motion.img
                        src="/app_store.png"
                        alt="Get it on App Store"
                        className="h-12 w-40 object-contain"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                </Link>
            </motion.div>
        </motion.div>
    );
}
