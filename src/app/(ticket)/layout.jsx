"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Layout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleBackClick = () => {
        router.push("/");
    }

    if ( loading || !user ) {
        return (
            <div className="bg-dark min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if ( !loading && !user ) return null;

    return (
        <div className="bg-dark min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 md:mb-0 px-2">
                <div className="flex items-center ml-2 md:ml-10 gap-3 bg-dark">
                    <div 
                        className="p-2 rounded-full hover:bg-gray-700 bg-gray-700 md:bg-transparent"
                        onClick={handleBackClick}
                    >
                        <ArrowLeft className="foreground-dark cursor-pointer w-[30px] h-[30px] md:w-[40px] md:h-[40px]"/>
                    </div>
                    <Image
                        src="/favicon.svg"
                        alt="DevFest Kolkata '25"
                        width={50}
                        height={50}
                        className="w-13 h-13 md:w-18 md:h-18 lg:w-22 lg:h-22 cursor-pointer"
                    />
                    <h1 className="text-2xl md:text-4xl font-bold text-white albert_sans">DevFest Kolkata {"'"}25</h1>
                </div>
            </nav>
            <div className="w-full bg-dark rounded-lg p-3 md:p-5 lg:p-8">
                {children}
                <Toaster position="top-center"/>
            </div>
        </div>
    );
}
