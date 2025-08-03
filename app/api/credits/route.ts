import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/getClientIp";
import { redis } from "@/lib/redis";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
        return NextResponse.json({ credits: "infinite" });
    }

    const ip = await getClientIp();
    const redisKey = `redis_guest_${ip}`;
    const used = Number(await redis.get(redisKey)) || 0;
    const remaining = Math.max(2 - used, 0);

    return NextResponse.json({ credits: remaining });
}
