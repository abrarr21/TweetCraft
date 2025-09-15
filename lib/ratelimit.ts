import { redis } from "@/lib/redis";

type LimitConfig = {
    key: string;
    limit: number;
    window: number; // in seconds
};

export async function checkRateLimit({ key, limit, window }: LimitConfig) {
    const redisClient = await redis;
    const usage = await redisClient.incr(key);

    if (usage === 1) {
        // first time -> set expiry
        await redisClient.expire(key, window);
    }

    const remaining = Math.max(limit - usage, 0);
    const isAllowed = usage <= limit;

    return {
        isAllowed,
        remaining,
        limit,
        resetIn: window,
    };
}
