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
  const [tickets, setTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Default colors to use when not specified
  const defaultColors = ["blue", "green", "red", "yellow"];

  // Get a random or default color
  const getDefaultColor = (index) => {
    return defaultColors[index % defaultColors.length];
  };

  // Fetch tickets from backend and merge with local data
  const fetchTickets = useCallback(async () => {
    try {
      setIsLoadingTickets(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tickets/view`
      );

      // Normalize backend tickets
      const backendTickets = response.data.tickets.map((t) => ({
        id: t.id,
        name: t.name,
        priceInPaise: t.priceInPaise,
        description: t.description || null,
        available: t.available,
        slug: t.slug,
      }));

      // Merge with local frontend data
      const mergedTickets = backendTickets.map((backendTicket, index) => {
        // Find matching ticket in local data by slug
        const localTicket = ticketsData.tickets.find(
          (lt) => lt.slug === backendTicket.slug
        );

        // If match found, merge; otherwise use defaults
        return {
          ...backendTicket,
          title: localTicket?.title || backendTicket.name,
          features: localTicket?.features || [
            "Entry to DevFest",
            "Full-access to conference",
            "Breakfast & Lunch",
            "Hi-Tea",
            "Keynotes, Panels",
          ],
          price: backendTicket.priceInPaise / 100, // Convert paise to rupees
          color: localTicket?.color || getDefaultColor(index),
          description:
            backendTicket.description ||
            localTicket?.description ||
            "Join us for an amazing DevFest experience!",
        };
      });

      setTickets(mergedTickets);

      // Auto-select first available ticket
      const firstAvailable =
        mergedTickets.find((t) => t.available) || mergedTickets[0];
      setSelectedTicket(firstAvailable);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load tickets. Using local data.");

      // Fallback to local tickets data
      const localTickets = ticketsData.tickets.map((t) => ({
        id: t.id,
        name: t.name,
        priceInPaise: t.priceInPaise,
        description: t.description || null,
        available: t.available,
        slug: t.slug,
        title: t.title,
        features: t.features,
        price: t.price,
        color: t.color,
      }));

      setTickets(localTickets);
      setSelectedTicket(
        localTickets.find((t) => t.available) || localTickets[0]
      );
    } finally {
      setIsLoadingTickets(false);
    }
  }, []);

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
    // Fetch tickets on component mount
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (!loading && user) {
      fetchUserData();
    }
  }, [loading, user, fetchUserData]);

  const handleTicketSelect = (ticket) => {
    if (ticket.available) {
      setSelectedTicket(ticket);
    }
  };

  return (
    <div className="bg-dark">
      {!loading &&
        !isFetchingUserData &&
        !isLoadingTickets &&
        tickets.length > 0 &&
        selectedTicket && (
          <div className="py-12 px-4 md:px-8 lg:px-20 min-h-screen">

            {/* Main Layout: Tickets Left, Summary Right */}
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              {/* Left Side - Tickets Column */}
              <div className="flex-1 space-y-6 lg:max-w-2xl">
                {tickets.map((ticket) => (
                  <TicketComponent
                    key={ticket.id}
                    title={ticket.title}
                    description={ticket.description}
                    features={ticket.features}
                    price={ticket.price}
                    color={ticket.color}
                    isSelected={selectedTicket?.id === ticket.id}
                    onSelect={() => handleTicketSelect(ticket)}
                  />
                ))}
              </div>

              {/* Right Side - Payment Summary (Sticky) */}
              <div className="lg:w-96 lg:sticky lg:top-8 lg:self-start">
                <TicketSummary
                  ticketPrice={selectedTicket.price}
                  ticketSlug={selectedTicket.slug}
                />
              </div>
            </div>
          </div>
        )}

      {/* Loading State */}
      {(loading || isFetchingUserData || isLoadingTickets) && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading tickets...</p>
          </div>
        </div>
      )}

      {/* No Tickets Available */}
      {!loading &&
        !isFetchingUserData &&
        !isLoadingTickets &&
        tickets.length === 0 && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-white text-xl">
                No tickets available at the moment.
              </p>
              <p className="text-gray-400 mt-2">Please check back later.</p>
            </div>
          </div>
        )}
    </div>
  );
}
