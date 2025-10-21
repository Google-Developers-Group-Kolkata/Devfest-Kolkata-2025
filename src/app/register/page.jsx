"use client"

import React, { useEffect } from "react";
import RegistrationForm from "@/components/common/RegistrationForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function page() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    return (
        <div className="bg-dark">
            <h1 className="foreground-dark">Registration</h1>
            {!loading && <RegistrationForm user={user} />}
        </div>
    );
}
