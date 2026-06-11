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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <DialogContent className="border-zinc-800 bg-zinc-950/95 text-white shadow-[0_0_50px_-12px_rgba(236,72,153,0.35)] backdrop-blur-md sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-100">
            Custom Prompt
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Customize your prompt to get the personalized output
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <textarea
                id="prompt"
                name="prompt"
                placeholder="E.g. Craft goal-driven tweets using emojis, line breaks, and the right tone."
                className="max-h-[140px] min-h-[100px] w-full resize-none rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white shadow-sm placeholder:text-zinc-500 focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 focus-visible:outline-none"
                rows={1}
                onInput={(e) => {
                  const target = e.currentTarget;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2">
            <DialogClose asChild>
              <button className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-zinc-800 hover:text-white">
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="cursor-pointer rounded-lg border border-pink-700 bg-pink-900/30 px-4 py-2 text-sm text-pink-200 transition-colors hover:bg-pink-900/50 hover:text-pink-100"
            >
              Save changes
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
