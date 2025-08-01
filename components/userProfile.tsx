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
                                src={"/profile.jpg"}
                                alt={session?.user?.name || "User"}
                            />
                        </Avatar>
                    ) : (
                        <div className="cursor-pointer p-2 rounded-full transition-colors">
                            <LayoutGrid className="w-6 h-6 text-white" />
                        </div>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-36 md:w-48 bg-zinc-900 border-zinc-700 text-white"
                    align="end"
                >
                    {session ? (
                        <>
                            <DropdownMenuLabel>
                                {session.user?.name || "My Account"}
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="text-red-600 focus:text-red-600"
                            >
                                Sign out
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuLabel>Welcome</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => signIn("google")}
                                className="text-blue-600 focus:text-blue-600"
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
