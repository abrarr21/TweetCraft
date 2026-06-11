import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/getClientIp";
import { redis } from "@/lib/redis";

export async function GET() {
  const session = await getServerSession(authOptions);
  const redisClient = await redis;

  if (session?.user?.email) {
    // Authenticated User: 10 Reqs/min
    const key = `auth_user_${session.user.email}`;
    const actualUsage = Number(await redisClient.get(key)) || 0;
    const actualRemaining = Math.max(10 - actualUsage, 0);

    return NextResponse.json({
      credits: actualRemaining,
      limit: 10,
    });
  }

  // Guest User: 2 reqs/hour
  const ip = await getClientIp();
  const actualUsage = (await redisClient.get(`guest_user_${ip}`)) || 0;
  const actualRemaining = Math.max(2 - Number(actualUsage), 0);

  return NextResponse.json({ credits: actualRemaining, limit: 2 });
}
