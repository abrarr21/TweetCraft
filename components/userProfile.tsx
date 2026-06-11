"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LayoutGrid } from "lucide-react";

export default function UserProfile() {
  const { data: session } = useSession();

  return (
    <div className="top-4 right-4 z-20 flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {session ? (
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={session.user?.image || "/profile.jpg"}
                alt={session?.user?.name || "User"}
              />
            </Avatar>
          ) : (
            <div className="cursor-pointer rounded-full p-2 transition-colors">
              <LayoutGrid className="text-neutral-200 hover:text-neutral-600" />
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-44 border-zinc-700 bg-zinc-900 text-white"
          align="end"
        >
          {session ? (
            <>
              <DropdownMenuLabel className="flex flex-col gap-0.5 border-b border-zinc-800 pb-2">
                <span className="truncate text-sm font-semibold text-neutral-200">
                  {session.user?.name || "My Account"}
                </span>
                <span className="truncate font-mono text-[10px] text-zinc-500">
                  {session.user?.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  sessionStorage.setItem("auth_action", "signout");
                  signOut({ callbackUrl: "/" });
                }}
                className="mt-1 cursor-pointer text-red-500 focus:bg-zinc-800/50 focus:text-red-500"
              >
                Sign out
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuLabel className="flex flex-col gap-0.5 border-b border-zinc-800 pb-2">
                <span className="text-sm font-semibold text-neutral-200">
                  Guest User
                </span>
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  sessionStorage.setItem("auth_action", "signin");
                  signIn("google");
                }}
                className="mt-1 cursor-pointer text-blue-500 focus:bg-zinc-800/50 focus:text-blue-500"
              >
                Sign In
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
