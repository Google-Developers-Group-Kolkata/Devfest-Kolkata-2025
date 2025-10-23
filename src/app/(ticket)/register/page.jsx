"use client"

import React, { useEffect, useState } from "react";
import RegistrationForm from "@/components/common/RegistrationForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterUser() {
    const { user, loading } = useAuth();
    const [isFetchingUserData, setIsFetchingUserData] = useState(false);
    const router = useRouter();

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

            if (response.status === 200) {
                router.push("/ticket");
            } 
        } catch (error) {
            console.log("Error fetching user data:", error);
        } finally {
            setIsFetchingUserData(false);
        }
    }

    useEffect(() => {
        if (!loading && user) {
            fetchUserData();
        }
    }, [loading, user])

    return (
        <div className="bg-dark">
            {!loading && !isFetchingUserData && <RegistrationForm user={user} />}
        </div>
    );
}
