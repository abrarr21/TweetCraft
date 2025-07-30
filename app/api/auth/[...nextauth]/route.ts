import NEXTAUTH from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

const handler = NEXTAUTH(authOptions);

export { handler as GET, handler as POST };
