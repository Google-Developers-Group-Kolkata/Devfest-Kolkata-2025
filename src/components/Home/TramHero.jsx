"use client";

const TramHero = () => {
    return (
        <div
            className="relative h-screen w-full overflow-hidden select-none"
            style={{ backgroundColor: "#ffffff" }}
        >
            <div
                className="tram-slide absolute left-0 will-change-transform pointer-events-none"
                style={{ width: "50vw", bottom: "-0.85vw" }}
            >
                <img
                    src="/hero-tram/tram.png"
                    alt=""
                    draggable={false}
                    className="block w-full h-auto"
                />
            </div>
        </div>
    );
};

export default TramHero;