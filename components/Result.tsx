"use client";
import { ResultProps } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Result({ response, speed = 30 }: ResultProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < response.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + response[index]);
                setIndex((prev) => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [response, speed, index]);

    useEffect(() => {
        setDisplayedText("");
        setIndex(0);
    }, [response]);

    return (
        <>
            <div>
                <div className="m-2 p-2">{displayedText}</div>
            </div>
        </>
    );
}
