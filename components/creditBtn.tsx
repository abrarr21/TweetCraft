"use client";

import { useEffect, useState } from "react";
import { InfinityIcon } from "lucide-react"; // or use any infinity SVG
import axios from "axios";

export default function CreditButton() {
    const [credits, setCredits] = useState<number | "infinite" | null>(null);

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const res = await axios.get("/api/credits");
                setCredits(res.data.credits); // "infinite" or a number
            } catch (error) {
                console.log("Error fetching credits", error);
            }
        };

        fetchCredits();
    }, []);

    return (
        <button className="" disabled>
            Credits:
            {credits === "infinite" ? (
                <InfinityIcon className="h-4 w-4" />
            ) : credits !== null ? (
                <span> {credits}</span>
            ) : (
                <span className="animate-pulse"> 0</span>
            )}
        </button>
    );
}
