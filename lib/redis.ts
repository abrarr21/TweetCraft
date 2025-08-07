// redis.ts
export const redis = (async () => {
    if (process.env.NODE_ENV === "production") {
        const { Redis } = await import("@upstash/redis");
        return new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });
    } else {
        const Redis = (await import("ioredis")).default;
        return new Redis(process.env.REDIS_URL!);
    }
})();
