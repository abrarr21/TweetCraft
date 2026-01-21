import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Appbar from "@/components/Appbar";
import { Toaster } from "sonner";
import AuthWatcher from "@/components/AuthWatcher";
import Footer from "@/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "TweetCraft",
    description: "A tool for crafting tweets with AI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} bg-black antialiased`}
            >
                <Providers>
                    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black">
                        {/* Magenta Nebula Background with Top Glow */}
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                background:
                                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236, 72, 153, 0.25), transparent 70%), #000000",
                            }}
                        />

                        {/* Your Content/Components */}
                        <Appbar />
                        <div className="relative z-10">{children}</div>
                    </div>
                    <footer className="z-10">
                        <Footer />
                    </footer>
                    <AuthWatcher />
                </Providers>
                <Toaster richColors position="bottom-right" />
            </body>
        </html>
    );
}
