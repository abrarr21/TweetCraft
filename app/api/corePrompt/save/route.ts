import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return NextResponse.json(
            {
                success: false,
                message: "User not authenticated",
            },
            { status: 401 },
        );
    }

    const { corePrompt }: { corePrompt: string } = await req.json();

    if (!corePrompt) {
        return NextResponse.json(
            {
                success: false,
                message: "Core prompt is required",
            },
            { status: 400 },
        );
    }

    try {
        await prisma.user.update({
            where: { email: userEmail },
            data: { corePrompt },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Core prompt saved successfully",
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: `Failed to save core prompt: ${error instanceof Error ? error.message : "Unkown error"}`,
            },
            { status: 500 },
        );
    }
}
