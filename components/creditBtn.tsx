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
      toast.error("Failed to fetch credits.");
    }
  }, [error]);

  // Blinking dot color conditions
  let dotColor = "bg-emerald-500 shadow-[0_0_8px_#10b981]";
  if (isLoading) {
    dotColor = "bg-amber-500 shadow-[0_0_8px_#f59e0b]";
  } else if (error || data?.credits === 0) {
    dotColor = "bg-rose-500 shadow-[0_0_8px_#f43f5e]";
  }

  // Informative text (e.g., "Credits: 10/10")
  let displayCredits = "loading...";
  if (error) {
    displayCredits = "error";
  } else if (!isLoading) {
    displayCredits = `${data?.credits}/${data?.limit}`;
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-zinc-800/80 bg-zinc-950/45 px-2 py-0.5 text-[10px] font-semibold text-neutral-300 shadow-sm backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-xs">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`} />
      <span className="tracking-wide select-none">
        Credits: {displayCredits}
      </span>
    </div>
  );
}
