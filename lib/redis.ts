import { Redis as UpstashRedis } from "@upstash/redis";
import type IORedis from "ioredis";

// Create a union type for better type handling
export type RedisClient = UpstashRedis | IORedis;

export const redis: Promise<RedisClient> = (async () => {
    if (process.env.NODE_ENV === "production") {
        const { Redis } = await import("@upstash/redis");
        if (
            !process.env.UPSTASH_REDIS_REST_URL ||
            !process.env.UPSTASH_REDIS_REST_TOKEN
        ) {
            throw new Error("Upstash Redis env vars missing");
        }
        return new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    } else {
        const IORedis = (await import("ioredis")).default;
        if (!process.env.REDIS_URL) throw new Error("Local Redis URL missing");
        return new IORedis(process.env.REDIS_URL);
    }
})();
