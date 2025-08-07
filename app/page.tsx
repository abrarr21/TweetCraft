import Hero from "@/components/Hero";
import MainPage from "@/components/Main";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 md:gap-8">
            <Hero />
            <MainPage />
        </div>
    );
}
