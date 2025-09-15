import axios from "axios";

const COOKIE = "next-auth.session-token=<COOKIE>"; // Replace with your cookie

const URL = "http://localhost:3000/api/debug/rate-test"; // Your API endpoint

async function hammer() {
    for (let i = 1; i <= 12; i++) {
        try {
            const res = await axios.get(URL, {
                headers: {
                    Cookie: COOKIE,
                },
            });

            console.log(
                `Request ${i} → Status: ${res.status} | Used: ${res.data.used} | TTL: ${res.data.ttl}`,
            );
        } catch (err: any) {
            if (err.response) {
                console.error(
                    `Request ${i} failed → Status: ${err.response.status} | Message: ${JSON.stringify(err.response.data)}`,
                );
            } else {
                console.error(`Request ${i} failed → ${err.message}`);
            }
        }
    }
}

hammer();

// hammer.ts (debug route variant)
// 1.Tum /api/debug/rate pe hit kar rahe ho.
// 2.Ye sirf Redis se value read karta hai (used, ttl).
// 3.Increment nahi hota.
//
// Output me hamesha used=0, aur agar key bana hi nahi to ttl=-2.
// 👉 Iska use sirf check karne ke liye hai ki Redis me key ka state kya hai.
