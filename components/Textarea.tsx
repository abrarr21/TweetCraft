"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { Forward } from "lucide-react";
import { useState } from "react";
import Result from "./Result";

export default function Textarea() {
    const [content, setContent] = useState("");
    const [selectedTone, setSelectedTone] = useState("Formal");
    const [aiResponse, setAiResponse] = useState<null | string>(null);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post("/api/generate", {
                tweet: content,
                tone: selectedTone,
            });
            setAiResponse(res?.data?.message);
            console.log(res.data);
            setContent("");
        } catch (error) {
            console.log("Error sending content: ", error);
        }
    };
    return (
        <>
            <main className=" w-9/12 min-h-10 md:w-7/12 md:min-h-28 border-2 rounded-md border-zinc-500 bg-gray-400/30 shadow-lg">
                <textarea
                    placeholder="Drop your Tweet here..."
                    rows={2}
                    onInput={handleInput}
                    onChange={(e) => setContent(e.target.value)}
                    className="p-2 mt-2 flex min-h-[30px] h-fit max-h-[250px] w-full resize-none 
             overflow-y-auto rounded-md border-none text-base 
             placeholder:text-muted-foreground focus:outline-none 
             focus:border-none focus-visible:outline-none focus-visible:ring-0 
             disabled:cursor-not-allowed disabled:opacity-50 
             text-white shadow-none bg-transparent 
             md:text-sm max-sm:text-xs"
                />
                <div className="flex px-2 md:px-6 mt-2 mb-2 justify-between items-center">
                    <div className="">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="px-8 py-1 text-base rounded-md border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-white focus:outline-none focus:ring-0 shadow-none cursor-pointer">
                                {selectedTone}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-20 md:w-32 bg-zinc-950/40 border-zinc-700 text-white">
                                {[
                                    "Casual",
                                    "Formal",
                                    "Hilarious",
                                    "Serious",
                                ].map((tone) => (
                                    <DropdownMenuItem
                                        key={tone}
                                        onClick={() => setSelectedTone(tone)}
                                    >
                                        {" "}
                                        {tone}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <button
                        disabled={!content.trim()}
                        className={` p-1 border-zinc-700 text-white bg-zinc-900/50 rounded-lg ${
                            content.trim()
                                ? "cursor-pointer"
                                : "cursor-not-allowed opacity-50"
                        }`}
                        onClick={handleSubmit}
                    >
                        <Forward />
                    </button>
                </div>
            </main>

            {aiResponse?.trim() && (
                <div>
                    <Result response={aiResponse} />
                </div>
            )}
        </>
    );
}
