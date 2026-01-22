import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { prisma } from "@/lib/prisma";
import { llama } from "@/lib/llama";
import { getClientIp } from "@/lib/getClientIp";
import { generatePrompt } from "@/lib/prompt";
import { checkRateLimit } from "@/lib/ratelimit";

type Body = {
    tweet: string;
    tone: string;
};

export async function POST(req: Request) {
    try {
        const { tweet, tone }: Body = await req.json();

        if (!tweet || !tone) {
            return NextResponse.json(
                { success: false, message: "Tweet and Tone are required" },
                { status: 400 },
            );
        }

        if (!process.env.SYSTEM_PROMPT || !process.env.GEMINI_MODEL) {
            return NextResponse.json(
                { success: false, message: "Server misconfigured" },
                { status: 500 },
            );
        }

        let session = null;
        try {
            session = await getServerSession(authOptions);
        } catch (error) {
            console.warn(
                "Failed to get session (user will be treated as guest):",
                error,
            );
            session = null;
        }

        let promptInput: string;
        let userId: number | undefined = undefined;

        if (session?.user?.email) {
            const rate = await checkRateLimit({
                key: `auth_user_${session?.user?.email}`,
                limit: 10,
                window: 60,
            });

            if (!rate.isAllowed) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Rate limit exceeded. Max 10 reqs/min",
                    },
                    { status: 429 },
                );
            }

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
            const ip = await getClientIp();
            console.log("Detected IP ---->  ", ip);
            const rate = await checkRateLimit({
                key: `guest_user_${ip}`,
                limit: 2,
                window: 60 * 60,
            });

            if (!rate.isAllowed) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Free limit exceeded. Please login.",
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

        let aiResponse: string;
        try {
            const chatCompletion = await llama.chatCompletion({
                model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
                messages: [
                    {
                        role: "system",
                        content:
                            "Rewrite the tweet exactly in the requested tone. Return ONLY the tweet text with approriate emoji (if needed). Do NOT add any explanations, notes, or extra content.",
                    },
                    { role: "user", content: prompt },
                ],
            });

            const content = chatCompletion?.choices[0]?.message?.content;
            if (!content) throw new Error("AI response is Empty");

            aiResponse = content;
            if (!aiResponse) throw new Error("AI response is empty");
        } catch (err: any) {
            console.error("AI generation error:", err);

            if (err.code === 429 || err.message.includes("quota")) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "AI quota exceeded. Please wait or upgrade.",
                    },
                    { status: 429 },
                );
            }

            throw err;
        }

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
