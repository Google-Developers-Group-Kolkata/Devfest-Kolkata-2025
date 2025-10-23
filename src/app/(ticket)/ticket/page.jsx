"use client";

import React, { useEffect, useState } from "react";
import TicketComponent from "@/components/common/TicketComponent";
import TicketSummary from "@/components/common/TicketSummary";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TicketPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isFetchingUserData, setIsFetchingUserData] = useState(false);

    const fetchUserData = async () => {
        try {
            setIsFetchingUserData(true);

            const token = await user.getIdToken();
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 404) {
                router.push("/register");
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
            toast("Please register to Purchase Ticket", { icon: "⚠️" });
            router.push("/register");
        } finally {
            setIsFetchingUserData(false);
        }
    };

    useEffect(() => {
        if (!loading && user) {
            fetchUserData();
        }
    }, [loading, user]);

    return (
        <div className="bg-dark">
            {!loading && !isFetchingUserData && (
                <div className="flex flex-col lg:flex-row items-center justify-around gap-8 py-12 px-4 md:px-8 lg:px-20">
                    <TicketComponent
                        title="Early Bird Ticket"
                        description="I know you missed community Faris ticket. This ticket for all our valuable early people who constantly support us and create a vibrant community."
                        features={[
                            "Entry to DevFest",
                            "Full-access to conference",
                            "Breakfast & Lunch",
                            "Hi-Tea",
                            "Keynotes, Panels",
                            "Exclusive Discussion Session",
                        ]}
                        price="₹ 799"
                        color="blue"
                    />
                    <TicketSummary />
                </div>
            )}
        </div>
    );
}
