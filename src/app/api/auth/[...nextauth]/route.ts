import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

const handler = NextAuth(authOptions);
export { handler as POST, handler as GET };
