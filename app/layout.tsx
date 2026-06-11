import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Appbar from "@/components/Appbar";
import { Toaster } from "sonner";
import AuthWatcher from "@/components/AuthWatcher";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syce",
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
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body
        className={`${spaceGrotesk.variable} ${geistMono.variable} ${syne.variable} bg-black font-sans antialiased`}
      >
        <Providers>
          <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden bg-black">
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
