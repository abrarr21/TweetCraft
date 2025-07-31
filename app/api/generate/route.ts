import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { prisma } from "@/lib/prisma";
import { gemini } from "@/lib/gemini";
import { getClientIp } from "@/lib/getClientIp";
import { redis } from "@/lib/redis";
import { generatePrompt } from "@/lib/prompt";

type Body = {
    tweet: string;
    tone: string;
};

export async function POST(req: Request) {
    try {
        const { tweet, tone }: Body = await req.json();

        if (!tweet || !tone) {
            return NextResponse.json(
                { success: false, message: "Tweent and Tone are required" },
                { status: 400 },
            );
        }

        const session = await getServerSession(authOptions);
        let promptInput: string;
        let userId: number | undefined = undefined;

        if (session?.user?.email) {
            const user = await prisma.user.findFirst({
                where: {
                    email: session.user.email,
                },
            });
            if (user) {
                promptInput = user.corePrompt ?? process.env.SYSTEM_PROMPT!;
                userId = user.id;
            } else {
                promptInput = process.env.SYSTEM_PROMPT!;
            }
        } else {
            const ip = getClientIp();
            const redisKey = `redis_guest_${ip}`;
            const usage = await redis.incr(redisKey);
            if (usage > 2) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Free limit exceeded. Please login to continue using the service.",
                        requireauth: true,
                    },
                    { status: 403 },
                );
            }

            promptInput = process.env.SYSTEM_PROMPT!;
        }

        const prompt = generatePrompt({
            tweet,
            tone,
            systemPrompt: promptInput,
        });

        const model = gemini.getGenerativeModel({
            model: process.env.GEMINI_MODEL as string,
        });

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        if (userId) {
            await prisma.interactions.create({
                data: {
                    userPrompt: tweet,
                    aiResponse: aiResponse,
                    tone: tone,
                    userId: userId,
                },
            });
        }

        return NextResponse.json(
            {
                success: true,
                message: aiResponse,
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? `Tweet Refinement failed: ${error.message}`
                        : "Tweet Refinement failed: Try again later",
            },
            {
                status: 500,
            },
        );
    }
}
