import Link from "next/link";
import UserProfile from "./userProfile";
import CorepropmtBtn from "./CorepromptBtn";

export default function Appbar() {
    return (
        <header className="mt-6 w-full px-4 md:mt-6 md:px-10">
            <nav className="flex w-full items-center justify-between">
                <h1 className="z-100">
                    <Link
                        href="/"
                        className="cursor-pointer text-2xl font-bold text-neutral-200"
                    >
                        TweetCraft
                    </Link>
                </h1>
                <div className="z-100 flex items-center justify-center gap-3 md:gap-5">
                    <CorepropmtBtn />
                    <UserProfile />
                </div>
            </nav>
        </header>
    );
}
