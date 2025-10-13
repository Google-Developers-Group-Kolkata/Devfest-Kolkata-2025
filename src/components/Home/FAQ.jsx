"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const faqData = [
    {
        id: 1,
        question: "What is GDG Kolkata 2025?",
        answer: "GDG Kolkata 2025 is the annual flagship event of Google Developer Groups Kolkata, bringing together developers, designers, and tech enthusiasts for a day full of learning, networking, and innovation powered by Google technologies.",
    },
    {
        id: 2,
        question: "Who can attend the event?",
        answer: "Anyone interested in technology can join! Whether you're a student, developer, designer, or tech professional — GDG Kolkata 2025 is open to all skill levels. No prior experience is required.",
    },
    {
        id: 3,
        question: "What activities can I expect?",
        answer: "The event features keynote sessions by Google Developer Experts, hands-on workshops on AI, Flutter, Cloud, and Web, networking opportunities, fun challenges, and exclusive Google swag for participants.",
    },
    {
        id: 4,
        question: "Will there be any workshops or hands-on sessions?",
        answer: "Yes! GDG Kolkata 2025 will include hands-on workshops led by Google Developer Experts and community mentors. These sessions will cover cutting-edge topics like Cloud, AI/ML, Flutter, and Web development, offering real-world project experience.",
    },
    {
        id: 5,
        question: "How can I stay updated?",
        answer: `Follow GDG Kolkata on social media and join our community to get the latest updates and announcements. Visit "gdg.community.dev/gdg-kolkata" or follow us on Twitter @gdgkolkata and Instagram @gdg.kolkata for event details.`,
    },
];

export default function FAQ() {
    const [openItems, setOpenItems] = useState(1); // First item open by default

    const toggleItem = (id) => {
        setOpenItems(openItems === id ? null : id);
    };

    return (
        <section className="py-16 px-4 bg-[#1E1E1E] relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute bottom-0 right-0 w-[290px] h-[290px] bg-radial-red-dark rounded-full rotate-[-45deg]"></div>
            <div className="absolute left-[-40px] md:left-[50px] lg:left-[210px] top-[80px] md:top-[-40px] w-[380px] h-[380px] md:w-[537px] md:h-[521px] rounded-full bg-radial-blue-dark"></div>
            <div className="absolute top-1 left-0 w-[167px] h-[162px] bg-radial-green-dark rounded-full rotate-[-165deg]"></div>

            <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row md:space-x-12">
                <div className="mb-12">
                    <h2 className="text-5xl md:text-6xl font-bold text-[#FFF3D2] mb-6">
                        FAQs
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                        Have questions about our digital conference? Our FAQs
                        have got you covered. Discover important details on
                        registration, session logistics, and more.
                    </p>
                </div>

                <div className="space-y-4 min-w-3/5 w-full md:max-w-3/5">
                    {faqData.map((item) => (
                        <motion.div
                            key={item.id}
                            className="overflow-hidden flex flex-col items-center relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: item.id * 0.1 }}
                        >
                            <div className="absolute left-0 top-[10%] w-[1px] h-[80%] bg-[#FFF3D2]"></div>
                            <button
                                onClick={() => toggleItem(item.id)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between transition-colors duration-200 cursor-pointer"
                            >
                                <span className="text-[#FFF3D2] text-xl font-medium pr-4">
                                    {item.question}
                                </span>
                                <motion.div
                                    animate={{
                                        rotate: openItems === item.id
                                            ? 180
                                            : 0,
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-shrink-0"
                                >
                                    <ChevronDownIcon className="w-6 h-6 text-gray-400" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openItems === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeInOut",
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-4 pt-2">
                                            <p className="text-[#FFF3D2] leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="w-[90%] border-t border-[#FFF3D2]"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
