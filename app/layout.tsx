import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Appbar from "@/components/Appbar";

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
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
            >
                <Providers>
                    <div className="min-h-screen w-full bg-black relative overflow-x-hidden">
                        {/* Midnight Mist */}
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%)
        `,
                            }}
                        />
                        {/* Your Content/Components */}
                        <Appbar />
                        <div className="relative z-10">{children}</div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
