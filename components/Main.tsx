"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { Forward } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import Result from "./Result";
import { toast } from "sonner";
import { TONES } from "@/constants/tones";
import { GenerateRequest, GenerateResponse } from "@/lib/types";

const DEFAULT_TONE = "Formal";

export default function MainPage() {
    const [content, setContent] = useState("");
    const [selectedTone, setSelectedTone] = useState<string>(DEFAULT_TONE);
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Track the last generated state to determine if regeneration is needed
    const [lastGenerated, setLastGenerated] = useState<{
        content: string;
        tone: string;
    } | null>(null);

    // Memoized check for button enabled state
    const isButtonEnabled = useMemo(() => {
        const hasContent = content.trim().length > 0;

        if (!hasContent) return false;

        // If no previous generation, enable button
        if (!lastGenerated) return true;

        // Enable if content or tone has changed since last generation
        return (
            lastGenerated.content !== content.trim() ||
            lastGenerated.tone !== selectedTone
        );
    }, [content, selectedTone, lastGenerated]);

    // Memoized textarea resize handler
    const handleInput = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const target = e.target;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
        },
        [],
    );

    // Memoized content change handler
    const handleContentChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setContent(e.target.value);
        },
        [],
    );

    // Memoized tone selection handler
    const handleToneSelect = useCallback((tone: string) => {
        setSelectedTone(tone);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!isButtonEnabled || isLoading) return;

        const trimmedContent = content.trim();

        try {
            setIsLoading(true);

            const requestData: GenerateRequest = {
                tweet: trimmedContent,
                tone: selectedTone,
            };

            const response = await axios.post<GenerateResponse>(
                "/api/generate",
                requestData,
            );

            if (response.data?.message) {
                setAiResponse(response.data.message);

                // Update last generated state
                setLastGenerated({
                    content: trimmedContent,
                    tone: selectedTone,
                });

                console.log("Generation successful:", response.data);
            } else {
                throw new Error("Invalid response format");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error generating content:", error);

            // Enhanced error handling
            if (
                error.response?.status === 403 &&
                error.response?.data?.requireauth
            ) {
                toast.error("Free limit exceeded. Please login to continue");
            } else if (error.response?.status >= 500) {
                toast.error("Server error. Please try again later");
            } else if (error.code === "NETWORK_ERROR") {
                toast.error("Network error. Please check your connection");
            } else {
                toast.error("Failed to refine the tweet. Try again later");
            }
        } finally {
            setIsLoading(false);
        }
    }, [content, selectedTone, isButtonEnabled, isLoading]);

    // Clear response when content changes significantly
    const handleClearResponse = useCallback(() => {
        if (aiResponse && (!content.trim() || !lastGenerated)) {
            setAiResponse(null);
            setLastGenerated(null);
        }
    }, [content, aiResponse, lastGenerated]);

    // Effect to clear response when appropriate
    useEffect(() => {
        handleClearResponse();
    }, [handleClearResponse]);

    return (
        <>
            <main className="min-h-10 w-11/12 rounded-md border-2 border-zinc-500 bg-gray-400/30 shadow-lg md:min-h-24 md:w-7/12">
                <textarea
                    placeholder="Drop your Tweet here..."
                    rows={2}
                    value={content}
                    onInput={handleInput}
                    onChange={handleContentChange}
                    disabled={isLoading}
                    className="placeholder:text-muted-foreground md:text-md mt-2 flex h-fit max-h-[250px] min-h-[30px] w-full resize-none overflow-y-auto rounded-md border-none bg-transparent p-2 text-base text-white shadow-none focus:border-none focus:outline-none focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 max-sm:text-xs"
                    aria-label="Tweet content input"
                />

                <div className="mt-2 mb-2 flex items-center justify-between px-2 md:px-6">
                    <div className="flex-shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="md:text-md cursor-pointer rounded-md border-zinc-600 bg-zinc-900/90 px-4 py-1 text-base text-white shadow-sm hover:bg-zinc-800 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 max-sm:text-xs md:px-8"
                                disabled={isLoading}
                                aria-label={`Selected tone: ${selectedTone}`}
                            >
                                {selectedTone}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-20 border-zinc-700 bg-zinc-900/90 text-white md:w-32">
                                {TONES.map((tone) => (
                                    <DropdownMenuItem
                                        key={tone}
                                        onClick={() => handleToneSelect(tone)}
                                        className={
                                            selectedTone === tone
                                                ? "bg-zinc-700"
                                                : ""
                                        }
                                    >
                                        {tone}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <button
                        disabled={!isButtonEnabled || isLoading}
                        onClick={handleSubmit}
                        className={`rounded-lg border-zinc-700 bg-zinc-900/90 p-1 text-white shadow-sm transition-all duration-200 ${
                            isButtonEnabled && !isLoading
                                ? "cursor-pointer hover:scale-105 hover:bg-zinc-800"
                                : "cursor-not-allowed opacity-50"
                        }`}
                        aria-label={
                            isLoading
                                ? "Generating..."
                                : isButtonEnabled
                                  ? "Generate refined tweet"
                                  : "Enter content and select tone to generate"
                        }
                        type="button"
                    >
                        <Forward className={isLoading ? "animate-pulse" : ""} />
                    </button>
                </div>
            </main>

            {aiResponse?.trim() && (
                <div
                    className={`${aiResponse.trim() === "" ? "hidden" : "block"} md:text-md mx-auto mt-7 flex min-h-8 w-11/12 items-center justify-center rounded-md border-2 border-zinc-500 bg-zinc-900/70 text-white shadow-lg max-sm:text-xs md:mx-auto md:mt-4 md:min-h-16 md:w-7/12`}
                    style={{
                        // height: "80px",
                        overflowY: "hidden",
                        overflowX: "hidden",
                    }}
                >
                    <div>
                        <Result response={aiResponse} />
                    </div>
                </div>
            )}
        </>
    );
}
