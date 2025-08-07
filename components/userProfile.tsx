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
import CreditButton from "./creditBtn";

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
                        <div className="cursor-pointer rounded-full p-2 transition-colors">
                            <LayoutGrid className="text-neutral-200 hover:text-neutral-600" />
                        </div>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-32 border-zinc-700 bg-zinc-900 text-white md:w-36"
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

                            <DropdownMenuItem>
                                <CreditButton />
                            </DropdownMenuItem>
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
