"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function CreditButton() {
    const { data, error, isLoading } = useQuery({
        queryKey: ["credits"],
        queryFn: async () => {
            const res = await axios.get("/api/credits");
            return res.data;
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    useEffect(() => {
        if (error) {
            toast.error("Failed to fetch credits. Please try again.");
        }
    }, [error]);

    let creditDisplay;
    if (error) {
        creditDisplay = <span className="text-red-500"> Error</span>;
    } else if (isLoading) {
        creditDisplay = <span className="animate-pulse"> Loading...</span>;
    } else {
        creditDisplay = <span> {data?.credits}</span>;
    }

    return <button disabled>Credits: {creditDisplay}</button>;
}
