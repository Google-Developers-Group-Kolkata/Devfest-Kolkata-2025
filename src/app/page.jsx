import TramHero from "@/components/Home/TramHero";

const DevFest2025 = () => {
    return (
        // No overflow-x here: <html> already clips horizontally, and an overflow
        // ancestor would become the scrollport for every `position: sticky`
        // descendant (the pinned hero and the shared doodle backdrop).
        <div className="min-h-screen bg-white">
            <main>
                <TramHero />
            </main>
        </div>
    );
};

export default DevFest2025;