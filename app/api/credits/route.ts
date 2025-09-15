import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/getClientIp";
import { checkRateLimit } from "@/lib/ratelimit";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
        // Authenticated User: 10 Reqs/min
        const rate = await checkRateLimit({
            key: `auth_user_${session.user.email}`,
            limit: 10,
            window: 60,
        });

        return NextResponse.json({
            credits: rate.remaining,
            limit: rate.limit,
        });
    }

    const ip = await getClientIp();
    const rate = await checkRateLimit({
        key: `guest_user_${ip}`,
        limit: 2,
        window: 60 * 60 * 24,
    });

    return NextResponse.json({ credits: rate.remaining, limit: rate.limit });
}
