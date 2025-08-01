import Link from "next/link";
import UserProfile from "./userProfile";

export default function Appbar() {
    return (
        <header className="w-full px-4 mt-6 md:px-8 md:mt-8">
            <nav className="w-full flex items-center justify-between">
                <h1>
                    <Link href="/" className="text-2xl font-bold text-white">
                        TweetCraft
                    </Link>
                </h1>

                <UserProfile />
            </nav>
        </header>
    );
}
