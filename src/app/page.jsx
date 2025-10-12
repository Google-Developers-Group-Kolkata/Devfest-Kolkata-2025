"use client";

import React, { useRef } from "react";
import HeroBanner from "@/components/Home/HeroBanner";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import TicketCard from "../components/Home/Tickets";
import About from "@/components/Home/About";
import Venue from "@/components/Home/Venue";
import GooglePlay from "@/components/Home/GooglePlay";
import FAQ from "@/components/Home/FAQ";

const DevFest2025 = () => {
    const ticketSectionRef = useRef(null);

    const scrollToTickets = () => {
        if (ticketSectionRef.current) {
            ticketSectionRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#1e1e1e] overflow-x-hidden">
            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </header>

            {/* Main Content */}
            <main>
                {/* Hero Banner Section */}
                <section className="pb-8 md:pb-8">
                    <HeroBanner scrollToTickets={scrollToTickets} />
                </section>

                {/* Google Play Section */}
                <section className="pb-8 md:pb-8">
                    <GooglePlay />
                </section>

                {/* Ticket Section */}
                <section ref={ticketSectionRef} className="pb-8 md:pb-8">
                    <TicketCard />
                </section>

                {/* About Section */}
                <section className="py-16 px-8 open_sans">
                    <Venue />
                </section>

                <section className="py-16 px-4 open_sans">
                    <About />
                </section>

                <section className="py-16 px-4 open_sans">
                    <FAQ />
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default DevFest2025;