"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthWatcher() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const action = sessionStorage.getItem("auth_action");
    if (action) {
      if (status === "authenticated" && action === "signin") {
        toast.success("Signed in successfully", { duration: 2000 });
      } else if (status === "unauthenticated" && action === "signout") {
        toast("Signed out successfully", { duration: 2000 });
      }
      // Clear the action so it doesn't trigger again on subsequent refreshes
      sessionStorage.removeItem("auth_action");
    }
  }, [status]);

  return null;
}
