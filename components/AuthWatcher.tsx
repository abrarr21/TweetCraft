"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function AuthWatcher() {
    const { status } = useSession();
    const previousStatus = useRef(status);

    useEffect(() => {
        if (previousStatus.current !== status) {
            if (status === "authenticated") {
                toast.success("Signed in successfully", { duration: 2000 });
            } else if (status === "unauthenticated") {
                toast("Signed out successfully", { duration: 2000 });
            }

            previousStatus.current = status;
        }
    }, [status]);

    return null;
}
