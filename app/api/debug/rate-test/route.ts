import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/option";
import { redis } from "@/lib/redis";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Not logged in" },
                { status: 401 },
            );
        }

        const key = `rate_user_${session.user.email}`;
        const redisClient = await redis;
        const used = Number(await redisClient.get(key)) || 0;
        const ttl = await redisClient.ttl(key);

        return NextResponse.json({ used, ttl });
    } catch (err) {
        return NextResponse.json(
            { error: (err as Error).message },
            { status: 500 },
        );
    }
}
