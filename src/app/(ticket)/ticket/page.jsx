"use client";

import React, { useEffect, useState, useCallback } from "react";
import TicketComponent from "@/components/common/TicketComponent";
import TicketSummary from "@/components/common/TicketSummary";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ticketsData from "@/tickets.json";

export default function TicketPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isFetchingUserData, setIsFetchingUserData] = useState(false);
    const tickets = ticketsData.tickets;
    const ticket = tickets[0];

    const fetchUserData = useCallback(async () => {
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
    }, [user]);

    useEffect(() => {
        if (!loading && user) {
            fetchUserData();
        }
    }, [loading, user, fetchUserData]);

    return (
        <div className="bg-dark">
            {!loading && !isFetchingUserData && (
                <div className="flex flex-col lg:flex-row items-center justify-around gap-8 py-12 px-4 md:px-8 lg:px-20 min-h-full">
                    <TicketComponent
                        title={ticket.title}
                        description={ticket.description}
                        features={ticket.features}
                        price={ticket.price}
                        color={ticket.color}
                    />
                    <TicketSummary ticketPrice={ticket.price} />
                </div>
            )}
        </div>
    );
}
