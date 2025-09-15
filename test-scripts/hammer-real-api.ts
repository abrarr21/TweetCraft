import axios from "axios";

// scripts/hammer.ts
const COOKIE = "next-auth.session-token=<COOKIE>"; // Replace with your cookie

const URL = "http://localhost:3000/api/gnerate"; // Your API endpoint

async function main() {
    for (let i = 1; i <= 12; i++) {
        try {
            const res = await axios.post(
                URL,
                {
                    tweet: "One's reality might be another's illusion. We all live inside our own fantasies.",
                    tone: "persuasive",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: COOKIE,
                    },
                },
            );

            console.log(
                `Request ${i} → Status: ${res.status} | Response:`,
                res.data,
            );
        } catch (err: any) {
            console.error(
                `Request ${i} failed → Status: ${err.response?.status} | Message: ${err.response?.data?.message ?? err.message}`,
            );
        }
    }
}

main();

// hammer.ts (real API variant, e.g. /api/generate)
// 1.Ye tumhari actual API ko hammer karta hai jisme rate-limit increment logic hai.
// 2.Har request ke saath Redis key increment hota hai.
// 3.Pehle 10 requests → 200 OK (used count badhta rahega).
//
// 11th request onwards → 429 Too Many Requests.
// 👉 Iska use hai rate limiter ka actual stress test karna.
