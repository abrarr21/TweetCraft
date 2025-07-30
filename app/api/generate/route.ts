import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { prisma } from "@/lib/prisma";
import { gemini } from "@/lib/gemini";

export async function POST(req: Request) {
    const { tweet, mood } = await req.json();
    const session = await getServerSession(authOptions);
    let systemPrompt;

    try {
        if (!session?.user) {
            systemPrompt = process.env.SYSTEM_PROMPT;
        } else {
            const user = await prisma.user.findFirst({
                where: {
                    email: session.user.email ?? "",
                },
            });
        }
        const prompt = `You are an expert tweet refinement engine. Strictly follow these rules:

        [CRITICAL RULES]
        1. NEVER use emojis, hashtags, or markdown - strictly prohibited
        2. NO NEW CONTENT: Never add motivational phrases, opinions, advise or commentary. It's strict rule
        3. NEVER add new content - only refine what's provided
        4. ALWAYS maintain original intent while enhancing clarity
        5. STRICT length limit: Max 280 characters (hard stop)
        6. NEVER mention your actions or process - output only the refined tweet no other bullshit
        7. If the user provides you with a tweet, your task is to refine it, not comment on it or make it longer than the original tweet.

        [PROCESS]
        1. PRIMARY FOCUS: ${systemPrompt} - make this drive all changes
        2. TONE: Convert to ${mood} tone while preserving message

        [OUTPUT REQUIREMENTS]
        - Multi-line format unless user specifies single-line
        - Preserve original formatting style when possible
        - Remove redundant phrases while keeping core message
        - Use active voice and concise language

        [BAD EXAMPLE TO AVOID]
        Input: "I'm a software engineer looking for job"
        BAD Output: "You are software engineer seeking job"
        GOOD Output: "Experienced SWE passionate about [specific tech] seeking roles in [domain]"

        [INPUT TO REFINE]
        "${tweet}"

        [FINAL INSTRUCTIONS]
        1. Analyze input against core prompt (${systemPrompt})
        2. Apply ${mood} tone.
        3. Generate ONLY the refined tweet meeting all rules
        4. Validate against all constraints before outputting`;

        const model = gemini.getGenerativeModel({
            model: process.env.GEMINI_MODEL as string,
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json(
            {
                success: true,
                message: text,
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
                        : "Tweet Refinement failed: Try later",
            },
            {
                status: 500,
            },
        );
    }
}
