import { headers } from "next/headers";

export async function getClientIp(): Promise<string> {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim() ?? "unknown";
    }

    return "unknown";
}
