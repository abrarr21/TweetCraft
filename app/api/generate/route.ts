import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { prisma } from "@/lib/prisma";
import { gemini } from "@/lib/gemini";
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

        const session = await getServerSession(authOptions);

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

        const model = gemini.getGenerativeModel({
            model: process.env.GEMINI_MODEL as string,
        });

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        if (!aiResponse) {
            throw new Error("AI response is empty or undefined");
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
