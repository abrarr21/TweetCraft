"use client";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Cog } from "lucide-react";

export default function DialogDemo() {
    const [input, setInput] = useState("");

    const isOnlyWhitespaces = (str: string) => str.trim() === "";
    const isOnlyNumber = (str: string) => /^\d+$/.test(str);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isOnlyWhitespaces(input) || isOnlyNumber(input)) {
            toast.error(
                "Please enter a valid prompt(not empty string or only numbers)",
            );
            return;
        }

        try {
            const res = await axios.post("/api/corePrompt/save", {
                corePrompt: input.trim(),
            });
            console.log("Submitted successfully", res.data);
            toast.success("Core prompt saved successfully");
            setInput("");
        } catch (error: any) {
            console.log("Error submitting", error);

            if (error.response?.status === 400) {
                toast.error("Invalid prompt format");
            } else if (error.response?.status === 401) {
                toast.error("Authentication required");
            } else if (error.response?.status >= 500) {
                toast.error("Server error. Please try again later");
            } else {
                toast.error("Error saving prompt");
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="cursor-pointer text-neutral-200 hover:text-neutral-600">
                    <Cog />
                </button>
            </DialogTrigger>
            <DialogContent className="curtom-gradient sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Custom Prompt</DialogTitle>
                    <DialogDescription className="text-neutral-800">
                        Customize your prompt to get the personlized output{" "}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            {/* <Label htmlFor="prompt">Custom Prompt</Label> */}
                            <textarea
                                id="prompt"
                                name="prompt"
                                placeholder="E.g. Craft goal-driven tweets using emojis, line breaks, and the right tone."
                                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring max-h-[140px] min-h-[100px] w-full resize-none rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                                rows={1}
                                onInput={(e) => {
                                    const target = e.currentTarget;
                                    target.style.height = "auto";
                                    target.style.height =
                                        target.scrollHeight + "px";
                                }}
                                onChange={(e) => setInput(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-3">
                        <DialogClose asChild>
                            <button className="cursor-pointer rounded-lg bg-neutral-800 p-2 text-neutral-100">
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            type="submit"
                            className="cursor-pointer rounded-lg bg-neutral-800 p-2 text-neutral-100"
                        >
                            Save changes
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
