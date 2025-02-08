import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";

import { NextAuthOptions } from "next-auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/models/User";

declare module "next-auth" {
	interface Session {
		user: {
			_id?: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID!,
			clientSecret: process.env.DISCORD_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async signIn({ user, account }) {
			await connectToDatabase();

			const existingUser = await User.findOne({ email: user.email });

			if (!existingUser) {
				const newUser = new User({
					name: user.name,
					email: user.email,
					image: user.image,
					provider: account?.provider,
				});
				await newUser.save();
			}

			return true;
		},
		async session({ session }) {
			await connectToDatabase();
			const dbUser = (await User.findOne({ email: session.user?.email })) as { _id: string };

			if (dbUser && session.user) {
				session.user._id = dbUser._id.toString();
			}

			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET!,
};

// Define the named export for Next.js App Router
const handler = NextAuth(authOptions);
export { handler as POST, handler as GET };
