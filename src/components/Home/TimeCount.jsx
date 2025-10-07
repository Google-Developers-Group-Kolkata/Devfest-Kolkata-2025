"use client";

import React, { useState, useEffect, useMemo } from "react";

export default function TimeCount({ target = "2025-12-21T03:30:00Z" }) {
    const targetTime = useMemo(
        () =>
            typeof target === "string"
                ? new Date(target).getTime()
                : target.getTime(),
        [target]
    );

    const diffToTimeLeft = (ms) => {
        const totalMinutes = Math.max(0, Math.floor(ms / (1000 * 60)));
        const days = Math.floor(totalMinutes / (60 * 24));
        const hrs = Math.floor((totalMinutes % (60 * 24)) / 60);
        const mins = totalMinutes % 60;
        return { days, hrs, mins };
    };

    const [timeLeft, setTimeLeft] = useState(() =>
        diffToTimeLeft(targetTime - Date.now())
    );

    useEffect(() => {
        const id = setInterval(() => {
            setTimeLeft(diffToTimeLeft(targetTime - Date.now()));
        }, 1000 * 5);
        return () => clearInterval(id);
    }, [targetTime]);

    const formatTime = (value) => {
        return value < 10 ? `0${value}` : value;
    };

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) {
            return;
        }

        timerComponents.push({
            value: formatTime(timeLeft[interval]),
            label: interval,
        });
    });

    return (
        <>
            <div className="text-center">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#FFF3D2] mb-4 tracking-wider albert_sans">
                    Time Left :
                    <div className="w-24 h-1 bg-green-300 mx-auto mt-3 rounded-full animate-pulse"></div>
                </h2>
                <div className="flex justify-center items-center space-x-6 sm:space-x-14 lg:space-x-16 mt-16">
                    {timerComponents.length ? (
                        timerComponents.map((item, index) => (
                            <React.Fragment key={item.label}>
                                <div className="flex flex-col items-center">
                                    <div className="bg-[#8B8B8B33] backdrop-blur-sm rounded-xl p-4 md:p-6 min-w-[80px] sm:min-w-[120px] shadow-lg border border-gray-700">
                                        <span className="text-4xl sm:text-7xl font-bold text-[#FFF3D2] tabular-nums albert_sans">
                                            {item.value}
                                        </span>
                                    </div>
                                    <span className="text-sm md:text-2xl text-gray-400 mt-2 tracking-widest albert_sans">
                                        {item.label}
                                    </span>
                                </div>
                                {index < timerComponents.length - 1 && (
                                    <span className="text-4xl md:text-5xl text-green-300 font-light pb-8">
                                        :
                                    </span>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <span className="text-xl text-gray-400">
                            Time's up!
                        </span>
                    )}
                </div>
            </div>
        </>
    );
}
